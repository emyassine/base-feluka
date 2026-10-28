#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(missing_docs)]

//! Build-time discovery and compilation of per-module SQL migrations.

use crate::serde::Deserialize;
use crate::std::boxed::Box;
use crate::std::clone::Clone;
use crate::std::cmp::Ord;
use crate::std::collections::BTreeSet;
use crate::std::convert::{From, Into};
use crate::std::error::Error;
use crate::std::fmt::Write as FmtWrite;
use crate::std::format;
use crate::std::fs;
use crate::std::io;
use crate::std::iter::Iterator;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::path::Path;
use crate::std::println;
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::{String, ToString};
use crate::std::vec;
use crate::std::vec::Vec;
use crate::std::writeln;

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

/// Validate module migration manifests and write a Rust registry with SQL embedded in the binary.
pub fn generate_migration_registry(project: &Path, output: &Path) -> Result<(), Box<dyn Error>> {
    let source_modules = project.join("src/modules");
    let modules_root = if source_modules.is_dir() {
        source_modules
    } else {
        project.join("modules")
    };
    generate_migration_registry_from(&modules_root, output)
}

/// Validate migration manifests under a caller-selected module root and generate the registry.
pub fn generate_migration_registry_from(
    modules_root: &Path,
    output: &Path,
) -> Result<(), Box<dyn Error>> {
    println!("cargo:rerun-if-changed={}", modules_root.display());
    let mut module_directories = Vec::new();
    for entry in fs::read_dir(&modules_root)? {
        let entry = entry?;
        if entry.file_type()?.is_dir() {
            module_directories.push(entry.path());
        }
    }
    module_directories.sort();

    let mut generated = String::from(
        "// Generated from src/modules/*/module.toml and each module's dialect migrations.\n",
    );
    let mut all_modules = Vec::new();
    let mut module_ids = BTreeSet::new();
    for module_directory in module_directories {
        let module_name = module_directory
            .file_name()
            .and_then(|name| name.to_str())
            .ok_or_else(|| invalid("module directory name must be UTF-8"))?;
        if !valid_module_name(module_name) {
            return Err(invalid(format!(
                "invalid Rust module directory `{module_name}`"
            )));
        }

        let manifest_path = module_directory.join("module.toml");
        if !manifest_path.is_file() {
            continue;
        }
        println!("cargo:rerun-if-changed={}", manifest_path.display());
        let manifest_source = fs::read_to_string(&manifest_path)?;
        let manifest: ModuleManifest = crate::toml::from_str(&manifest_source)?;
        if !valid_module_id(&manifest.id)
            || manifest.supported_databases.is_empty()
            || !module_ids.insert(manifest.id.clone())
            || manifest.version.as_deref() == Some("")
            || manifest
                .capabilities
                .as_ref()
                .is_some_and(|values| values.iter().any(|capability| capability.trim().is_empty()))
        {
            return Err(invalid(format!(
                "module `{module_name}` needs a valid id and at least one supported database"
            )));
        }
        let mut supported = manifest.supported_databases.clone();
        supported.sort();
        supported.dedup();
        if supported.len() != manifest.supported_databases.len()
            || supported
                .iter()
                .any(|database| database != "sqlite" && database != "postgresql")
        {
            return Err(invalid(format!(
                "module `{module_name}` has duplicate or unsupported database declarations"
            )));
        }
        let connections = manifest
            .database_connections
            .unwrap_or_else(|| vec![String::from("default")]);
        let mut connection_names = BTreeSet::new();
        if connections.is_empty()
            || connections
                .iter()
                .any(|name| !valid_connection_name(name) || !connection_names.insert(name.as_str()))
        {
            return Err(invalid(format!(
                "module `{module_name}` has an empty, invalid or duplicate database connection"
            )));
        }

        let mut expected_migrations: Option<Vec<String>> = None;
        let mut variant_names = Vec::new();
        writeln!(generated, "pub mod {module_name} {{")?;
        for (database, rust_variant, rust_dialect) in [
            ("sqlite", "SQLITE", "Sqlite"),
            ("postgresql", "POSTGRESQL", "Postgresql"),
        ] {
            let migration_directory = module_directory.join("migrations").join(database);
            if !manifest
                .supported_databases
                .iter()
                .any(|declared| declared == database)
            {
                if migration_directory.exists() {
                    return Err(invalid(format!(
                        "module `{module_name}` has `{database}` migrations but does not declare support"
                    )));
                }
                continue;
            }
            if !migration_directory.is_dir() {
                return Err(invalid(format!(
                    "module `{module_name}` declares `{database}` but is missing `{}`",
                    migration_directory.display()
                )));
            }
            println!("cargo:rerun-if-changed={}", migration_directory.display());
            let mut files = Vec::new();
            for entry in fs::read_dir(&migration_directory)? {
                let entry = entry?;
                if !entry.file_type()?.is_file()
                    || entry.path().extension().and_then(|x| x.to_str()) != Some("sql")
                {
                    return Err(invalid(format!(
                        "module `{module_name}` migration directory contains a non-SQL file: {}",
                        entry.path().display()
                    )));
                }
                let id = entry
                    .path()
                    .file_stem()
                    .and_then(|stem| stem.to_str())
                    .ok_or_else(|| invalid("migration filename must be UTF-8"))?
                    .to_string();
                if !valid_migration_id(&id) {
                    return Err(invalid(format!(
                        "module `{module_name}` has invalid migration ID `{id}`"
                    )));
                }
                files.push((id, entry.path()));
            }
            files.sort_by(|left, right| left.0.cmp(&right.0));
            let ids: Vec<String> = files.iter().map(|(id, _)| id.clone()).collect();
            if let Some(expected) = &expected_migrations {
                if expected != &ids {
                    return Err(invalid(format!(
                        "module `{module_name}` must provide the same migration IDs for every declared database"
                    )));
                }
            } else {
                expected_migrations = Some(ids);
            }

            writeln!(
                generated,
                "    pub const {rust_variant}: ::feluqa::database::MigrationSet = ::feluqa::database::MigrationSet {{"
            )?;
            writeln!(generated, "        module: {:?},", manifest.id)?;
            writeln!(
                generated,
                "        dialect: ::feluqa::database::Dialect::{rust_dialect},"
            )?;
            writeln!(generated, "        migrations: &[")?;
            for (id, path) in files {
                println!("cargo:rerun-if-changed={}", path.display());
                let path = path
                    .canonicalize()?
                    .to_str()
                    .ok_or_else(|| invalid("migration path must be UTF-8"))?
                    .to_string();
                writeln!(
                    generated,
                    "            ::feluqa::database::Migration {{ id: {:?}, sql: include_str!({:?}) }},",
                    id, path
                )?;
            }
            writeln!(generated, "        ],\n    }};")?;
            variant_names.push(rust_variant);
        }
        writeln!(
            generated,
            "    pub const MIGRATIONS: ::feluqa::database::ModuleMigrations = ::feluqa::database::ModuleMigrations {{"
        )?;
        writeln!(generated, "        module: {:?},", manifest.id)?;
        writeln!(
            generated,
            "        connections: &[{}],",
            connections
                .iter()
                .map(|connection| format!("{:?}", connection))
                .collect::<Vec<String>>()
                .join(", ")
        )?;
        writeln!(
            generated,
            "        supported_dialects: &[{}],",
            manifest
                .supported_databases
                .iter()
                .map(|database| match database.as_str() {
                    "sqlite" => "::feluqa::database::Dialect::Sqlite",
                    _ => "::feluqa::database::Dialect::Postgresql",
                })
                .collect::<Vec<&str>>()
                .join(", ")
        )?;
        writeln!(
            generated,
            "        variants: &[{}],\n    }};",
            variant_names.join(", ")
        )?;
        writeln!(generated, "}}")?;
        all_modules.push(format!("&{module_name}::MIGRATIONS"));
    }
    writeln!(
        generated,
        "pub const ALL: &[&::feluqa::database::ModuleMigrations] = &[{}];",
        all_modules.join(", ")
    )?;
    fs::write(output, generated)?;
    Ok(())
}

fn valid_module_name(value: &str) -> bool {
    !value.is_empty()
        && value.as_bytes()[0].is_ascii_lowercase()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
}

fn valid_module_id(value: &str) -> bool {
    !value.is_empty()
        && !value.starts_with('.')
        && !value.ends_with('.')
        && !value.contains("..")
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase()
                || byte.is_ascii_digit()
                || byte == b'_'
                || byte == b'-'
                || byte == b'.'
        })
}

fn valid_connection_name(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.as_bytes()[0].is_ascii_lowercase()
        && value
            .bytes()
            .all(|byte| byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_')
}

fn valid_migration_id(value: &str) -> bool {
    !value.is_empty()
        && value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_' || byte == b'-'
        })
}

fn invalid(message: impl Into<String>) -> Box<dyn Error> {
    Box::new(io::Error::new(io::ErrorKind::InvalidData, message.into()))
}

#[cfg(test)]
mod tests {
    use super::generate_migration_registry;
    use crate::std::assert;
    use crate::std::env;
    use crate::std::format;
    use crate::std::fs;

    #[test]
    fn registry_compiles_all_declared_dialect_variants_and_rejects_missing_files() {
        let root = env::temp_dir().join(format!(
            "feluqa-registry-build-{}",
            crate::std::process::id()
        ));
        let _ = fs::remove_dir_all(&root);
        let module = root.join("src/modules/crm");
        fs::create_dir_all(module.join("migrations/sqlite")).expect("create SQLite migrations");
        fs::create_dir_all(module.join("migrations/postgresql"))
            .expect("create PostgreSQL migrations");
        fs::write(
            module.join("module.toml"),
            "id = \"demo.crm\"\nversion = \"0.1.0\"\ncapabilities = []\nsupported_databases = [\"sqlite\", \"postgresql\"]\ndatabase_connections = [\"default\", \"analytics\"]\n",
        )
        .expect("write module manifest");
        for dialect in ["sqlite", "postgresql"] {
            fs::write(
                module
                    .join("migrations")
                    .join(dialect)
                    .join("0001_create_customers.sql"),
                "CREATE TABLE customers (id INTEGER PRIMARY KEY);",
            )
            .expect("write SQL variant");
        }
        let output = root.join("migrations.rs");
        generate_migration_registry(&root, &output).expect("generate embedded registry");
        let source = fs::read_to_string(&output).expect("read generated registry");
        assert!(source.contains("demo.crm"));
        assert!(source.contains("Dialect::Sqlite"));
        assert!(source.contains("Dialect::Postgresql"));
        assert!(source.contains("connections: &[\"default\", \"analytics\"]"));
        assert!(source.contains("0001_create_customers"));

        fs::write(
            module.join("module.toml"),
            "id = \"demo.crm\"\nsupported_databases = [\"sqlite\", \"postgresql\"]\ndatabase_connections = [\"default\", \"NotValid\"]\n",
        )
        .expect("write invalid connection declaration");
        assert!(generate_migration_registry(&root, &output).is_err());
        fs::write(
            module.join("module.toml"),
            "id = \"demo.crm\"\nsupported_databases = [\"sqlite\", \"postgresql\"]\ndatabase_connections = [\"default\", \"analytics\"]\n",
        )
        .expect("restore valid module manifest");

        fs::remove_file(module.join("migrations/postgresql/0001_create_customers.sql"))
            .expect("remove declared backend variant");
        assert!(generate_migration_registry(&root, &output).is_err());
        fs::remove_dir_all(root).expect("remove isolated project");
    }
}
