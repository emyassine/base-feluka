#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Deterministic lifecycle for statically linked application modules.

extern crate alloc;

use alloc::boxed::Box;
extern crate core;
#[cfg(test)]
extern crate std;

use alloc::collections::{BTreeMap, BTreeSet};
use alloc::string::String;
use alloc::vec::Vec;
use core::clone::Clone;
use core::convert::From;
use core::fmt;
use core::iter::Iterator;
use core::marker::Send;
use core::option::Option::{None, Some};
use core::result::Result;
use core::result::Result::{Err, Ok};
use core::write;

/// Application module startup/shutdown contract. Third-party dynamic loading is not implied.
pub trait Module: Send {
    /// Stable module identifier, such as `numerimondes::content`.
    fn id(&self) -> &str;
    /// IDs that must complete startup before this module starts.
    fn dependencies(&self) -> &[String];
    /// Initialize resources; on error, the module must tolerate `stop` for partial cleanup.
    fn start(&mut self) -> Result<(), String>;
    /// Release owned resources. The runtime calls this in reverse startup order.
    fn stop(&mut self) -> Result<(), String>;
}

/// Registers application-wide services, routes, commands or panel providers during startup.
///
/// The context is owned by the host application, keeping Feluqa's runtime policy separate
/// from any particular web server or dependency-injection container.
pub trait ServiceProvider<C> {
    /// Error type reported by registration and lifecycle hooks.
    type Error: fmt::Display;
    /// Stable provider identifier used in startup diagnostics.
    fn id(&self) -> &str;
    /// Register this provider's declarations into the application context.
    fn register(&self, context: &mut C) -> Result<(), Self::Error>;
}

/// Owns registered modules, validates dependency graphs and manages deterministic lifecycle.
#[derive(Default)]
pub struct ModuleRuntime {
    modules: BTreeMap<String, Box<dyn Module>>,
    started: Vec<String>,
    sealed: bool,
}

impl ModuleRuntime {
    /// Add one module before startup. Duplicate/invalid IDs fail without mutating the registry.
    pub fn register(&mut self, module: impl Module + 'static) -> Result<(), LifecycleError> {
        if self.sealed {
            return Err(LifecycleError::RegistrySealed);
        }
        let id = String::from(module.id());
        if !valid_id(&id) {
            return Err(LifecycleError::InvalidId(id));
        }
        if self.modules.contains_key(&id) {
            return Err(LifecycleError::DuplicateModule(id));
        }
        self.modules.insert(id, Box::new(module));
        Ok(())
    }

    /// Start modules in stable topological order; roll back started modules on the first error.
    pub fn start(&mut self) -> Result<(), LifecycleError> {
        if self.sealed {
            return Err(LifecycleError::AlreadyStarted);
        }
        self.sealed = true;
        let order = self.start_order()?;
        for id in order {
            let result = self
                .modules
                .get_mut(&id)
                .ok_or(LifecycleError::RegistryCorrupt)?
                .start();
            if let Err(message) = result {
                let mut cleanup_errors = Vec::new();
                if let Some(module) = self.modules.get_mut(&id) {
                    if let Err(cleanup) = module.stop() {
                        cleanup_errors.push((id.clone(), cleanup));
                    }
                }
                self.stop_started(&mut cleanup_errors);
                return Err(LifecycleError::StartFailed {
                    module: id,
                    message,
                    cleanup_errors,
                });
            }
            self.started.push(id);
        }
        Ok(())
    }

    /// Stop all started modules in reverse startup order, attempting every cleanup.
    pub fn shutdown(&mut self) -> Result<(), LifecycleError> {
        let mut cleanup_errors = Vec::new();
        self.stop_started(&mut cleanup_errors);
        if cleanup_errors.is_empty() {
            Ok(())
        } else {
            Err(LifecycleError::ShutdownFailed(cleanup_errors))
        }
    }

    /// Return the current successful startup sequence.
    pub fn started_modules(&self) -> &[String] {
        &self.started
    }

    /// Return IDs in stable registration order.
    pub fn module_ids(&self) -> impl Iterator<Item = &str> {
        self.modules.keys().map(String::as_str)
    }

    fn start_order(&self) -> Result<Vec<String>, LifecycleError> {
        let mut temporary = BTreeSet::new();
        let mut permanent = BTreeSet::new();
        let mut order = Vec::new();
        for id in self.modules.keys() {
            visit(
                id,
                &self.modules,
                &mut temporary,
                &mut permanent,
                &mut order,
            )?;
        }
        Ok(order)
    }

    fn stop_started(&mut self, errors: &mut Vec<(String, String)>) {
        while let Some(id) = self.started.pop() {
            match self.modules.get_mut(&id) {
                Some(module) => {
                    if let Err(message) = module.stop() {
                        errors.push((id, message));
                    }
                }
                None => errors.push((id, String::from("module registry invariant failed"))),
            }
        }
    }
}

fn visit(
    id: &str,
    modules: &BTreeMap<String, Box<dyn Module>>,
    temporary: &mut BTreeSet<String>,
    permanent: &mut BTreeSet<String>,
    order: &mut Vec<String>,
) -> Result<(), LifecycleError> {
    if permanent.contains(id) {
        return Ok(());
    }
    if !temporary.insert(String::from(id)) {
        return Err(LifecycleError::DependencyCycle(String::from(id)));
    }
    let module = modules
        .get(id)
        .ok_or_else(|| LifecycleError::MissingModule(String::from(id)))?;
    let mut dependencies: Vec<String> = module.dependencies().to_vec();
    dependencies.sort();
    for dependency in dependencies {
        if !modules.contains_key(&dependency) {
            return Err(LifecycleError::MissingDependency {
                module: String::from(id),
                dependency,
            });
        }
        visit(&dependency, modules, temporary, permanent, order)?;
    }
    temporary.remove(id);
    permanent.insert(String::from(id));
    order.push(String::from(id));
    Ok(())
}

fn valid_id(id: &str) -> bool {
    !id.is_empty()
        && id.split('.').all(|namespace| {
            !namespace.is_empty()
                && namespace.split("::").all(|part| {
                    !part.is_empty()
                        && part.bytes().all(|byte| {
                            byte.is_ascii_lowercase()
                                || byte.is_ascii_digit()
                                || byte == b'_'
                                || byte == b'-'
                        })
                })
        })
}

/// A dependency or lifecycle error. Cleanup failures accompany the initiating startup failure.
#[derive(Debug, PartialEq, Eq)]
pub enum LifecycleError {
    /// A module ID is empty or has invalid namespace syntax.
    InvalidId(String),
    /// A module ID is already registered.
    DuplicateModule(String),
    /// An enabled application module has no compiled implementation.
    UnknownModule(String),
    /// A declared dependency has not been registered.
    MissingDependency {
        /// Module declaring the dependency.
        module: String,
        /// Missing dependency ID.
        dependency: String,
    },
    /// A module disappeared from the validated registry.
    MissingModule(String),
    /// The dependency graph contains a cycle through this module.
    DependencyCycle(String),
    /// Startup has already been attempted for this runtime.
    AlreadyStarted,
    /// The module registry cannot change after startup begins.
    RegistrySealed,
    /// Internal registry state no longer satisfies its invariants.
    RegistryCorrupt,
    /// Startup failed; cleanup errors contain `(module ID, error message)` pairs.
    StartFailed {
        /// Module whose start hook failed.
        module: String,
        /// Error returned by the start hook.
        message: String,
        /// Errors from the failed module and earlier modules during cleanup.
        cleanup_errors: Vec<(String, String)>,
    },
    /// One or more stop hooks failed; errors contain `(module ID, error message)` pairs.
    ShutdownFailed(Vec<(String, String)>),
}
impl fmt::Display for LifecycleError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::InvalidId(id) => write!(formatter, "invalid module ID `{id}`"),
            Self::DuplicateModule(id) => write!(formatter, "module `{id}` is already registered"),
            Self::UnknownModule(id) => {
                write!(
                    formatter,
                    "enabled module `{id}` is not compiled into this application"
                )
            }
            Self::MissingModule(id) => write!(formatter, "module `{id}` was not found"),
            Self::MissingDependency { module, dependency } => write!(
                formatter,
                "module `{module}` requires missing module `{dependency}`"
            ),
            Self::DependencyCycle(id) => {
                write!(formatter, "module dependency cycle reaches `{id}`")
            }
            Self::AlreadyStarted => formatter.write_str("module runtime is already started"),
            Self::RegistrySealed => {
                formatter.write_str("module registry is sealed after startup begins")
            }
            Self::RegistryCorrupt => formatter.write_str("module registry invariant failed"),
            Self::StartFailed {
                module,
                message,
                cleanup_errors,
            } => write!(
                formatter,
                "module `{module}` failed to start: {message}; cleanup errors: {}",
                cleanup_errors.len()
            ),
            Self::ShutdownFailed(errors) => {
                write!(formatter, "{} module(s) failed to stop", errors.len())
            }
        }
    }
}
impl core::error::Error for LifecycleError {}

#[cfg(test)]
mod tests {
    use super::{LifecycleError, Module, ModuleRuntime};
    use crate::core::result::Result;
    use crate::core::result::Result::{Err, Ok};
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::clone::Clone;
    use crate::std::convert::From;
    use crate::std::default::Default;
    use crate::std::format;
    use crate::std::iter::Iterator;
    use crate::std::matches;
    use crate::std::string::String;
    use crate::std::sync::{Arc, Mutex};
    use crate::std::vec;
    use crate::std::vec::Vec;

    struct TestModule {
        id: String,
        dependencies: Vec<String>,
        log: Arc<Mutex<Vec<String>>>,
        fail: bool,
    }
    impl Module for TestModule {
        fn id(&self) -> &str {
            &self.id
        }
        fn dependencies(&self) -> &[String] {
            &self.dependencies
        }
        fn start(&mut self) -> Result<(), String> {
            self.log
                .lock()
                .expect("log")
                .push(format!("start:{}", self.id));
            if self.fail {
                Err(String::from("injected failure"))
            } else {
                Ok(())
            }
        }
        fn stop(&mut self) -> Result<(), String> {
            self.log
                .lock()
                .expect("log")
                .push(format!("stop:{}", self.id));
            Ok(())
        }
    }
    fn module(
        id: &str,
        dependencies: &[&str],
        log: &Arc<Mutex<Vec<String>>>,
        fail: bool,
    ) -> TestModule {
        TestModule {
            id: String::from(id),
            dependencies: dependencies
                .iter()
                .map(|item| String::from(*item))
                .collect(),
            log: Arc::clone(log),
            fail,
        }
    }

    #[test]
    fn dependencies_start_first_and_shutdown_runs_in_reverse() {
        let log = Arc::new(Mutex::new(Vec::new()));
        let mut runtime = ModuleRuntime::default();
        runtime
            .register(module("app", &["db"], &log, false))
            .expect("register app");
        runtime
            .register(module("db", &[], &log, false))
            .expect("register db");
        runtime.start().expect("start runtime");
        runtime.shutdown().expect("shutdown runtime");
        assert_eq!(
            *log.lock().expect("log"),
            vec!["start:db", "start:app", "stop:app", "stop:db"]
        );
    }

    #[test]
    fn startup_failure_cleans_partial_module_and_previous_modules() {
        let log = Arc::new(Mutex::new(Vec::new()));
        let mut runtime = ModuleRuntime::default();
        runtime
            .register(module("db", &[], &log, false))
            .expect("register db");
        runtime
            .register(module("app", &["db"], &log, true))
            .expect("register app");
        assert!(matches!(
            runtime.start(),
            Err(LifecycleError::StartFailed { .. })
        ));
        assert!(runtime.started_modules().is_empty());
        assert_eq!(
            *log.lock().expect("log"),
            vec!["start:db", "start:app", "stop:app", "stop:db"]
        );
    }

    #[test]
    fn missing_dependencies_and_cycles_fail_before_start() {
        let log = Arc::new(Mutex::new(Vec::new()));
        let mut runtime = ModuleRuntime::default();
        runtime
            .register(module("app", &["missing"], &log, false))
            .expect("register");
        assert!(matches!(
            runtime.start(),
            Err(LifecycleError::MissingDependency { .. })
        ));
        assert!(log.lock().expect("log").is_empty());

        let mut cyclic = ModuleRuntime::default();
        cyclic
            .register(module("alpha", &["beta"], &log, false))
            .expect("register alpha");
        cyclic
            .register(module("beta", &["alpha"], &log, false))
            .expect("register beta");
        assert!(matches!(
            cyclic.start(),
            Err(LifecycleError::DependencyCycle(_))
        ));
        assert!(log.lock().expect("log").is_empty());
    }
}
