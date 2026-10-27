#![no_implicit_prelude]

use crate::feluqa;
extern crate std;

use std::boxed::Box;
use std::clone::Clone;
use std::convert::{From, Into};
use std::env;
use std::error::Error;
use std::format;
use std::fs;
use std::option::Option::Some;
use std::path::Path;
use std::path::PathBuf;
use std::result::Result::{self, Err, Ok};
use std::string::String;
use std::vec::Vec;

use crate::serde::Deserialize;
use crate::toml;

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AppConfig {
    pub app: AppSettings,
    pub runtime: RuntimeSettings,
    pub security: SecuritySettings,
    pub modules: ModuleSettings,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ModuleSettings {
    pub enabled: Vec<String>,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct RuntimeSettings {
    pub environment: String,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SecuritySettings {
    pub secure_cookies: bool,
    pub live_enabled: bool,
    pub live_signing_key_env: String,
}

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AppSettings {
    pub name: String,
    pub profile: String,
    pub host: String,
    pub port: u16,
}

impl AppConfig {
    pub fn load_default() -> Result<Self, Box<dyn Error>> {
        let working_directory_config = Path::new("feluqa.toml");
        let project_config = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("feluqa.toml");
        let config_path = if working_directory_config.is_file() {
            working_directory_config.to_path_buf()
        } else if cfg!(debug_assertions) && project_config.is_file() {
            project_config
        } else {
            working_directory_config.to_path_buf()
        };
        Self::load(&config_path)
    }

    fn load(path: &Path) -> Result<Self, Box<dyn Error>> {
        let source = fs::read_to_string(path)?;
        let mut document = toml::from_str::<toml::Value>(&source)?;
        let initial = toml::from_str::<Self>(&source)?;
        let environment = env::var("FELUQA_ENV").unwrap_or(initial.runtime.environment);
        if !["development", "staging", "production"].contains(&environment.as_str()) {
            return Err("runtime.environment must be development, staging or production".into());
        }
        if let Some(root) = path.parent() {
            let overlay = root.join("config").join(format!("app.{environment}.toml"));
            if overlay.is_file() {
                let overlay_source = fs::read_to_string(overlay)?;
                merge_toml(&mut document, toml::from_str(&overlay_source)?);
            }
        }
        let mut config = document.try_into::<Self>()?;
        config.runtime.environment = environment;
        if let Ok(environment) = env::var("FELUQA_ENV") {
            config.runtime.environment = environment;
        }
        if let Ok(secure_cookies) = env::var("FELUQA_SECURE_COOKIES") {
            config.security.secure_cookies = match secure_cookies.as_str() {
                "true" => true,
                "false" => false,
                _ => return Err("FELUQA_SECURE_COOKIES must be `true` or `false`".into()),
            };
        }
        if !["development", "staging", "production"].contains(&config.runtime.environment.as_str())
        {
            return Err("runtime.environment must be development, staging or production".into());
        }
        validate_security(
            &config.runtime.environment,
            config.security.secure_cookies,
            config.security.live_enabled,
        )
        .map_err(|error| -> Box<dyn Error> { error.into() })?;
        Ok(config)
    }

    /// Resolve a stable production key or create an ephemeral development key.
    pub fn live_signing_key(&self) -> Result<Vec<u8>, Box<dyn Error>> {
        match env::var(&self.security.live_signing_key_env) {
            Ok(key) if key.len() >= 32 => Ok(key.into_bytes()),
            Ok(_) => Err("Live signing key must contain at least 32 bytes".into()),
            Err(env::VarError::NotPresent) if self.runtime.environment == "development" => {
                let token = feluqa::core::store::SecretToken::generate()?;
                Ok(Vec::from(token.expose().as_bytes()))
            }
            Err(env::VarError::NotPresent) => {
                Err("Live signing key is required outside development".into())
            }
            Err(error) => Err(error.into()),
        }
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

fn merge_toml(base: &mut toml::Value, overlay: toml::Value) {
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

#[cfg(test)]
mod tests {
    use super::{AppConfig, validate_security};
    use crate::std::assert_eq;
    use crate::std::convert::From;
    use crate::std::fs;
    use crate::std::path::PathBuf;
    use crate::std::result::Result::Err;
    use crate::std::result::Result::Ok;

    #[test]
    fn replay_guard_policy_disables_live_outside_development() {
        assert_eq!(validate_security("development", false, true), Ok(()));
        assert_eq!(
            validate_security("staging", true, true),
            Err("Live requires a shared replay store outside development")
        );
        assert_eq!(validate_security("staging", true, false), Ok(()));
        assert_eq!(
            validate_security("production", false, false),
            Err("secure_cookies must be enabled in production")
        );
        assert_eq!(validate_security("production", true, false), Ok(()));
    }

    #[test]
    fn application_config_declares_compiled_modules_explicitly() {
        let path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("feluqa.toml");
        let source = fs::read_to_string(path).expect("application config");
        let config = crate::toml::from_str::<AppConfig>(&source).expect("typed app config");
        assert_eq!(config.modules.enabled.as_slice(), ["numerimondes.crm"]);
    }
}
