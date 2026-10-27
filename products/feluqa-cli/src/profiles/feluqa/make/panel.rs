#![no_implicit_prelude]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::format;
use crate::std::fs;
use crate::std::iter::Iterator;
use crate::std::println;
use crate::std::result::Result::Err;
use crate::std::result::Result::Ok;
use crate::__feluqa_profile_feluqa::context::Application;
use crate::std::ffi::OsString;
use crate::std::path::PathBuf;
use crate::std::process::ExitCode;
use crate::std::result::Result;
use crate::std::string::String;

#[feluqa::command(
    name = "make panel",
    description = "Generate a panel provider",
    usage = "feluqa make panel <arguments>",
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

fn generate(arguments: &[OsString], application: &Application) -> Result<ExitCode, String> {
    let slug = feluqa::console::generator::name(arguments, "usage: feluqa make panel <name>")?;
    let title = feluqa::console::generator::pascal_case(&slug).replace('_', " ");
    let module = format!("#![no_implicit_prelude]\n\npub mod panel;\n");
    let source = format!(
        "#![no_implicit_prelude]\n\nuse crate::feluqa;\nuse feluqa::panel::{{Panel, PanelCatalog, PanelCatalogError, PanelKind, PanelProvider}};\nuse feluqa::prelude::Result;\n\npub struct {title}PanelProvider;\nimpl PanelProvider for {title}PanelProvider {{\n    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {{\n        catalog.register_panel(Panel::single_page(\n            \"{slug}\", \"{title}\", \"/admin/{slug}\", PanelKind::Business,\n            \"business.{slug}.manage\", \"{title}\",\n        )?)\n    }}\n}}\n"
    );
    let module_dir = PathBuf::from("src/modules").join(&slug);
    feluqa::console::generator::write_file(&application.directory, module_dir.join("mod.rs"), &module)?;
    feluqa::console::generator::write_file(&application.directory, module_dir.join("panel.rs"), &source)?;
    register_in_catalog(application, &slug, &title)?;
    println!("Created src/modules/{slug} and registered its panel provider.");
    Ok(ExitCode::SUCCESS)
}

fn register_in_catalog(application: &Application, slug: &str, title: &str) -> Result<(), String> {
    let path = application.directory.join("src/modules/mod.rs");
    let mut source = match fs::read_to_string(&path) {
        Ok(source) => source,
        Err(error) if error.kind() == crate::std::io::ErrorKind::NotFound => String::from(
            "#![no_implicit_prelude]\n\nuse crate::feluqa;\nuse feluqa::panel::{PanelCatalog, PanelCatalogError, PanelProvider};\nuse feluqa::prelude::{Default, Result};\nuse crate::std::result::Result::Ok;\n\npub mod seeders;\n\npub struct AppPanelProvider;\nimpl PanelProvider for AppPanelProvider {\n    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> { Ok(()) }\n}\npub fn panel_catalog() -> Result<PanelCatalog, PanelCatalogError> {\n    let mut catalog = PanelCatalog::default();\n    catalog.register_provider(&AppPanelProvider)?;\n    Ok(catalog)\n}\n",
        ),
        Err(error) => return Err(format!("could not read `{}`: {error}", path.display())),
    };
    if !source.starts_with("#![no_implicit_prelude]") {
        return Err(String::from(
            "src/modules/mod.rs must start with #![no_implicit_prelude]",
        ));
    }
    let declaration = format!("pub mod {slug};");
    if !source.lines().any(|line| line.trim() == declaration) {
        let insertion = "#![no_implicit_prelude]\n";
        source = source.replacen(insertion, &format!("{insertion}\n{declaration}\n"), 1);
    }
    let provider =
        format!("        catalog.register_provider(&{slug}::panel::{title}PanelProvider)?;");
    if !source.contains(&provider) {
        let end = source.rfind("    fn register(&self, catalog: &mut PanelCatalog) -> Result<(), PanelCatalogError> {")
            .ok_or_else(|| String::from("AppPanelProvider implementation was not found"))?;
        let insert = source[end..]
            .find("Ok(())")
            .map(|offset| end + offset)
            .ok_or_else(|| String::from("AppPanelProvider has no return point"))?;
        source.insert_str(insert, &format!("{provider}\n        "));
    }
    fs::write(&path, source)
        .map_err(|error| format!("could not update `{}`: {error}", path.display()))
}
