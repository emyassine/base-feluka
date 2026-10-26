#![no_implicit_prelude]

extern crate std;

use std::boxed::Box;
use std::convert::From;
use std::error::Error;
use std::fs;
use std::path::Path;
use std::path::PathBuf;
use std::result::Result::{self, Ok};
use std::string::String;

use crate::serde::Deserialize;
use crate::toml;

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AppConfig {
    pub app: AppSettings,
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
        let config = toml::from_str::<Self>(&source)?;
        Ok(config)
    }
}
