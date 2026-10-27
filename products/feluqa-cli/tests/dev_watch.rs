#![no_implicit_prelude]

extern crate std;

use std::assert_eq;
use std::assert_ne;
use std::clone::Clone;
use std::convert::From;
use std::env;
use std::format;
use std::fs::{self, File};
use std::io::Read;
use std::matches;
use std::mem::drop;
use std::net::{SocketAddr, TcpListener, TcpStream};
use std::ops::Drop;
use std::option::Option::{self, None, Some};
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::result::Result::{self, Err, Ok};
use std::string::{String, ToString};
use std::sync::atomic::{AtomicU64, Ordering};
use std::thread;
use std::time::{Duration, Instant};

struct Fixture(PathBuf);

impl Fixture {
    fn new() -> Result<Self, String> {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        let directory = env::temp_dir().join(std::format!(
            "feluqa-watch-e2e-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir_all(directory.join("src")).map_err(|error| error.to_string())?;
        fs::create_dir_all(directory.join("resources/views")).map_err(|error| error.to_string())?;
        fs::create_dir_all(directory.join("storage")).map_err(|error| error.to_string())?;
        Ok(Self(directory))
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let _cleanup = fs::remove_dir_all(&self.0);
    }
}

struct Processes {
    cli: Option<Child>,
    marker: PathBuf,
}

impl Drop for Processes {
    fn drop(&mut self) {
        if let Ok(value) = fs::read_to_string(&self.marker) {
            if let Some((_, pid)) = value.split_once(':') {
                let _cleanup = Command::new("kill")
                    .arg("-TERM")
                    .arg(pid)
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
        }
        if let Some(cli) = self.cli.as_mut() {
            if matches!(cli.try_wait(), Ok(None)) {
                let _cleanup = cli.kill();
            }
            let _cleanup = cli.wait();
        }
    }
}

#[cfg(unix)]
#[test]
fn dev_keeps_last_server_after_failed_build_and_restarts_after_repair() -> Result<(), String> {
    let fixture = Fixture::new()?;
    let root = &fixture.0;
    let view_path = root.join("resources/views/home.view.rs");
    let marker = root.join("storage/instance.txt");
    let log_path = root.join("dev.log");
    let view_crate = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../_crates/feluqa-view");
    fs::write(
        root.join("Cargo.toml"),
        format!(
            "[package]\nname = \"watch-fixture\"\nversion = \"0.1.0\"\nedition = \"2024\"\nbuild = \"build.rs\"\n\n[dependencies]\nfeluqa_view = {{ package = \"feluqa-view\", path = {:?} }}\n\n[build-dependencies]\nfeluqa_view = {{ package = \"feluqa-view\", path = {:?}, features = [\"compiler\"] }}\n",
            view_crate, view_crate
        ),
    )
    .map_err(|error| error.to_string())?;
    fs::write(
        root.join("feluqa.toml"),
        "[app]\nname = \"Watcher fixture\"\nprofile = \"web\"\n",
    )
    .map_err(|error| error.to_string())?;

    let port_listener = TcpListener::bind(("127.0.0.1", 0)).map_err(|error| error.to_string())?;
    let port = port_listener
        .local_addr()
        .map_err(|error| error.to_string())?
        .port();
    drop(port_listener);
    fs::write(root.join("build.rs"), compiler_source()).map_err(|error| error.to_string())?;
    fs::write(root.join("src/main.rs"), server_source()).map_err(|error| error.to_string())?;
    fs::write(&view_path, "<h1>v1</h1>").map_err(|error| error.to_string())?;

    let log = File::create(&log_path).map_err(|error| error.to_string())?;
    let stderr = log.try_clone().map_err(|error| error.to_string())?;
    let cli = Command::new(env!("CARGO_BIN_EXE_feluqa"))
        .arg("dev")
        .current_dir(root)
        .env("FELUQA_TEST_PORT", port.to_string())
        .env("FELUQA_TEST_MARKER", &marker)
        .stdout(Stdio::from(log))
        .stderr(Stdio::from(stderr))
        .spawn()
        .map_err(|error| format!("could not start feluqa dev test process: {error}"))?;
    let mut processes = Processes {
        cli: Some(cli),
        marker: marker.clone(),
    };

    let first_instance = wait_for_instance(&marker, port, "<h1>v1</h1>", Duration::from_secs(90))?;

    fs::write(&view_path, "@if (\n<h1>invalid</h1>\n").map_err(|error| error.to_string())?;
    wait_for_log(
        &log_path,
        "development build failed",
        Duration::from_secs(60),
    )?;
    assert_eq!(read_instance(&marker)?.as_str(), first_instance.as_str());
    assert_eq!(probe(port).as_deref(), Some("<h1>v1</h1>"));

    fs::write(&view_path, "<h1>v2</h1>").map_err(|error| error.to_string())?;
    let second_instance = wait_for_instance(&marker, port, "<h1>v2</h1>", Duration::from_secs(60))?;
    assert_ne!(first_instance, second_instance);
    assert_eq!(probe(port).as_deref(), Some("<h1>v2</h1>"));

    stop_marked_process(&marker)?;
    wait_for_cli_exit(&mut processes, Duration::from_secs(10))?;
    Ok(())
}

#[cfg(unix)]
fn compiler_source() -> &'static str {
    r##"#![no_implicit_prelude]
extern crate feluqa_view;
extern crate std;

use feluqa_view::compiler::Compiler;
use std::boxed::Box;
use std::convert::From;
use std::env;
use std::error::Error;
use std::path::PathBuf;
use std::println;
use std::result::Result::{self, Ok};

fn main() -> Result<(), Box<dyn Error>> {
    let root = PathBuf::from(env::var("CARGO_MANIFEST_DIR")?).join("resources/views");
    let mut compiler = Compiler::new();
    compiler.runtime_path("::feluqa_view")?;
    compiler.add_root("app", &root)?;
    compiler.entry("home", "app::home")?;
    let generated = compiler.generate()?;
    for dependency in &generated.dependencies {
        println!("cargo:rerun-if-changed={}", dependency.display());
    }
    generated.write_to(&PathBuf::from(env::var("OUT_DIR")?).join("views.rs"))?;
    Ok(())
}
"##
}

#[cfg(unix)]
fn server_source() -> &'static str {
    r##"#![no_implicit_prelude]
extern crate std;
use std::result::Result::Ok;

mod views {
    include!(concat!(env!("OUT_DIR"), "/views.rs"));
}

fn main() {
    let port = std::env::var("FELUQA_TEST_PORT").unwrap().parse::<u16>().unwrap();
    let marker = std::env::var("FELUQA_TEST_MARKER").unwrap();
    let body = views::home().unwrap();
    let listener = std::net::TcpListener::bind(("127.0.0.1", port)).unwrap();
    std::fs::write(&marker, std::format!("{body}:{}", std::process::id())).unwrap();
    for incoming in listener.incoming() {
        if let Ok(mut stream) = incoming {
            let _result = std::io::Write::write_all(&mut stream, body.as_bytes());
        }
    }
}
"##
}

#[cfg(unix)]
fn probe(port: u16) -> Option<String> {
    let address = SocketAddr::from(([127, 0, 0, 1], port));
    let mut stream = TcpStream::connect_timeout(&address, Duration::from_millis(250)).ok()?;
    stream.set_read_timeout(Some(Duration::from_secs(1))).ok()?;
    let mut response = String::new();
    stream.read_to_string(&mut response).ok()?;
    Some(response)
}

#[cfg(unix)]
fn wait_for_instance(
    marker: &PathBuf,
    port: u16,
    version: &str,
    timeout: Duration,
) -> Result<String, String> {
    let started = Instant::now();
    loop {
        if let Ok(value) = read_instance(marker) {
            if value.starts_with(&std::format!("{version}:"))
                && probe(port).as_deref() == Some(version)
            {
                return Ok(value);
            }
        }
        if started.elapsed() >= timeout {
            return Err(std::format!(
                "timed out waiting for `{version}` app instance"
            ));
        }
        thread::sleep(Duration::from_millis(50));
    }
}

#[cfg(unix)]
fn read_instance(marker: &PathBuf) -> Result<String, String> {
    fs::read_to_string(marker).map_err(|error| error.to_string())
}

#[cfg(unix)]
fn wait_for_log(path: &PathBuf, needle: &str, timeout: Duration) -> Result<(), String> {
    let started = Instant::now();
    loop {
        if fs::read_to_string(path).is_ok_and(|contents| contents.contains(needle)) {
            return Ok(());
        }
        if started.elapsed() >= timeout {
            return Err(std::format!("timed out waiting for log text `{needle}`"));
        }
        thread::sleep(Duration::from_millis(50));
    }
}

#[cfg(unix)]
fn stop_marked_process(marker: &PathBuf) -> Result<(), String> {
    let value = read_instance(marker)?;
    let (_, pid) = value
        .split_once(':')
        .ok_or_else(|| String::from("invalid instance marker"))?;
    let status = Command::new("kill")
        .arg("-TERM")
        .arg(pid)
        .status()
        .map_err(|error| format!("could not signal test app process: {error}"))?;
    if !status.success() {
        return Err(String::from("could not stop the test app process"));
    }
    Ok(())
}

#[cfg(unix)]
fn wait_for_cli_exit(processes: &mut Processes, timeout: Duration) -> Result<(), String> {
    let started = Instant::now();
    loop {
        let cli = processes
            .cli
            .as_mut()
            .ok_or_else(|| String::from("missing feluqa dev process"))?;
        if cli.try_wait().map_err(|error| error.to_string())?.is_some() {
            let _reaped = cli.wait().map_err(|error| error.to_string())?;
            processes.cli = None;
            return Ok(());
        }
        if started.elapsed() >= timeout {
            return Err(String::from(
                "feluqa dev did not exit after its app stopped",
            ));
        }
        thread::sleep(Duration::from_millis(50));
    }
}
