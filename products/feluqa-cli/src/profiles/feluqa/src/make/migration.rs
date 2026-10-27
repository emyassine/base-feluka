#![no_implicit_prelude]

use crate::feluqa;
use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::convert::From;
use crate::std::ffi::OsString;
use crate::std::format;
use crate::std::fs::{self, OpenOptions};
use crate::std::io::Write;
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::{Path, PathBuf};
use crate::std::println;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::time::{SystemTime, UNIX_EPOCH};
use crate::std::vec;
use crate::std::vec::Vec;
use serde::Deserialize;

extern crate serde;
extern crate toml;

#[feluqa::command(
    name = "make migration",
    description = "Generate dialect-specific ordered SQL migrations",
    usage = "feluqa make migration <arguments>",
    profiles = ["feluqa", "feluqa-dev"],
    context = "app",
)]
pub(crate) fn run(
    context: &mut feluqa::console::CommandContext<'_>,
) -> feluqa::console::CommandResult {
    let arguments = crate::__feluqa_profile_feluqa::context::arguments(context);
    let host = crate::__feluqa_profile_feluqa::context::host(context)?;
    let application = crate::__feluqa_profile_feluqa::context::application(host)?;
    let result = generate(&arguments, application);
    crate::__feluqa_profile_feluqa::context::finish(host, result)
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct ModuleManifest {
    id: String,
    supported_databases: Vec<String>,
    #[serde(default)]
    database_connections: Option<Vec<String>>,
    #[serde(default)]
    version: Option<String>,
    #[serde(default)]
    capabilities: Option<Vec<String>>,
}

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    if arguments.is_empty() {
        return Err(String::from(
            "usage: feluqa make migration <name> [--module <name>]",
        ));
    }
    let raw_name = arguments[0]
        .to_str()
        .ok_or_else(|| String::from("migration name must be valid UTF-8"))?;
    let migration_name = feluqa::console::generator::slugify(raw_name)?;
    let mut module = String::from("app");
    let mut index = 1;
    while index < arguments.len() {
        let flag = arguments[index]
            .to_str()
            .ok_or_else(|| String::from("generator argument must be valid UTF-8"))?;
        if flag != "--module" || index + 1 >= arguments.len() {
            return Err(String::from(
                "usage: feluqa make migration <name> [--module <name>]",
            ));
        }
        module = feluqa::console::generator::slugify(
            arguments[index + 1]
                .to_str()
                .ok_or_else(|| String::from("module name must be valid UTF-8"))?,
        )?;
        index += 2;
    }
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|_| String::from("system clock is earlier than the Unix epoch"))?
        .as_nanos();
    let databases = ensure_module_manifest(application, &module)?;
    let migration_id = create_pair_for_databases(
        &application.directory,
        &module,
        &migration_name,
        &databases,
        timestamp,
    )?;
    println!(
        "Created src/modules/{module}/migrations/{migration_id} for {}.",
        databases.join(" and ")
    );
    println!("Edit both SQL variants before applying migrations.");
    Ok(ExitCode::SUCCESS)
}

#[cfg(test)]
pub(crate) fn create_pair(
    application_root: &Path,
    module: &str,
    name: &str,
    timestamp: u128,
) -> Result<String, String> {
    create_pair_for_databases(
        application_root,
        module,
        name,
        &[String::from("sqlite"), String::from("postgresql")],
        timestamp,
    )
}

fn create_pair_for_databases(
    application_root: &Path,
    module: &str,
    name: &str,
    databases: &[String],
    timestamp: u128,
) -> Result<String, String> {
    let mut directories = Vec::new();
    for database in databases {
        if database != "sqlite" && database != "postgresql" {
            return Err(format!("unsupported migration database `{database}`"));
        }
        let directory = application_root
            .join("src/modules")
            .join(module)
            .join("migrations")
            .join(database);
        fs::create_dir_all(&directory).map_err(|error| {
            format!("could not create {database} migrations directory: {error}")
        })?;
        directories.push((database.as_str(), directory));
    }
    if directories.is_empty() {
        return Err(String::from(
            "module must support at least one SQL database",
        ));
    }

    for collision in 0_u16..10_000 {
        let id = format!("{timestamp:020}_{collision:04}_{name}");
        let mut files = Vec::new();
        let mut collision_found = false;
        for (database, directory) in &directories {
            let path = directory.join(format!("{id}.sql"));
            match OpenOptions::new().write(true).create_new(true).open(&path) {
                Ok(file) => files.push((database, path, file)),
                Err(error) if error.kind() == crate::std::io::ErrorKind::AlreadyExists => {
                    collision_found = true;
                    break;
                }
                Err(error) => {
                    for (_, reserved, _) in &files {
                        let _ = fs::remove_file(reserved);
                    }
                    return Err(format!(
                        "could not reserve migration `{}`: {error}",
                        path.display()
                    ));
                }
            }
        }
        if collision_found {
            for (_, reserved, _) in &files {
                let _ = fs::remove_file(reserved);
            }
            continue;
        }
        for (database, path, file) in files.iter_mut() {
            let template = if **database == "sqlite" {
                format!(
                    "-- Migration {id}; replace before applying.\nSELECT RAISE(ABORT, 'replace migration template before applying');\n"
                )
            } else {
                format!(
                    "-- Migration {id}; replace before applying.\nDO $$ BEGIN RAISE EXCEPTION 'replace migration template before applying'; END $$;\n"
                )
            };
            let write_result = file.write_all(template.as_bytes());
            if let Err(error) = write_result {
                let display_path = format!("{}", path.display());
                for (_, reserved, _) in &files {
                    let _ = fs::remove_file(reserved);
                }
                return Err(format!(
                    "could not write migration `{display_path}`: {error}"
                ));
            }
        }
        return Ok(id);
    }
    Err(String::from(
        "could not reserve a unique timestamped migration filename",
    ))
}

fn ensure_module_manifest(application: &Application, module: &str) -> Result<Vec<String>, String> {
    let relative = PathBuf::from("src/modules")
        .join(module)
        .join("module.toml");
    let path = application.directory.join(&relative);
    let manifest = if path.is_file() {
        let source = fs::read_to_string(&path)
            .map_err(|error| format!("could not read `{}`: {error}", path.display()))?;
        toml::from_str::<ModuleManifest>(&source)
            .map_err(|error| format!("invalid module manifest `{}`: {error}", path.display()))?
    } else {
        let source = format!(
            "id = \"{}.{}\"\nsupported_databases = [\"sqlite\", \"postgresql\"]\ndatabase_connections = [\"default\"]\n",
            application.package_name, module
        );
        feluqa::console::generator::write_file(&application.directory, relative, &source)?;
        ModuleManifest {
            id: format!("{}.{}", application.package_name, module),
            supported_databases: vec![String::from("sqlite"), String::from("postgresql")],
            database_connections: Some(vec![String::from("default")]),
            version: None,
            capabilities: None,
        }
    };
    if manifest.id.trim().is_empty()
        || manifest.supported_databases.is_empty()
        || manifest.version.as_deref() == Some("")
        || manifest
            .capabilities
            .as_ref()
            .is_some_and(|values| values.iter().any(|capability| capability.trim().is_empty()))
    {
        return Err(String::from(
            "module manifest needs an id and at least one supported database",
        ));
    }
    let connections = manifest
        .database_connections
        .unwrap_or_else(|| vec![String::from("default")]);
    let mut unique_connections = Vec::new();
    if connections.is_empty() {
        return Err(String::from(
            "module must declare at least one database connection",
        ));
    }
    for connection in connections {
        if connection.is_empty()
            || connection.len() > 64
            || !connection.as_bytes()[0].is_ascii_lowercase()
            || !connection
                .bytes()
                .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
        {
            return Err(format!("invalid module database connection `{connection}`"));
        }
        if unique_connections.contains(&connection) {
            return Err(format!(
                "module database connection `{connection}` is declared more than once"
            ));
        }
        unique_connections.push(connection);
    }
    let mut supported = Vec::new();
    for database in manifest.supported_databases {
        if database != "sqlite" && database != "postgresql" {
            return Err(format!("unsupported module database `{database}`"));
        }
        if supported.contains(&database) {
            return Err(format!(
                "module database `{database}` is declared more than once"
            ));
        }
        supported.push(database);
    }
    Ok(supported)
}
