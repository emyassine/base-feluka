use std::{net::AddrParseError, num::ParseIntError, str::ParseBoolError};
use thiserror::Error;

#[derive(Debug, Error, Clone)]
pub enum Feluqa UIConfigError {
    #[error("Cargo.toml not found in package root")]
    ConfigNotFound,
    #[error("package.metadata.feluqa_ui_runtime section missing from Cargo.toml")]
    ConfigSectionNotFound,
    #[error("Failed to get Feluqa UI Environment. Did you set FELUQA_UI_ENV?")]
    EnvError,
    #[error("Config Error: {0}")]
    ConfigError(String),
    #[error("Config Error: {0}")]
    EnvVarError(String),
}
impl From<config::ConfigError> for Feluqa UIConfigError {
    fn from(e: config::ConfigError) -> Self {
        Self::ConfigError(e.to_string())
    }
}

impl From<ParseIntError> for Feluqa UIConfigError {
    fn from(e: ParseIntError) -> Self {
        Self::ConfigError(e.to_string())
    }
}

impl From<AddrParseError> for Feluqa UIConfigError {
    fn from(e: AddrParseError) -> Self {
        Self::ConfigError(e.to_string())
    }
}

impl From<ParseBoolError> for Feluqa UIConfigError {
    fn from(e: ParseBoolError) -> Self {
        Self::ConfigError(e.to_string())
    }
}
