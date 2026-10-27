#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(missing_docs)]

//! Password hashing and token primitives used by Feluqa Core adapters.

extern crate argon2;
extern crate core;
extern crate rand_core;
extern crate sha2;
extern crate std;

use argon2::Argon2;
use argon2::password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use rand_core::OsRng;
use rand_core::RngCore;
use sha2::Digest;
use std::default::Default;
use std::fmt::Write;
use std::result::Result;
use std::result::Result::{Err, Ok};
use std::string::String;
use std::string::ToString;
use std::write;

/// A raw, high-entropy browser token and its non-reversible storage digest.
#[derive(Clone, PartialEq, Eq)]
pub struct SecretToken {
    raw: String,
    digest: String,
}

impl SecretToken {
    /// Create a random 256-bit token. Store only [`Self::digest`] in the database.
    pub fn generate() -> Result<Self, TokenError> {
        let mut bytes = [0_u8; 32];
        let mut random = OsRng;
        random.try_fill_bytes(&mut bytes).map_err(|_| TokenError)?;
        let mut raw = String::with_capacity(64);
        for byte in bytes {
            write!(&mut raw, "{byte:02x}").map_err(|_| TokenError)?;
        }
        let digest = digest_token(raw.as_bytes());
        Ok(Self { raw, digest })
    }

    /// Return the raw token once, for delivery in a secure cookie.
    pub fn expose(&self) -> &str {
        &self.raw
    }

    /// Return the SHA-256 digest suitable for persistent storage.
    pub fn digest(&self) -> &str {
        &self.digest
    }
}

/// Hash a password using Argon2id with a random salt.
pub fn hash_password(password: &str) -> Result<String, PasswordError> {
    if password.len() < 12 || password.len() > 1024 {
        return Err(PasswordError);
    }
    let salt = SaltString::generate(&mut OsRng);
    Argon2::default()
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| PasswordError)
}

/// Verify a password against a PHC Argon2 hash.
pub fn verify_password(password: &str, encoded_hash: &str) -> bool {
    match PasswordHash::new(encoded_hash) {
        Ok(hash) => Argon2::default()
            .verify_password(password.as_bytes(), &hash)
            .is_ok(),
        Err(_) => false,
    }
}

/// Hash a random session or CSRF token before persistence.
pub fn digest_token(value: &[u8]) -> String {
    let digest = sha2::Sha256::digest(value);
    let mut output = String::with_capacity(64);
    for byte in digest {
        let _ = write!(&mut output, "{byte:02x}");
    }
    output
}

/// Invalid or failed token generation.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct TokenError;

/// Invalid password input or hashing failure.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PasswordError;

impl core::fmt::Display for TokenError {
    fn fmt(&self, formatter: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        formatter.write_str("secure token generation failed")
    }
}
impl core::error::Error for TokenError {}
impl core::fmt::Display for PasswordError {
    fn fmt(&self, formatter: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        formatter.write_str("password must be 12 to 1024 bytes and hash successfully")
    }
}
impl core::error::Error for PasswordError {}

#[cfg(test)]
mod tests {
    use super::std::assert;
    use super::std::assert_eq;
    use super::std::assert_ne;
    use super::{SecretToken, digest_token, hash_password, verify_password};

    #[test]
    fn password_hash_is_salted_and_verifies_without_exposing_the_password() {
        let first = hash_password("correct horse battery staple").expect("valid password");
        let second = hash_password("correct horse battery staple").expect("valid password");
        assert_ne!(first, second);
        assert!(verify_password("correct horse battery staple", &first));
        assert!(!verify_password("incorrect password", &first));
        assert!(!first.contains("correct horse battery staple"));
    }

    #[test]
    fn session_token_storage_value_is_only_a_digest() {
        let token = SecretToken::generate().expect("operating system RNG is available");
        assert_eq!(token.expose().len(), 64);
        assert_eq!(token.digest().len(), 64);
        assert_eq!(token.digest(), digest_token(token.expose().as_bytes()));
        assert_ne!(token.expose(), token.digest());
    }
}
