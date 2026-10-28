#![no_implicit_prelude]
#![deny(unsafe_code)]

extern crate std;

use crate::alloc::string::String;
use crate::alloc::vec::Vec;
use crate::serde::Deserialize;
use crate::std::boxed::Box;
use crate::std::clone::Clone;
use crate::std::convert::{From, Into, TryInto};
use crate::std::env;
use crate::std::error::Error;
use crate::std::format;
use crate::std::fs;
use crate::std::option::Option;
use crate::std::option::Option::Some;
use crate::std::path::{Path, PathBuf};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};

/// Fully validated runtime settings for one Feluqa web application.
#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ApplicationSettings {
    /// Public application identity and bind address.
    pub app: AppSettings,
    /// Selected deployment environment.
    pub runtime: RuntimeSettings,
    /// Cookie, Live and signing configuration.
    pub security: SecuritySettings,
    /// Enabled compiled module identifiers.
    pub modules: ModulesSettings,
}

/// Application identity and HTTP bind settings.
#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AppSettings {
    /// Display name shown in the panel shell.
    pub name: String,
    /// Runtime profile selected by the product.
    pub profile: String,
    /// Interface address for the HTTP listener.
    pub host: String,
    /// TCP port for the HTTP listener.
    pub port: u16,
}

/// Deployment environment selected for this application.
#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct RuntimeSettings {
    /// Environment name: development, staging or production.
    pub environment: String,
}

/// Runtime security settings for sessions and Live actions.
#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SecuritySettings {
    /// Require the Secure cookie attribute on session cookies.
    pub secure_cookies: bool,
    /// Enable signed Live actions for this application.
    pub live_enabled: bool,
    /// Environment variable holding the Live signing key.
    pub live_signing_key_env: String,
}

/// Static module activation settings derived from the application declaration.
#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ModulesSettings {
    /// Enabled module identifiers.
    pub enabled: Vec<String>,
}

impl ApplicationSettings {
    /// Load settings from an application's project directory and environment overlay.
    pub fn load_from(project_directory: &Path) -> Result<Self, Box<dyn Error>> {
        let working_config = Path::new("feluqa.toml");
        let project_config = project_directory.join("feluqa.toml");
        let config_path = if working_config.is_file() {
            working_config.to_path_buf()
        } else {
            project_config
        };
        Self::load(&config_path)
    }

    fn load(path: &Path) -> Result<Self, Box<dyn Error>> {
        let source = fs::read_to_string(path)?;
        let mut document = crate::toml::from_str::<crate::toml::Value>(&source)?;
        let initial = crate::toml::from_str::<Self>(&source)?;
        let environment = env::var("FELUQA_ENV").unwrap_or(initial.runtime.environment);
        validate_environment(&environment)?;
        if let Some(root) = path.parent() {
            let overlay = root.join("config").join(format!("app.{environment}.toml"));
            if overlay.is_file() {
                let overlay_source = fs::read_to_string(overlay)?;
                merge_toml(&mut document, crate::toml::from_str(&overlay_source)?);
            }
        }
        let mut settings = document.try_into::<Self>()?;
        settings.runtime.environment = environment;
        if let Ok(environment) = env::var("FELUQA_ENV") {
            settings.runtime.environment = environment;
        }
        if let Ok(secure_cookies) = env::var("FELUQA_SECURE_COOKIES") {
            settings.security.secure_cookies = match secure_cookies.as_str() {
                "true" => true,
                "false" => false,
                _ => return Err("FELUQA_SECURE_COOKIES must be `true` or `false`".into()),
            };
        }
        validate_environment(&settings.runtime.environment)?;
        validate_security(
            &settings.runtime.environment,
            settings.security.secure_cookies,
            settings.security.live_enabled,
        )
        .map_err(|error| -> Box<dyn Error> { error.into() })?;
        Ok(settings)
    }

    /// Resolve a stable production key or create an ephemeral development key.
    pub fn live_signing_key(&self) -> Result<Vec<u8>, Box<dyn Error>> {
        match env::var(&self.security.live_signing_key_env) {
            Ok(key) if key.len() >= 32 => Ok(key.into_bytes()),
            Ok(_) => Err("Live signing key must contain at least 32 bytes".into()),
            Err(env::VarError::NotPresent) if self.runtime.environment == "development" => {
                let token = crate::core::store::SecretToken::generate()?;
                Ok(Vec::from(token.expose().as_bytes()))
            }
            Err(env::VarError::NotPresent) => {
                Err("Live signing key is required outside development".into())
            }
            Err(error) => Err(error.into()),
        }
    }
}

fn validate_environment(environment: &str) -> Result<(), &'static str> {
    if ["development", "staging", "production"].contains(&environment) {
        Ok(())
    } else {
        Err("runtime.environment must be development, staging or production")
    }
}

fn validate_security(
    environment: &str,
    secure_cookies: bool,
    live_enabled: bool,
) -> Result<(), &'static str> {
    if environment == "production" && !secure_cookies {
        return Err("secure_cookies must be enabled in production");
    }
    if environment != "development" && live_enabled {
        return Err("Live requires a shared replay store outside development");
    }
    Ok(())
}

fn merge_toml(base: &mut crate::toml::Value, overlay: crate::toml::Value) {
    if let (Some(base), Some(overlay)) = (base.as_table_mut(), overlay.as_table()) {
        for (key, value) in overlay {
            if let Some(existing) = base.get_mut(key) {
                merge_toml(existing, value.clone());
            } else {
                base.insert(key.clone(), value.clone());
            }
        }
    } else {
        *base = overlay;
    }
}
