#![no_implicit_prelude]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Signed, typed, authorization-checked server actions with replay protection.

extern crate alloc;
extern crate core;
extern crate feluqa_auth;
extern crate hmac;
extern crate serde;
extern crate serde_json;
extern crate sha2;
extern crate std;
extern crate zeroize;

use alloc::boxed::Box;
use alloc::collections::BTreeMap;
use alloc::string::String;
use alloc::vec::Vec;
use core::convert::From;
use core::fmt;
use core::iter::Iterator;
use core::marker::{Send, Sync};
use core::ops::Fn;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use feluqa_auth::{Authorizer, Permission, Principal};
use hmac::Mac;
use serde::de::DeserializeOwned;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::Sha256;
use zeroize::Zeroizing;

const MAX_TOKEN_BYTES: usize = 8_192;
const MAX_SNAPSHOT_TTL_SECONDS: u64 = 86_400;
const MAX_PAYLOAD_BYTES: usize = 65_536;
const CLAIM_VERSION: u8 = 1;

type HmacSha256 = hmac::Hmac<Sha256>;

/// Signed, non-secret snapshot metadata. Client-visible state must never include credentials.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SnapshotClaims {
    /// Claims schema version.
    pub version: u8,
    /// Authenticated principal subject.
    pub subject: String,
    /// Tenant binding, if the principal belongs to a tenant.
    pub tenant: Option<String>,
    /// Validated server-side session identifier.
    pub session: String,
    /// One registered action ID this snapshot can invoke.
    pub action: String,
    /// Exact permission required for the action.
    pub permission: String,
    /// Unpredictable CSRF value checked against the request.
    pub csrf: String,
    /// Unpredictable, one-use replay nonce.
    pub nonce: String,
    /// Expected UI state revision.
    pub revision: u64,
    /// Unix timestamp after which the snapshot is invalid.
    pub expires_at: u64,
}

impl SnapshotClaims {
    /// Construct claims for one action. Session, CSRF token, nonce and expiry come from trusted code.
    // Each argument is one independently checked security binding in the signed snapshot.
    #[allow(clippy::too_many_arguments)]
    pub fn new(
        subject: String,
        tenant: Option<String>,
        session: String,
        action: String,
        permission: Permission,
        csrf: String,
        nonce: String,
        revision: u64,
        expires_at: u64,
    ) -> Result<Self, LiveError> {
        let claims = Self {
            version: CLAIM_VERSION,
            subject,
            tenant,
            session,
            action,
            permission: String::from(permission.as_str()),
            csrf,
            nonce,
            revision,
            expires_at,
        };
        claims.validate(0)?;
        Ok(claims)
    }

    fn validate(&self, now: u64) -> Result<(), LiveError> {
        if self.version != CLAIM_VERSION
            || self.subject.is_empty()
            || self.session.is_empty()
            || self.action.is_empty()
            || self.permission.is_empty()
            || self.csrf.len() < 16
            || self.nonce.len() < 16
            || self.expires_at <= now
            || (now > 0 && self.expires_at.saturating_sub(now) > MAX_SNAPSHOT_TTL_SECONDS)
            || self.tenant.as_ref().is_some_and(String::is_empty)
        {
            return Err(LiveError::InvalidSnapshot);
        }
        Ok(())
    }
}

/// HMAC-SHA-256 signer for snapshots; key material is zeroized when dropped.
pub struct SnapshotSigner {
    key: Zeroizing<Vec<u8>>,
}

impl SnapshotSigner {
    /// Create a signer from at least 256 bits of secret key material.
    pub fn new(key: Vec<u8>) -> Result<Self, LiveError> {
        if key.len() < 32 {
            return Err(LiveError::WeakSigningKey);
        }
        Ok(Self {
            key: Zeroizing::new(key),
        })
    }

    /// Sign claims and return a URL-safe hex token. Use a CSPRNG for nonces and CSRF tokens.
    pub fn sign(&self, claims: &SnapshotClaims) -> Result<String, LiveError> {
        claims.validate(0)?;
        let payload = serde_json::to_vec(claims).map_err(|_| LiveError::InvalidSnapshot)?;
        if payload.len() > MAX_TOKEN_BYTES {
            return Err(LiveError::TokenTooLarge);
        }
        let mut mac = <HmacSha256 as Mac>::new_from_slice(&self.key)
            .map_err(|_| LiveError::WeakSigningKey)?;
        mac.update(&payload);
        let signature = mac.finalize().into_bytes();
        let mut token = hex_encode(&payload);
        token.push('.');
        token.push_str(&hex_encode(&signature));
        Ok(token)
    }

    /// Verify signature, schema and expiry before exposing claims to the action dispatcher.
    pub fn verify(&self, token: &str, now: u64) -> Result<SnapshotClaims, LiveError> {
        if token.len() > MAX_TOKEN_BYTES * 2 + 128 {
            return Err(LiveError::TokenTooLarge);
        }
        let (payload_hex, signature_hex) =
            token.split_once('.').ok_or(LiveError::InvalidSnapshot)?;
        let payload = hex_decode(payload_hex)?;
        let signature = hex_decode(signature_hex)?;
        let mut mac = <HmacSha256 as Mac>::new_from_slice(&self.key)
            .map_err(|_| LiveError::WeakSigningKey)?;
        mac.update(&payload);
        mac.verify_slice(&signature)
            .map_err(|_| LiveError::InvalidSignature)?;
        let claims: SnapshotClaims =
            serde_json::from_slice(&payload).map_err(|_| LiveError::InvalidSnapshot)?;
        claims.validate(now)?;
        Ok(claims)
    }
}

fn hex_encode(bytes: &[u8]) -> String {
    const HEX: &[u8; 16] = b"0123456789abcdef";
    let mut output = String::with_capacity(bytes.len() * 2);
    for byte in bytes {
        output.push(char::from(HEX[usize::from(byte >> 4)]));
        output.push(char::from(HEX[usize::from(byte & 0x0f)]));
    }
    output
}

fn hex_decode(value: &str) -> Result<Vec<u8>, LiveError> {
    if value.len() % 2 != 0 || !value.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err(LiveError::InvalidSnapshot);
    }
    let mut bytes = Vec::with_capacity(value.len() / 2);
    for pair in value.as_bytes().chunks_exact(2) {
        let high = hex_nibble(pair[0]).ok_or(LiveError::InvalidSnapshot)?;
        let low = hex_nibble(pair[1]).ok_or(LiveError::InvalidSnapshot)?;
        bytes.push((high << 4) | low);
    }
    Ok(bytes)
}

fn hex_nibble(value: u8) -> Option<u8> {
    match value {
        b'0'..=b'9' => Some(value - b'0'),
        b'a'..=b'f' => Some(value - b'a' + 10),
        b'A'..=b'F' => Some(value - b'A' + 10),
        _ => None,
    }
}

/// One-way nonce claim. Production implementations must be atomic and shared by every server node.
pub trait ReplayGuard: Send + Sync {
    /// Return `true` once, and `false` when this nonce has already been consumed.
    fn consume(&self, nonce: &str, expires_at: u64, now: u64) -> Result<bool, LiveError>;
}

/// Bounded in-memory replay guard for single-process development and tests.
pub struct InMemoryReplayGuard {
    capacity: usize,
    entries: std::sync::Mutex<BTreeMap<String, u64>>,
}

impl InMemoryReplayGuard {
    /// Create a bounded cache. It is not suitable for multi-process or durable production use.
    pub fn new(capacity: usize) -> Result<Self, LiveError> {
        if capacity == 0 {
            return Err(LiveError::InvalidReplayCapacity);
        }
        Ok(Self {
            capacity,
            entries: std::sync::Mutex::new(BTreeMap::new()),
        })
    }
}

impl ReplayGuard for InMemoryReplayGuard {
    fn consume(&self, nonce: &str, expires_at: u64, now: u64) -> Result<bool, LiveError> {
        let mut entries = self
            .entries
            .lock()
            .map_err(|_| LiveError::ReplayStoreUnavailable)?;
        entries.retain(|_, expiry| *expiry > now);
        if entries.contains_key(nonce) {
            return Ok(false);
        }
        if entries.len() >= self.capacity {
            return Err(LiveError::ReplayStoreFull);
        }
        entries.insert(String::from(nonce), expires_at);
        Ok(true)
    }
}

/// Request envelope submitted by the browser. Cookie/session validation remains in the host app.
pub struct ActionRequest {
    /// HMAC-signed snapshot token created by trusted server code.
    pub snapshot: String,
    /// Session identifier already validated by the host application.
    pub session: String,
    /// CSRF token supplied by the browser.
    pub csrf: String,
    /// Registered action ID requested by the browser.
    pub action: String,
    /// UI revision observed by the browser.
    pub revision: u64,
    /// JSON payload deserialized into the action's Rust input type.
    pub payload: Value,
}

/// Successful action output and its monotonically advanced UI revision.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ActionResponse {
    /// Serialized typed handler output.
    pub value: Value,
    /// Next UI revision after successful execution.
    pub revision: u64,
}

/// Browser-submitted action fields. The host supplies trusted session and CSRF values.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ClientActionRequest {
    /// HMAC-signed snapshot emitted by trusted server code.
    pub snapshot: String,
    /// Registered action ID requested by the browser.
    pub action: String,
    /// UI revision observed by the browser.
    pub revision: u64,
    /// JSON value deserialized into the action's Rust input type.
    pub payload: Value,
}

/// Trusted server values used when issuing one action snapshot.
pub struct SnapshotIssue {
    /// Validated Core session identifier, never the raw browser cookie.
    pub session: String,
    /// CSRF value bound to the validated session.
    pub csrf: String,
    /// ID of a registered action.
    pub action: String,
    /// Cryptographically random one-use nonce.
    pub nonce: String,
    /// Current UI revision.
    pub revision: u64,
    /// Current Unix time in seconds.
    pub now: u64,
    /// Snapshot lifetime, bounded to one day.
    pub lifetime_seconds: u64,
}

/// Validated identity metadata passed to business handlers.
#[derive(Clone, Debug)]
pub struct ActionContext {
    /// Authenticated principal subject.
    pub subject: String,
    /// Tenant binding from the authenticated principal.
    pub tenant: Option<String>,
}

trait ErasedAction: Send + Sync {
    fn permission(&self) -> &Permission;
    fn execute(&self, context: &ActionContext, payload: Value) -> Result<Value, LiveError>;
}

struct TypedAction<I, O, F> {
    permission: Permission,
    handler: F,
    marker: core::marker::PhantomData<fn(I) -> O>,
}

impl<I, O, F> ErasedAction for TypedAction<I, O, F>
where
    I: DeserializeOwned + Send,
    O: Serialize + Send,
    F: Fn(&ActionContext, I) -> Result<O, String> + Send + Sync,
{
    fn permission(&self) -> &Permission {
        &self.permission
    }

    fn execute(&self, context: &ActionContext, payload: Value) -> Result<Value, LiveError> {
        let input = serde_json::from_value(payload).map_err(|_| LiveError::InvalidActionInput)?;
        let output = (self.handler)(context, input).map_err(|_| LiveError::ActionFailed)?;
        let value = serde_json::to_value(output).map_err(|_| LiveError::InvalidActionOutput)?;
        let encoded = serde_json::to_vec(&value).map_err(|_| LiveError::InvalidActionOutput)?;
        if encoded.len() > MAX_PAYLOAD_BYTES {
            return Err(LiveError::ActionOutputTooLarge);
        }
        Ok(value)
    }
}

/// Registry of typed, named server actions. Client payloads never name Rust functions.
#[derive(Default)]
pub struct ActionRegistry {
    actions: BTreeMap<String, Box<dyn ErasedAction>>,
}

impl ActionRegistry {
    /// Register a typed action and exact permission. IDs are namespaced stable identifiers.
    pub fn register<I, O, F>(
        &mut self,
        id: impl core::convert::Into<String>,
        permission: Permission,
        handler: F,
    ) -> Result<(), LiveError>
    where
        I: DeserializeOwned + Send + 'static,
        O: Serialize + Send + 'static,
        F: Fn(&ActionContext, I) -> Result<O, String> + Send + Sync + 'static,
    {
        let id = id.into();
        if !valid_action_id(&id) {
            return Err(LiveError::InvalidActionId);
        }
        if self.actions.contains_key(&id) {
            return Err(LiveError::DuplicateAction);
        }
        self.actions.insert(
            id,
            Box::new(TypedAction::<I, O, F> {
                permission,
                handler,
                marker: core::marker::PhantomData,
            }),
        );
        Ok(())
    }

    /// Return the exact permission bound to one registered action ID.
    pub fn permission_for(&self, id: &str) -> Option<&Permission> {
        self.actions.get(id).map(|action| action.permission())
    }

    /// Verify all request bindings, authorization and replay policy before calling the handler.
    pub fn dispatch(
        &self,
        signer: &SnapshotSigner,
        replay_guard: &impl ReplayGuard,
        authorizer: &impl Authorizer,
        principal: &Principal,
        request: ActionRequest,
        now: u64,
    ) -> Result<ActionResponse, LiveError> {
        if serde_json::to_vec(&request.payload)
            .map_err(|_| LiveError::InvalidActionInput)?
            .len()
            > MAX_PAYLOAD_BYTES
        {
            return Err(LiveError::PayloadTooLarge);
        }
        let claims = signer.verify(&request.snapshot, now)?;
        if claims.session != request.session
            || claims.csrf != request.csrf
            || claims.action != request.action
            || claims.revision != request.revision
            || claims.subject != principal.subject()
            || claims.tenant.as_deref() != principal.tenant()
        {
            return Err(LiveError::RequestBindingMismatch);
        }
        let action = self
            .actions
            .get(&request.action)
            .ok_or(LiveError::UnknownAction)?;
        if action.permission().as_str() != claims.permission {
            return Err(LiveError::RequestBindingMismatch);
        }
        authorizer
            .authorize(principal, action.permission())
            .map_err(|_| LiveError::Forbidden)?;
        let revision = request
            .revision
            .checked_add(1)
            .ok_or(LiveError::RevisionOverflow)?;
        if !replay_guard.consume(&claims.nonce, claims.expires_at, now)? {
            return Err(LiveError::Replay);
        }
        let context = ActionContext {
            subject: String::from(principal.subject()),
            tenant: principal.tenant().map(String::from),
        };
        let value = action.execute(&context, request.payload)?;
        Ok(ActionResponse { value, revision })
    }
}

/// Per-application Live signing, action dispatch and single-process replay runtime.
///
/// The in-memory guard is suitable only for one-process development. Production
/// deployments must use a shared atomic replay store before exposing Live actions.
pub struct LiveRuntime {
    signer: SnapshotSigner,
    replay_guard: InMemoryReplayGuard,
    actions: ActionRegistry,
}

impl LiveRuntime {
    /// Build a Live runtime from secret signing material and a prevalidated action registry.
    pub fn new(
        signing_key: Vec<u8>,
        replay_capacity: usize,
        actions: ActionRegistry,
    ) -> Result<Self, LiveError> {
        Ok(Self {
            signer: SnapshotSigner::new(signing_key)?,
            replay_guard: InMemoryReplayGuard::new(replay_capacity)?,
            actions,
        })
    }

    /// Issue an authorized, short-lived snapshot for a registered action.
    ///
    /// `nonce` must be generated with a cryptographically secure random source by
    /// the host application. Session and CSRF bindings must come from validated
    /// server-side state, never from request parameters.
    pub fn issue_snapshot(
        &self,
        principal: &Principal,
        issue: SnapshotIssue,
        authorizer: &impl Authorizer,
    ) -> Result<String, LiveError> {
        if issue.lifetime_seconds == 0 || issue.lifetime_seconds > MAX_SNAPSHOT_TTL_SECONDS {
            return Err(LiveError::InvalidSnapshot);
        }
        let permission = self
            .actions
            .permission_for(&issue.action)
            .ok_or(LiveError::UnknownAction)?;
        authorizer
            .authorize(principal, permission)
            .map_err(|_| LiveError::Forbidden)?;
        let expires_at = issue
            .now
            .checked_add(issue.lifetime_seconds)
            .ok_or(LiveError::InvalidSnapshot)?;
        let claims = SnapshotClaims::new(
            String::from(principal.subject()),
            principal.tenant().map(String::from),
            issue.session,
            issue.action,
            Permission::new(String::from(permission.as_str()))
                .map_err(|_| LiveError::InvalidSnapshot)?,
            issue.csrf,
            issue.nonce,
            issue.revision,
            expires_at,
        )?;
        self.signer.sign(&claims)
    }

    /// Dispatch a browser action after the host validates its session and CSRF header.
    pub fn dispatch(
        &self,
        principal: &Principal,
        session: String,
        csrf: String,
        request: ClientActionRequest,
        now: u64,
        authorizer: &impl Authorizer,
    ) -> Result<ActionResponse, LiveError> {
        self.actions.dispatch(
            &self.signer,
            &self.replay_guard,
            authorizer,
            principal,
            ActionRequest {
                snapshot: request.snapshot,
                session,
                csrf,
                action: request.action,
                revision: request.revision,
                payload: request.payload,
            },
            now,
        )
    }
}

fn valid_action_id(id: &str) -> bool {
    !id.is_empty()
        && id.len() <= 128
        && id.split("::").all(|part| {
            !part.is_empty()
                && part.bytes().all(|byte| {
                    byte.is_ascii_lowercase()
                        || byte.is_ascii_digit()
                        || byte == b'_'
                        || byte == b'-'
                })
        })
}

/// Explicit Live authorization, signing, replay, and payload failure.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LiveError {
    /// The HMAC key contains fewer than 32 bytes.
    WeakSigningKey,
    /// The snapshot structure, claims, or expiry is invalid.
    InvalidSnapshot,
    /// The HMAC signature did not match the snapshot bytes.
    InvalidSignature,
    /// The signed token exceeded its size limit.
    TokenTooLarge,
    /// The in-memory replay guard was given a zero capacity.
    InvalidReplayCapacity,
    /// The replay guard could not be accessed.
    ReplayStoreUnavailable,
    /// The bounded replay guard has no free entries.
    ReplayStoreFull,
    /// An action ID is not valid namespaced syntax.
    InvalidActionId,
    /// An action registration contains an invalid permission name.
    InvalidPermission,
    /// An action ID is already registered.
    DuplicateAction,
    /// No action is registered under the requested ID.
    UnknownAction,
    /// Request fields do not match the signed session/action snapshot.
    RequestBindingMismatch,
    /// The principal lacks the exact permission required by the action.
    Forbidden,
    /// The snapshot nonce was already consumed.
    Replay,
    /// The serialized action input exceeds its size limit.
    PayloadTooLarge,
    /// The serialized action output exceeds its size limit.
    ActionOutputTooLarge,
    /// The input JSON does not deserialize to the action's declared type.
    InvalidActionInput,
    /// The action output cannot be serialized.
    InvalidActionOutput,
    /// The typed handler returned an error.
    ActionFailed,
    /// The UI revision cannot be incremented without overflow.
    RevisionOverflow,
}
impl fmt::Display for LiveError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(match self {
            Self::WeakSigningKey => "Live signing key must contain at least 32 bytes",
            Self::InvalidSnapshot => "Live snapshot is malformed or expired",
            Self::InvalidSignature => "Live snapshot signature is invalid",
            Self::TokenTooLarge => "Live snapshot exceeds the configured size limit",
            Self::InvalidReplayCapacity => "Live replay cache capacity must be positive",
            Self::ReplayStoreUnavailable => "Live replay store is unavailable",
            Self::ReplayStoreFull => "Live replay store is full",
            Self::InvalidActionId => "Live action ID is invalid",
            Self::InvalidPermission => "Live action permission is invalid",
            Self::DuplicateAction => "Live action ID is already registered",
            Self::UnknownAction => "Live action is not registered",
            Self::RequestBindingMismatch => "Live request does not match its signed snapshot",
            Self::Forbidden => "access denied",
            Self::Replay => "Live snapshot has already been used",
            Self::PayloadTooLarge => "Live action payload exceeds the configured size limit",
            Self::ActionOutputTooLarge => "Live action output exceeds the configured size limit",
            Self::InvalidActionInput => "Live action input does not match its typed schema",
            Self::InvalidActionOutput => "Live action output could not be serialized",
            Self::ActionFailed => "Live action failed",
            Self::RevisionOverflow => "Live revision counter overflowed",
        })
    }
}
impl core::error::Error for LiveError {}

#[cfg(test)]
mod tests {
    use super::{
        ActionRegistry, ActionRequest, ClientActionRequest, InMemoryReplayGuard, LiveError,
        LiveRuntime, ReplayGuard, SnapshotClaims, SnapshotIssue, SnapshotSigner,
    };
    use crate::core::clone::Clone;
    use crate::core::convert::{From, Into};
    use crate::core::default::Default;
    use crate::core::option::Option::Some;
    use crate::core::result::Result::Err;
    use crate::core::result::Result::Ok;
    use crate::feluqa_auth::{Permission, PermissionSetAuthorizer, Principal};
    use crate::serde::{Deserialize, Serialize};
    use crate::serde_json::json;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::string::String;
    use crate::std::sync::Arc;
    use crate::std::sync::atomic::{AtomicUsize, Ordering};
    use crate::std::vec;

    #[derive(Deserialize)]
    struct Increment {
        amount: u64,
    }
    #[derive(Serialize)]
    struct Counter {
        value: u64,
    }

    fn signer() -> SnapshotSigner {
        SnapshotSigner::new(vec![7; 32]).expect("strong key")
    }
    fn claims() -> SnapshotClaims {
        SnapshotClaims::new(
            String::from("user-1"),
            Some(String::from("tenant-1")),
            String::from("session-1"),
            String::from("counter::increment"),
            Permission::new("business.counter.write").expect("permission"),
            String::from("csrf-token-value-0001"),
            String::from("nonce-value-00000001"),
            4,
            10_000,
        )
        .expect("claims")
    }

    #[test]
    fn signed_action_is_typed_authorized_and_one_time() {
        let signer = signer();
        let token = signer.sign(&claims()).expect("sign snapshot");
        let mut registry = ActionRegistry::default();
        registry
            .register::<Increment, Counter, _>(
                "counter::increment",
                Permission::new("business.counter.write").expect("permission"),
                |context, input| {
                    assert_eq!(context.tenant.as_deref(), Some("tenant-1"));
                    Ok(Counter {
                        value: input.amount + 1,
                    })
                },
            )
            .expect("register action");
        let mut principal =
            Principal::new("user-1", Some(String::from("tenant-1"))).expect("principal");
        principal.grant(Permission::new("business.counter.write").expect("permission"));
        let replay = InMemoryReplayGuard::new(10).expect("replay cache");
        let request = || ActionRequest {
            snapshot: token.clone(),
            session: String::from("session-1"),
            csrf: String::from("csrf-token-value-0001"),
            action: String::from("counter::increment"),
            revision: 4,
            payload: json!({"amount": 2}),
        };
        let result = registry
            .dispatch(
                &signer,
                &replay,
                &PermissionSetAuthorizer,
                &principal,
                request(),
                9,
            )
            .expect("dispatch");
        assert_eq!(result.value, json!({"value": 3}));
        assert_eq!(result.revision, 5);
        assert_eq!(
            registry.dispatch(
                &signer,
                &replay,
                &PermissionSetAuthorizer,
                &principal,
                request(),
                9
            ),
            Err(LiveError::Replay)
        );
    }

    #[test]
    fn live_runtime_issues_authorized_client_requests_and_dispatches_once() {
        let mut actions = ActionRegistry::default();
        actions
            .register::<Increment, Counter, _>(
                "counter::increment",
                Permission::new("business.counter.write").expect("permission"),
                |_, input| {
                    Ok(Counter {
                        value: input.amount + 1,
                    })
                },
            )
            .expect("register action");
        let runtime = LiveRuntime::new(vec![9; 32], 10, actions).expect("Live runtime");
        let mut principal =
            Principal::new("user-1", Some(String::from("tenant-1"))).expect("principal");
        principal.grant(Permission::new("business.counter.write").expect("permission"));
        let token = runtime
            .issue_snapshot(
                &principal,
                SnapshotIssue {
                    session: String::from("session-1"),
                    csrf: String::from("csrf-token-value-0001"),
                    action: String::from("counter::increment"),
                    nonce: String::from("new-random-nonce-000001"),
                    revision: 4,
                    now: 9,
                    lifetime_seconds: 60,
                },
                &PermissionSetAuthorizer,
            )
            .expect("authorized snapshot");
        let request = || ClientActionRequest {
            snapshot: token.clone(),
            action: String::from("counter::increment"),
            revision: 4,
            payload: json!({"amount": 2}),
        };
        let response = runtime
            .dispatch(
                &principal,
                String::from("session-1"),
                String::from("csrf-token-value-0001"),
                request(),
                10,
                &PermissionSetAuthorizer,
            )
            .expect("dispatch authorized action");
        assert_eq!(response.value, json!({"value": 3}));
        assert_eq!(response.revision, 5);
        assert_eq!(
            runtime.dispatch(
                &principal,
                String::from("session-1"),
                String::from("csrf-token-value-0001"),
                request(),
                10,
                &PermissionSetAuthorizer,
            ),
            Err(LiveError::Replay)
        );
    }

    #[test]
    fn snapshot_signatures_detect_tampering_and_expiration() {
        let signer = signer();
        let claims = claims();
        let token = signer.sign(&claims).expect("sign snapshot");
        assert_eq!(signer.verify(&token, 9).expect("verify snapshot"), claims);
        let mut bytes = token.into_bytes();
        let last = bytes.len() - 1;
        bytes[last] = if bytes[last] == b'0' { b'1' } else { b'0' };
        let tampered = String::from_utf8(bytes).expect("ASCII token");
        assert_eq!(
            signer.verify(&tampered, 9),
            Err(LiveError::InvalidSignature)
        );
        assert_eq!(
            signer.verify(&signer.sign(&claims).expect("token"), 10_000),
            Err(LiveError::InvalidSnapshot)
        );
    }

    #[test]
    fn live_dispatch_rejects_tampering_csrf_wrong_tenant_and_missing_permission() {
        let signer = signer();
        let token = signer.sign(&claims()).expect("sign snapshot");
        let mut registry = ActionRegistry::default();
        registry
            .register::<Increment, Counter, _>(
                "counter::increment",
                Permission::new("business.counter.write").expect("permission"),
                |_, input| {
                    Ok(Counter {
                        value: input.amount,
                    })
                },
            )
            .expect("register");
        let replay = InMemoryReplayGuard::new(10).expect("replay cache");
        let request = ActionRequest {
            snapshot: token.clone(),
            session: String::from("session-1"),
            csrf: String::from("wrong-csrf-token"),
            action: String::from("counter::increment"),
            revision: 4,
            payload: json!({"amount": 1}),
        };
        let principal =
            Principal::new("user-1", Some(String::from("tenant-1"))).expect("principal");
        assert_eq!(
            registry.dispatch(
                &signer,
                &replay,
                &PermissionSetAuthorizer,
                &principal,
                request,
                9
            ),
            Err(LiveError::RequestBindingMismatch)
        );
        let unauthorized =
            Principal::new("user-1", Some(String::from("tenant-1"))).expect("principal");
        let unauthorized_request = ActionRequest {
            snapshot: token.clone(),
            session: String::from("session-1"),
            csrf: String::from("csrf-token-value-0001"),
            action: String::from("counter::increment"),
            revision: 4,
            payload: json!({"amount": 1}),
        };
        assert_eq!(
            registry.dispatch(
                &signer,
                &replay,
                &PermissionSetAuthorizer,
                &unauthorized,
                unauthorized_request,
                9
            ),
            Err(LiveError::Forbidden)
        );
        let mut bad_tenant =
            Principal::new("user-1", Some(String::from("tenant-2"))).expect("principal");
        bad_tenant.grant(Permission::new("business.counter.write").expect("permission"));
        let request = ActionRequest {
            snapshot: token,
            session: String::from("session-1"),
            csrf: String::from("csrf-token-value-0001"),
            action: String::from("counter::increment"),
            revision: 4,
            payload: json!({"amount": 1}),
        };
        assert_eq!(
            registry.dispatch(
                &signer,
                &replay,
                &PermissionSetAuthorizer,
                &bad_tenant,
                request,
                9
            ),
            Err(LiveError::RequestBindingMismatch)
        );
        assert!(
            replay
                .consume("nonce-value-00000001", 100, 1)
                .expect("store nonce")
        );
    }

    #[test]
    fn revision_overflow_is_rejected_before_replay_claim_or_handler_side_effects() {
        let signer = signer();
        let mut overflow_claims = claims();
        overflow_claims.revision = u64::MAX;
        let token = signer.sign(&overflow_claims).expect("sign snapshot");
        let calls = Arc::new(AtomicUsize::new(0));
        let handler_calls = Arc::clone(&calls);
        let mut registry = ActionRegistry::default();
        registry
            .register::<Increment, Counter, _>(
                "counter::increment",
                Permission::new("business.counter.write").expect("permission"),
                move |_, input| {
                    handler_calls.fetch_add(1, Ordering::SeqCst);
                    Ok(Counter {
                        value: input.amount,
                    })
                },
            )
            .expect("register action");
        let mut principal =
            Principal::new("user-1", Some(String::from("tenant-1"))).expect("principal");
        principal.grant(Permission::new("business.counter.write").expect("permission"));
        let replay = InMemoryReplayGuard::new(10).expect("replay cache");
        assert_eq!(
            registry.dispatch(
                &signer,
                &replay,
                &PermissionSetAuthorizer,
                &principal,
                ActionRequest {
                    snapshot: token,
                    session: String::from("session-1"),
                    csrf: String::from("csrf-token-value-0001"),
                    action: String::from("counter::increment"),
                    revision: u64::MAX,
                    payload: json!({"amount": 1}),
                },
                9,
            ),
            Err(LiveError::RevisionOverflow)
        );
        assert_eq!(calls.load(Ordering::SeqCst), 0);
        assert!(
            replay
                .consume("nonce-value-00000001", 10_000, 9)
                .expect("overflow must not consume replay nonce")
        );
    }
}
