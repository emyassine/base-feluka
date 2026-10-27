#![no_implicit_prelude]

use crate::feluqa;

use feluqa::prelude::*;
use feluqa::core::store::SecretToken;
use crate::std::boxed::Box;
use crate::std::convert::Into;
use crate::std::error::Error;
use crate::std::format;
use crate::std::fs;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::vec::Vec;

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct AppConfig {
    pub(crate) name: String,
    pub(crate) host: String,
    pub(crate) port: u16,
    pub(crate) security: SecurityConfig,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SecurityConfig {
    pub(crate) secure_cookies: bool,
    pub(crate) live_enabled: bool,
    pub(crate) live_signing_key_env: String,
}

impl AppConfig {
    pub(crate) fn load(environment: &str) -> Result<Self, Box<dyn Error>> {
        if !["development", "staging", "production"].contains(&environment) {
            return Err("FELUQA_ENV must be development, staging or production".into());
        }
        let path = format!("config/app.{environment}.toml");
        let source = fs::read_to_string(path)?;
        Ok(crate::toml::from_str(&source)?)
    }

}

impl SecurityConfig {
    pub(crate) fn live_signing_key(&self, environment: &str) -> Result<Vec<u8>, Box<dyn Error>> {
        if !self.live_enabled || environment != "development" {
            return Err("Live signing keys are available only for enabled development mode".into());
        }
        let secret = match crate::std::env::var(&self.live_signing_key_env) {
            Ok(secret) => secret,
            Err(crate::std::env::VarError::NotPresent) => {
                SecretToken::generate()?.expose().to_string()
            }
            Err(crate::std::env::VarError::NotUnicode(_)) => {
                return Err("Live signing key environment variable must be UTF-8".into());
            }
        };
        if secret.len() < 32 {
            return Err("Live signing key must contain at least 32 bytes".into());
        }
        Ok(Vec::from(secret.as_bytes()))
    }
}
