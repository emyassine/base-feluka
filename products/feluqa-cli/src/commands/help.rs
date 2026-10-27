#![no_implicit_prelude]

use crate::std::option::Option;
use crate::std::option::Option::Some;
use crate::std::println;
use crate::std::process::ExitCode;

pub(crate) fn run(topic: Option<&str>) -> ExitCode {
    if topic == Some("make") {
        return make();
    }
    println!("Feluqa — sovereign application platform");
    println!();
    println!("Global: feluqa new <name> [--profile web] | --version | help");
    println!("Workspace: feluqa list | migrate <app> | seed <app> <seeder-id>");
    println!("Inside an app: dev | build | check | test | migrate | seed <id>");
    println!("Inside an app:");
    println!("  feluqa make model <name>");
    println!("  feluqa make controller <name> [--model <model>]");
    println!("  feluqa make resource <model>");
    println!("  feluqa make service <name>");
    println!("  feluqa make migration <name> [--module <name>]");
    println!("  feluqa make seeder <name>");
    println!("  feluqa make panel <name>");
    println!("  feluqa make module <name>");
    ExitCode::SUCCESS
}

pub(crate) fn make() -> ExitCode {
    println!("feluqa make <thing> <name>");
    println!();
    println!("  make model       Create an Eloquent model.");
    println!("  make controller  Create an HTTP controller.");
    println!("  make resource    Create permission-checked CRUD for a model.");
    println!("  make service     Create a business service.");
    println!("  make panel       Create and register a business panel.");
    println!("  make module      Create a module with dialect migration folders.");
    println!("  make migration   Create ordered SQL files for supported databases.");
    println!("  make seeder      Create a seeder, separate from migrations.");
    println!();
    println!("Example: feluqa make migration create_invoices --module billing");
    ExitCode::SUCCESS
}

pub(crate) fn make_command(target: &str) -> ExitCode {
    let (usage, description) = match target {
        "model" => (
            "feluqa make model <name>",
            "Create an Eloquent model under src/app/models.",
        ),
        "controller" => (
            "feluqa make controller <name> [--model <model>] [--connection <name>]",
            "Create an HTTP controller. With --model, add an authorized model lookup.",
        ),
        "resource" => (
            "feluqa make resource <model> [--connection <name>]",
            "Create permission-checked CRUD handlers and routes for an existing model.",
        ),
        "service" => ("feluqa make service <name>", "Create a business service."),
        "panel" => (
            "feluqa make panel <name>",
            "Create and register a business panel.",
        ),
        "module" => (
            "feluqa make module <name>",
            "Create a module and its dialect migration folders.",
        ),
        "migration" => (
            "feluqa make migration <name> [--module <name>]",
            "Reserve collision-safe, ordered SQL migration files for every declared database.",
        ),
        "seeder" => (
            "feluqa make seeder <name>",
            "Create a seeder separate from migrations.",
        ),
        _ => {
            println!("Unknown generator `{target}`. Run `feluqa help make`.");
            return ExitCode::FAILURE;
        }
    };
    println!("{usage}");
    println!();
    println!("{description}");
    println!();
    println!("Run inside a Feluqa application. Add `--help` after a target for its usage.");
    ExitCode::SUCCESS
}
