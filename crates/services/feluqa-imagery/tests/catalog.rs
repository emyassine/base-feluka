#![no_implicit_prelude]

extern crate feluqa_imagery;
extern crate std;

use feluqa_imagery::{IconCatalog, IconSet};
use std::assert;
use std::assert_eq;
use std::convert::From;
use std::format;
use std::path::PathBuf;

#[test]
fn reads_and_installs_an_icon_inside_public_assets() {
    let catalog = IconCatalog::bundled();
    let svg = catalog
        .read_svg(IconSet::Lucide, "house")
        .expect("bundled icon is present");
    assert!(svg.starts_with("<svg"));

    let destination = std::env::temp_dir().join(format!("feluqa-imagery-{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&destination);
    let relative = catalog
        .install(IconSet::Lucide, "house", &destination)
        .expect("icon is installed");
    assert_eq!(
        relative,
        PathBuf::from("assets/feluqa/icons/lucide/house.svg")
    );
    assert!(destination.join(relative).is_file());
    std::fs::remove_dir_all(destination).expect("temporary icon output is removed");
}

#[test]
fn rejects_path_traversal() {
    let catalog = IconCatalog::bundled();
    assert!(catalog.path(IconSet::Lucide, "../house").is_err());
}
