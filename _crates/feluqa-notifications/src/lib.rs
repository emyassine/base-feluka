#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Typed Filament-style toast data and bounded session-mailbox semantics.
//!
//! The notification payload is data only. Application code registers server-side actions;
//! a browser-supplied action ID is never executed without normal authorization checks.

extern crate alloc;
extern crate core;
extern crate feluqa_auth;
extern crate serde;
extern crate serde_json;
#[cfg(test)]
extern crate std;

use alloc::collections::BTreeSet;
use alloc::format;
use alloc::string::{String, ToString};
use alloc::vec::Vec;
use core::clone::Clone;
use core::convert::From;
use core::convert::Into;
use core::default::Default;
use core::fmt;
use core::fmt::Write as FmtWrite;
use core::iter::{Extend, Iterator};
use core::matches;
use core::option::Option;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::write;
use feluqa_auth::Permission;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

/// Maximum number of unpublished or published notifications held in one mailbox.
pub const MAX_NOTIFICATIONS: usize = 50;
/// Default toast lifetime in milliseconds, matching the Webkernel Filament integration.
pub const DEFAULT_DURATION_MS: u32 = 6_000;

/// Standard Filament notification status.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum NotificationStatus {
    /// Error or destructive operation.
    Danger,
    /// Informational event.
    Info,
    /// Successful operation.
    Success,
    /// Attention required.
    Warning,
}

/// Icon sizes accepted by Filament notification components.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub enum NotificationIconSize {
    /// 12px icon.
    #[serde(rename = "xs")]
    ExtraSmall,
    /// 14px icon.
    #[serde(rename = "sm")]
    Small,
    /// 16px icon.
    #[serde(rename = "md")]
    Medium,
    /// 20px icon; default notification size.
    #[default]
    #[serde(rename = "lg")]
    Large,
    /// 24px icon.
    #[serde(rename = "xl")]
    ExtraLarge,
    /// 32px icon.
    #[serde(rename = "2xl")]
    TwoExtraLarge,
}

/// Time after which a toast closes, or persistent display until dismissed.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum NotificationDuration {
    /// Hide automatically after this many milliseconds.
    Milliseconds(u32),
    /// Keep visible until the user dismisses it.
    Persistent(String),
}

impl Default for NotificationDuration {
    fn default() -> Self {
        Self::Milliseconds(DEFAULT_DURATION_MS)
    }
}

/// An allowlisted action shown inside a notification.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct NotificationAction {
    /// Stable server-registered action ID.
    pub id: String,
    /// Visible button label.
    pub label: String,
    /// Exact Feluqa permission required to invoke the action.
    pub permission: String,
    /// Optional local navigation URL; remote URLs and script URLs are rejected.
    pub url: Option<String>,
}

/// Data representation of one Filament-style notification.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Notification {
    /// Stable caller-supplied identifier; IDs are not generated from untrusted input.
    pub id: String,
    /// Optional heading.
    pub title: Option<String>,
    /// Optional body text.
    pub body: Option<String>,
    /// Status color and icon family.
    pub status: Option<NotificationStatus>,
    /// Optional icon name from the registered imagery catalogue.
    pub icon: Option<String>,
    /// Optional icon color token from Feluqa's fixed color palette.
    pub icon_color: Option<String>,
    /// Optional fixed-palette background/ring color.
    pub color: Option<String>,
    /// Icon size token.
    pub icon_size: NotificationIconSize,
    /// Display lifetime.
    pub duration: NotificationDuration,
    /// Optional ISO-8601 date label used by inline/database presentation.
    #[serde(skip)]
    pub date: Option<String>,
    /// Render inline instead of in the toast stack.
    #[serde(skip)]
    pub inline: bool,
    /// Authorized server actions displayed in this notification.
    pub actions: Vec<NotificationAction>,
    /// Optional registered compiled view name; unregistered views are never rendered.
    pub view: Option<String>,
    /// JSON-only data passed to a registered view; never interpreted as Rust or HTML.
    pub view_data: Map<String, Value>,
}

impl NotificationStatus {
    fn as_str(self) -> &'static str {
        match self {
            Self::Danger => "danger",
            Self::Info => "info",
            Self::Success => "success",
            Self::Warning => "warning",
        }
    }
}

impl NotificationIconSize {
    fn as_str(self) -> &'static str {
        match self {
            Self::ExtraSmall => "xs",
            Self::Small => "sm",
            Self::Medium => "md",
            Self::Large => "lg",
            Self::ExtraLarge => "xl",
            Self::TwoExtraLarge => "2xl",
        }
    }
}

/// Already-escaped notification markup produced by Feluqa's fixed renderer.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RenderedNotification {
    html: String,
}

impl RenderedNotification {
    /// Borrow the safe markup for embedding in a compiled Feluqa view.
    pub fn as_str(&self) -> &str {
        &self.html
    }
}

fn escape_html(value: &str) -> String {
    let mut escaped = String::new();
    for character in value.chars() {
        match character {
            '&' => escaped.push_str("&amp;"),
            '<' => escaped.push_str("&lt;"),
            '>' => escaped.push_str("&gt;"),
            '"' => escaped.push_str("&quot;"),
            '\'' => escaped.push_str("&#39;"),
            _ => escaped.push(character),
        }
    }
    escaped
}

impl Notification {
    /// Start a notification with a stable application-defined ID.
    pub fn make(id: impl Into<String>) -> Self {
        Self {
            id: id.into(),
            title: None,
            body: None,
            status: None,
            icon: None,
            icon_color: None,
            color: None,
            icon_size: NotificationIconSize::default(),
            duration: NotificationDuration::default(),
            date: None,
            inline: false,
            actions: Vec::new(),
            view: None,
            view_data: Map::new(),
        }
    }

    /// Set the heading.
    pub fn title(mut self, title: impl Into<String>) -> Self {
        self.title = Some(title.into());
        self
    }

    /// Set the body text.
    pub fn body(mut self, body: impl Into<String>) -> Self {
        self.body = Some(body.into());
        self
    }

    /// Set the status directly.
    pub fn status(mut self, status: NotificationStatus) -> Self {
        self.status = Some(status);
        self
    }

    /// Mark the notification as an error.
    pub fn danger(self) -> Self {
        self.status(NotificationStatus::Danger)
    }

    /// Mark the notification as informational.
    pub fn info(self) -> Self {
        self.status(NotificationStatus::Info)
    }

    /// Mark the notification as successful.
    pub fn success(self) -> Self {
        self.status(NotificationStatus::Success)
    }

    /// Mark the notification as requiring attention.
    pub fn warning(self) -> Self {
        self.status(NotificationStatus::Warning)
    }

    /// Set an icon from the registered Feluqa imagery catalogue.
    pub fn icon(mut self, icon: impl Into<String>) -> Self {
        self.icon = Some(icon.into());
        self
    }

    /// Set a fixed Feluqa icon color token.
    pub fn icon_color(mut self, color: impl Into<String>) -> Self {
        self.icon_color = Some(color.into());
        self
    }

    /// Set one of Feluqa's fixed notification color tokens.
    pub fn color(mut self, color: impl Into<String>) -> Self {
        self.color = Some(color.into());
        self
    }

    /// Set the icon size token.
    pub fn icon_size(mut self, size: NotificationIconSize) -> Self {
        self.icon_size = size;
        self
    }

    /// Select a registered compiled view and pass JSON-only data to it.
    pub fn compiled_view(mut self, name: impl Into<String>, data: Map<String, Value>) -> Self {
        self.view = Some(name.into());
        self.view_data = data;
        self
    }

    /// Set the lifetime in milliseconds.
    pub fn duration(mut self, milliseconds: u32) -> Self {
        self.duration = NotificationDuration::Milliseconds(milliseconds);
        self
    }

    /// Set the lifetime in seconds, rounded down to a millisecond count.
    pub fn seconds(self, seconds: f32) -> Self {
        let milliseconds = if seconds <= 0.0 {
            0
        } else {
            (seconds * 1_000.0) as u32
        };
        self.duration(milliseconds)
    }

    /// Keep the notification visible until explicitly dismissed.
    pub fn persistent(mut self) -> Self {
        self.duration = NotificationDuration::Persistent(String::from("persistent"));
        self
    }

    /// Display this notification inline.
    pub fn inline(mut self, inline: bool) -> Self {
        self.inline = inline;
        self
    }

    /// Attach a date label supplied by the application.
    pub fn date(mut self, date: impl Into<String>) -> Self {
        self.date = Some(date.into());
        self
    }

    /// Append one server-registered, permission-checked action.
    pub fn action(mut self, action: NotificationAction) -> Self {
        self.actions.push(action);
        self
    }

    /// Validate bounds, identifiers, action grants, and allowed URL forms.
    pub fn validate(&self) -> Result<(), NotificationError> {
        if !valid_identifier(&self.id) {
            return Err(NotificationError::InvalidId);
        }
        if self
            .title
            .as_ref()
            .is_some_and(|value| value.len() > 16_384)
            || self.body.as_ref().is_some_and(|value| value.len() > 16_384)
            || self.date.as_ref().is_some_and(|value| value.len() > 128)
            || self
                .icon
                .as_ref()
                .is_some_and(|value| !valid_identifier(value))
            || self
                .icon_color
                .as_ref()
                .is_some_and(|value| !valid_color(value))
            || self.color.as_ref().is_some_and(|value| !valid_color(value))
            || self
                .view
                .as_ref()
                .is_some_and(|value| !valid_identifier(value))
            || self.actions.len() > 32
            || serde_json::to_string(&self.view_data).map_or(true, |json| json.len() > 65_536)
        {
            return Err(NotificationError::InvalidContent);
        }
        if let NotificationDuration::Persistent(value) = &self.duration {
            if value != "persistent" {
                return Err(NotificationError::InvalidDuration);
            }
        }
        let mut action_ids = BTreeSet::new();
        for action in &self.actions {
            if !valid_identifier(&action.id)
                || action.label.trim().is_empty()
                || action.label.len() > 512
                || !action_ids.insert(action.id.as_str())
                || Permission::new(action.permission.clone()).is_err()
                || action.url.as_ref().is_some_and(|url| !valid_local_url(url))
            {
                return Err(NotificationError::InvalidAction);
            }
        }
        Ok(())
    }

    /// Serialize using Filament's camelCase notification payload shape.
    pub fn to_json(&self) -> Result<String, NotificationError> {
        self.validate()?;
        serde_json::to_string(self).map_err(|_| NotificationError::Serialization)
    }

    /// Parse a camelCase payload and reject unknown or invalid data.
    pub fn from_json(value: &str) -> Result<Self, NotificationError> {
        let notification: Self =
            serde_json::from_str(value).map_err(|_| NotificationError::MalformedJson)?;
        notification.validate()?;
        Ok(notification)
    }

    /// Render one escaped notification using Filament's stable DOM classes.
    pub fn render(&self) -> Result<RenderedNotification, NotificationError> {
        self.validate()?;
        let status = self
            .color
            .as_deref()
            .or_else(|| self.status.map(NotificationStatus::as_str))
            .unwrap_or("gray");
        let duration = match &self.duration {
            NotificationDuration::Milliseconds(value) => value.to_string(),
            NotificationDuration::Persistent(_) => String::from("persistent"),
        };
        let mut html = format!(
            "<article class=\"fi-no-notification fi-color fi-color-{status}{} fi-transition-enter-start\" role=\"status\" data-feluqa-notification data-notification-id=\"{}\" data-duration=\"{}\">",
            if self.inline { " fi-inline" } else { "" },
            escape_html(&self.id),
            escape_html(&duration),
        );
        if let Some(icon) = &self.icon {
            write!(html, "<span class=\"fi-no-notification-icon fi-size-{}{}\" data-icon=\"{}\" aria-hidden=\"true\"></span>", self.icon_size.as_str(), self.icon_color.as_ref().map(|color| format!(" fi-color-{color}")).unwrap_or_default(), escape_html(icon))
                .map_err(|_| NotificationError::Serialization)?;
        }
        html.push_str(
            "<div class=\"fi-no-notification-main\"><div class=\"fi-no-notification-text\">",
        );
        if let Some(title) = &self.title {
            write!(
                html,
                "<h2 class=\"fi-no-notification-title\">{}</h2>",
                escape_html(title)
            )
            .map_err(|_| NotificationError::Serialization)?;
        }
        if let Some(body) = &self.body {
            write!(
                html,
                "<div class=\"fi-no-notification-body\">{}</div>",
                escape_html(body)
            )
            .map_err(|_| NotificationError::Serialization)?;
        }
        if let Some(date) = &self.date {
            write!(
                html,
                "<time class=\"fi-no-notification-date\">{}</time>",
                escape_html(date)
            )
            .map_err(|_| NotificationError::Serialization)?;
        }
        html.push_str("</div>");
        if !self.actions.is_empty() {
            html.push_str("<div class=\"fi-no-notification-actions fi-ac\">");
            for action in &self.actions {
                match &action.url {
                    Some(url) => write!(html, "<a class=\"fi-ac-action\" href=\"{}\">{}</a>", escape_html(url), escape_html(&action.label)),
                    None => write!(html, "<button class=\"fi-ac-action\" type=\"button\" data-feluqa-notification-action=\"{}\" data-permission=\"{}\">{}</button>", escape_html(&action.id), escape_html(&action.permission), escape_html(&action.label)),
                }
                .map_err(|_| NotificationError::Serialization)?;
            }
            html.push_str("</div>");
        }
        html.push_str("<button class=\"fi-no-notification-close-btn\" type=\"button\" data-dismiss-notification aria-label=\"Dismiss notification\">×</button>");
        html.push_str("</div></article>");
        Ok(RenderedNotification { html })
    }

    /// Publish this notification into the bounded request/session mailbox.
    pub fn send(self, mailbox: &mut NotificationMailbox) -> Result<(), NotificationError> {
        mailbox.push(self)
    }
}

/// A bounded notification inbox with request-batch delivery semantics.
///
/// Persistence and session ownership are provided by the host application. The mailbox owns
/// only validation, FIFO eviction, publication, and selective pull behavior.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct NotificationMailbox {
    pending: Vec<Notification>,
    published: Vec<MailboxEntry>,
}

#[derive(Clone, Debug, PartialEq, Eq)]
struct MailboxEntry {
    notification: Notification,
    batch: Option<String>,
}

impl NotificationMailbox {
    /// Add an unpublished notification, dropping the oldest item above the 50-item limit.
    pub fn push(&mut self, notification: Notification) -> Result<(), NotificationError> {
        notification.validate()?;
        self.pending.push(notification);
        trim_oldest(&mut self.pending);
        Ok(())
    }

    /// Whether the current response has notifications waiting to publish.
    pub fn has_pending(&self) -> bool {
        !self.pending.is_empty()
    }

    /// Whether any previously published notification is waiting to be pulled.
    pub fn has_published(&self) -> bool {
        !self.published.is_empty()
    }

    /// Publish pending notifications under an optional response batch ID.
    pub fn flush(&mut self, batch: Option<&str>) -> Result<(), NotificationError> {
        if batch.is_some_and(|id| !valid_identifier(id)) {
            return Err(NotificationError::InvalidBatch);
        }
        let batch = batch.map(ToString::to_string);
        self.published
            .extend(self.pending.drain(..).map(|notification| MailboxEntry {
                notification,
                batch: batch.clone(),
            }));
        trim_oldest(&mut self.published);
        Ok(())
    }

    /// Pull all unowned notifications and those belonging to one of `batches`.
    ///
    /// `None` drains all notifications. Notifications owned by another response remain queued.
    pub fn pull(&mut self, batches: Option<&[&str]>) -> Vec<Notification> {
        let mut pulled = Vec::new();
        let mut remaining = Vec::new();
        for entry in self.published.drain(..) {
            let owned = match (batches, entry.batch.as_deref()) {
                (None, _) | (Some(_), None) => true,
                (Some(batches), Some(batch)) => batches.contains(&batch),
            };
            if owned {
                pulled.push(entry.notification);
            } else {
                remaining.push(entry);
            }
        }
        self.published = remaining;
        pulled
    }

    /// Number of pending and published items.
    pub fn len(&self) -> usize {
        self.pending.len() + self.published.len()
    }

    /// Whether the mailbox has no pending or published items.
    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

fn trim_oldest<T>(items: &mut Vec<T>) {
    if items.len() > MAX_NOTIFICATIONS {
        let excess = items.len() - MAX_NOTIFICATIONS;
        items.drain(..excess);
    }
}

fn valid_identifier(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 128
        && value
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || b"-_.:".contains(&byte))
}

fn valid_color(value: &str) -> bool {
    matches!(
        value,
        "primary" | "gray" | "success" | "warning" | "danger" | "info"
    )
}

fn valid_local_url(value: &str) -> bool {
    value.starts_with('/')
        && !value.starts_with("//")
        && !value
            .chars()
            .any(|character| matches!(character, '\\' | '\n' | '\r'))
        && !value
            .split('/')
            .any(|segment| segment == "." || segment == "..")
}

/// Validation or serialization failure for a notification.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum NotificationError {
    /// Notification ID is missing or malformed.
    InvalidId,
    /// Content, icon, color, or field sizes are invalid.
    InvalidContent,
    /// A duration token or value is invalid.
    InvalidDuration,
    /// An action is malformed, duplicated, or lacks a valid permission.
    InvalidAction,
    /// Response batch identifier is malformed.
    InvalidBatch,
    /// JSON input is malformed or contains unknown fields.
    MalformedJson,
    /// JSON output could not be serialized.
    Serialization,
}

impl fmt::Display for NotificationError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(match self {
            Self::InvalidId => "notification ID is invalid",
            Self::InvalidContent => "notification content is invalid",
            Self::InvalidDuration => "notification duration is invalid",
            Self::InvalidAction => "notification action is invalid",
            Self::InvalidBatch => "notification batch ID is invalid",
            Self::MalformedJson => "notification JSON is malformed",
            Self::Serialization => "notification serialization failed",
        })
    }
}

impl core::error::Error for NotificationError {}

#[cfg(test)]
mod tests {
    use super::{
        MAX_NOTIFICATIONS, Notification, NotificationAction, NotificationDuration,
        NotificationError, NotificationMailbox, NotificationStatus,
    };
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::convert::From;
    use crate::std::default::Default;
    use crate::std::format;
    use crate::std::option::Option::{None, Some};
    use crate::std::result::Result::Err;
    use crate::std::string::String;

    #[test]
    fn notification_builder_serializes_filament_camel_case_and_rejects_injected_urls() {
        let notification = Notification::make("customer-created")
            .title("Customer created")
            .body("The customer is ready.")
            .success()
            .seconds(4.5)
            .action(NotificationAction {
                id: String::from("customers.show"),
                label: String::from("Open customer"),
                permission: String::from("business.crm.customers.read"),
                url: Some(String::from("/admin/customers/17")),
            });
        let json = notification.to_json().expect("valid JSON");
        assert!(json.contains("\"iconColor\""));
        assert!(json.contains("\"duration\":4500"));
        assert_eq!(
            Notification::from_json(&json).expect("round trip").status,
            Some(NotificationStatus::Success)
        );
        assert_eq!(
            Notification::make("dangerous")
                .action(NotificationAction {
                    id: String::from("open"),
                    label: String::from("Open"),
                    permission: String::from("business.crm.read"),
                    url: Some(String::from("javascript:alert(1)")),
                })
                .validate(),
            Err(NotificationError::InvalidAction)
        );
    }

    #[test]
    fn mailbox_caps_items_and_preserves_notifications_owned_by_another_response() {
        let mut mailbox = NotificationMailbox::default();
        for index in 0..(MAX_NOTIFICATIONS + 2) {
            Notification::make(format!("notice-{index}"))
                .send(&mut mailbox)
                .expect("valid notification");
        }
        assert_eq!(mailbox.len(), MAX_NOTIFICATIONS);
        mailbox.flush(Some("response-a")).expect("publish a");
        Notification::make("later")
            .send(&mut mailbox)
            .expect("valid notification");
        mailbox.flush(Some("response-b")).expect("publish b");
        let first = mailbox.pull(Some(&["response-a"]));
        assert_eq!(first.len(), MAX_NOTIFICATIONS - 1);
        assert_eq!(first[0].id, "notice-3");
        assert_eq!(mailbox.pull(Some(&["response-a"])).len(), 0);
        assert_eq!(mailbox.pull(None)[0].id, "later");
    }

    #[test]
    fn persistent_duration_is_the_filament_literal() {
        let notification = Notification::make("keep").persistent();
        assert_eq!(
            notification.duration,
            NotificationDuration::Persistent(String::from("persistent"))
        );
        assert!(
            notification
                .to_json()
                .expect("serialize")
                .contains("persistent")
        );
    }

    #[test]
    fn notification_html_uses_filament_classes_and_escapes_all_text_and_attributes() {
        let notification = Notification::make("saved")
            .title("<script>alert(1)</script>")
            .body("A & B")
            .success()
            .action(NotificationAction {
                id: String::from("records.open"),
                label: String::from("Open <record>"),
                permission: String::from("business.crm.records.read"),
                url: Some(String::from("/admin/records/1?source=notice")),
            });
        let html = notification.render().expect("safe HTML");
        assert!(
            html.as_str()
                .contains("fi-no-notification fi-color fi-color-success")
        );
        assert!(html.as_str().contains("&lt;script&gt;"));
        assert!(html.as_str().contains("A &amp; B"));
        assert!(html.as_str().contains("Open &lt;record&gt;"));
        assert!(!html.as_str().contains("<script>"));
    }
}
