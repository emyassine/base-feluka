#![no_implicit_prelude]
#![cfg(feature = "compiler")]
#![forbid(unsafe_code)]

extern crate feluqa_view;
extern crate std;

use feluqa_view::compiler::Compiler;
use std::assert;
use std::assert_eq;
use std::boxed::Box;
use std::convert::From;
use std::env;
use std::error::Error;
use std::format;
use std::fs;
use std::io;
use std::iter::Iterator;
use std::ops::Drop;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::result::Result::{self, Ok};
use std::string::String;
use std::sync::atomic::{AtomicU64, Ordering};

type TestResult = Result<(), Box<dyn Error>>;
struct Directory(PathBuf);
impl Directory {
    fn new() -> Result<Self, io::Error> {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        let path = env::temp_dir().join(format!(
            "feluqa-view-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::create_dir(&path)?;
        Ok(Self(path))
    }
}
impl Drop for Directory {
    fn drop(&mut self) {
        let _cleanup = fs::remove_dir_all(&self.0);
    }
}
fn compiler() -> Result<Compiler, Box<dyn Error>> {
    let mut compiler = Compiler::new();
    compiler.runtime_path("::feluqa_view")?;
    Ok(compiler)
}
fn add(compiler: &mut Compiler, name: &str, source: &str, parameters: &str) -> TestResult {
    compiler.register(
        name,
        Path::new(&format!("{name}.view.rs")),
        source,
        parameters,
    )?;
    Ok(())
}
fn compile(
    directory: &Directory,
    generated: &str,
    main: &str,
    release: bool,
) -> Result<Output, Box<dyn Error>> {
    let rustc = env::var_os("RUSTC").unwrap_or_else(|| std::ffi::OsString::from("rustc"));
    let runtime = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/lib.rs");
    let result = Command::new(&rustc)
        .arg("--edition=2024")
        .arg("--crate-type=rlib")
        .arg("--crate-name=feluqa_view")
        .arg(runtime)
        .arg("--out-dir")
        .arg(&directory.0)
        .output()?;
    assert!(
        result.status.success(),
        "runtime failed: {}",
        String::from_utf8_lossy(&result.stderr)
    );
    let source = format!(
        "#![no_implicit_prelude]\n#![forbid(unsafe_code)]\nextern crate std;\nextern crate feluqa_view;\n{generated}\nfn main() {{ {main} }}"
    );
    fs::write(directory.0.join("fixture.rs"), source)?;
    let mut command = Command::new(rustc);
    command
        .arg("--edition=2024")
        .arg("-Dwarnings")
        .arg(directory.0.join("fixture.rs"))
        .arg("--extern")
        .arg(format!(
            "feluqa_view={}",
            directory.0.join("libfeluqa_view.rlib").display()
        ))
        .arg("-o")
        .arg(directory.0.join("fixture"));
    if release {
        command.arg("-O");
    }
    Ok(command.output()?)
}
fn render(compiler: &Compiler, main: &str, release: bool) -> Result<String, Box<dyn Error>> {
    let directory = Directory::new()?;
    let generated = compiler.generate()?;
    let output = compile(&directory, &generated.rust, main, release)?;
    assert!(
        output.status.success(),
        "generated Rust failed: {}\n{}",
        String::from_utf8_lossy(&output.stderr),
        generated.rust
    );
    let output = Command::new(directory.0.join("fixture")).output()?;
    assert!(
        output.status.success(),
        "render failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );
    Ok(String::from_utf8(output.stdout)?)
}

#[test]
fn native_layout_include_components_slots_and_control_flow() -> TestResult {
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::layout",
        "<main>@yield(\"body\")</main>",
        "items: &[&str]",
    )?;
    add(
        &mut compiler,
        "app::card",
        "<article><h2>{{ title }}</h2>@yield(\"default\")<aside>@yield(\"actions\")</aside></article>",
        "title: &str",
    )?;
    compiler.component("ui::card", "app::card", &["default", "actions"])?;
    add(
        &mut compiler,
        "app::partial",
        "<em>{{ value }}</em>",
        "value: &str",
    )?;
    add(
        &mut compiler,
        "app::home",
        r##"@extends("app::layout")@section("body")@rs
let prefix = r#"@endrs }}"#;
/* @endrs /* nested }} */ */
@endrs{{ prefix }}@if (items.is_empty())empty@elseif (items.len() == 99)many@else@foreach (item in items)<x-ui::card :title="item"><x-slot name="actions">{{ item }}</x-slot>@include("app::partial", value = item)</x-ui::card>@endforeach@endif@endsection"##,
        "items: &[&str]",
    )?;
    compiler.entry("render", "app::home")?;
    let main = "std::print!(\"{}\", render(&[\"<&\", \"Ω\"]).expect(\"render\"));";
    let expected = "<main>@endrs }}<article><h2>&lt;&amp;</h2><em>&lt;&amp;</em><aside>&lt;&amp;</aside></article><article><h2>Ω</h2><em>Ω</em><aside>Ω</aside></article></main>";
    assert_eq!(render(&compiler, main, false)?, expected);
    assert_eq!(render(&compiler, main, true)?, expected);
    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}\", render(&[]).expect(\"render\"));",
            false
        )?,
        "<main>@endrs }}empty</main>"
    );
    Ok(())
}

#[test]
fn webkernel_ported_navigation_patterns_compile_as_rust_views() -> TestResult {
    assert!(feluqa_view::SafeUrl::new("/welcome").is_ok());
    assert!(feluqa_view::SafeUrl::new("https://numerimondes.com/about").is_ok());
    assert!(feluqa_view::SafeUrl::new("javascript:alert(1)").is_err());
    assert!(feluqa_view::SafeUrl::new("//untrusted.example").is_err());

    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::navigation_item",
        r#"<a class="nav @if (current == "home")active@elseif (current == "docs")docs@endif" href="{{ href }}">{{ label }}</a>"#,
        "current: &str, href: &feluqa_view::SafeUrl, label: &str",
    )?;
    compiler.entry("render", "app::navigation_item")?;

    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}|{}\", render(\"home\", &feluqa_view::SafeUrl::new(\"/\").expect(\"safe URL\"), \"Home <&\").expect(\"home\"), render(\"docs\", &feluqa_view::SafeUrl::new(\"/docs\").expect(\"safe URL\"), \"Docs\").expect(\"docs\"));",
            false,
        )?,
        "<a class=\"nav active\" href=\"/\">Home &lt;&amp;</a>|<a class=\"nav docs\" href=\"/docs\">Docs</a>",
    );
    Ok(())
}

#[test]
fn missing_props_and_slots_are_source_errors() -> TestResult {
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::card",
        "{{ title }}@yield(\"default\")",
        "title: &str",
    )?;
    compiler.component("ui::card", "app::card", &["default"])?;
    add(&mut compiler, "app::home", "hello\n<x-ui::card />", "")?;
    compiler.entry("render", "app::home")?;
    let error = compiler.generate().err().expect("must reject missing prop");
    assert_eq!(error.line, 2);
    assert_eq!(error.column, 1);
    assert!(error.message.contains("title"));
    compiler.default_prop("app::card", "title", "\"Default\"")?;
    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}\", render().expect(\"render\"));",
            false
        )?,
        "hello\nDefault"
    );
    Ok(())
}

#[test]
fn type_errors_and_untrusted_raw_html_fail_rust_compilation() -> TestResult {
    for source in ["{!! text !!}", "@include(\"app::partial\", value = 42)"] {
        let mut compiler = compiler()?;
        add(&mut compiler, "app::partial", "{{ value }}", "value: &str")?;
        add(&mut compiler, "app::home", source, "text: &str")?;
        compiler.entry("render", "app::home")?;
        let directory = Directory::new()?;
        let output = compile(
            &directory,
            &compiler.generate()?.rust,
            "let _ = render(\"unsafe\");",
            false,
        )?;
        assert!(!output.status.success());
        assert!(String::from_utf8_lossy(&output.stderr).contains("mismatched types"));
    }
    Ok(())
}

#[test]
fn includes_do_not_capture_parent_locals() -> TestResult {
    let mut compiler = compiler()?;
    add(&mut compiler, "app::partial", "{{ secret }}", "")?;
    add(
        &mut compiler,
        "app::home",
        "@rs let secret = \"private\"; @endrs{{ secret }}@include(\"app::partial\")",
        "",
    )?;
    compiler.entry("render", "app::home")?;
    let output = compile(
        &Directory::new()?,
        &compiler.generate()?.rust,
        "let _ = render();",
        false,
    )?;
    assert!(!output.status.success());
    assert!(String::from_utf8_lossy(&output.stderr).contains("cannot find value `secret`"));
    Ok(())
}

#[test]
fn trusted_html_and_escaped_display_have_distinct_types() -> TestResult {
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::home",
        "{{ text }}{!! html !!}",
        "text: &str, html: &::feluqa_view::TrustedHtml",
    )?;
    compiler.entry("render", "app::home")?;
    assert_eq!(
        render(
            &compiler,
            "use std::convert::From; let html = feluqa_view::TrustedHtml::from_trusted(std::string::String::from(\"<b>safe</b>\")); std::print!(\"{}\", render(\"<&\\\"'\", &html).expect(\"render\"));",
            false
        )?,
        "&lt;&amp;&quot;&#39;<b>safe</b>"
    );
    Ok(())
}

#[test]
fn url_attributes_require_validated_safe_url_values() -> TestResult {
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::home",
        r#"<a href="{{ url }}">visit</a>"#,
        "url: &str",
    )?;
    compiler.entry("render", "app::home")?;
    let output = compile(
        &Directory::new()?,
        &compiler.generate()?.rust,
        "let _ = render(\"javascript:alert(1)\");",
        false,
    )?;
    assert!(!output.status.success());
    assert!(String::from_utf8_lossy(&output.stderr).contains("SafeUrl"));
    Ok(())
}

#[test]
fn delimiter_scanner_handles_unicode_lifetimes_chars_and_nested_groups() -> TestResult {
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::home",
        r###"@rs
let text: &'static str = r##"@endrs ) }}"##;
let ch = '\'';
let nested = { let x = "}}"; x };
@endrs{{ text }}{{ ch }}{{ nested }}{{ "Ω}}" }}{{-- hidden --}}@@media"###,
        "",
    )?;
    compiler.entry("render", "app::home")?;
    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}\", render().expect(\"render\"));",
            false
        )?,
        "@endrs ) }}&#39;}}Ω}}@media"
    );
    Ok(())
}

#[test]
fn malformed_blocks_and_unsafe_contexts_fail_early() -> TestResult {
    for source in [
        "@if (true)x",
        "@else",
        "@rs let x = r#\"@endrs",
        "{{ (1] }}",
        "<script>{{ user }}</script>",
        "<STYLE>{{ color }}</STYLE>",
        "<div onclick=\"{{ code }}\">",
        "<div {!! html !!}>",
        "<x-ui::card></x-other>",
        "@php bad @endphp",
    ] {
        let mut compiler = compiler()?;
        assert!(
            compiler
                .register("app::bad", Path::new("bad.view.rs"), source, "")
                .is_err(),
            "accepted {source}"
        );
    }
    Ok(())
}

#[test]
fn dependency_cycles_and_missing_views_fail() -> TestResult {
    let mut compiler = compiler()?;
    add(&mut compiler, "app::a", "@include(\"app::b\")", "")?;
    compiler.entry("render", "app::a")?;
    assert!(
        compiler
            .generate()
            .err()
            .expect("missing")
            .message
            .contains("unresolved")
    );
    add(&mut compiler, "app::b", "@include(\"app::a\")", "")?;
    assert!(
        compiler
            .generate()
            .err()
            .expect("cycle")
            .message
            .contains("cycle")
    );
    Ok(())
}

#[test]
fn recursive_roots_are_deterministic_and_maps_are_written() -> TestResult {
    let directory = Directory::new()?;
    fs::create_dir(directory.0.join("pages"))?;
    fs::write(directory.0.join("pages/home.view.rs"), "héllo\n{{ title }}")?;
    fs::write(directory.0.join("ignored.view"), "old")?;
    let mut compiler = compiler()?;
    compiler.add_root("app", &directory.0)?;
    compiler.parameters("app::pages.home", "title: &str")?;
    compiler.entry("home", "app::pages.home")?;
    let generated = compiler.generate()?;
    assert_eq!(generated.rust, compiler.generate()?.rust);
    assert!(generated.dependencies.contains(&directory.0.join("pages")));
    assert!(
        generated
            .source_map
            .iter()
            .any(|item| item.line == 2 && item.column == 1)
    );
    generated.write_to(&directory.0.join("views.rs"))?;
    assert_eq!(
        fs::read_to_string(directory.0.join("views.rs"))?,
        generated.rust
    );
    assert!(directory.0.join("views.rs.map").is_file());
    Ok(())
}

#[cfg(unix)]
#[test]
fn declared_roots_reject_symlinks() -> TestResult {
    let root = Directory::new()?;
    let outside = Directory::new()?;
    fs::write(outside.0.join("secret.view.rs"), "secret")?;
    std::os::unix::fs::symlink(
        outside.0.join("secret.view.rs"),
        root.0.join("link.view.rs"),
    )?;
    assert!(compiler()?.add_root("app", &root.0).is_err());
    Ok(())
}

#[test]
fn attribute_context_tracks_quotes_instead_of_angle_bracket_searches() -> TestResult {
    for source in [r#"<div title="{!! html !!}">"#, "<!-- {{ comment }} -->"] {
        assert!(
            compiler()?
                .register("app::bad", Path::new("bad.view.rs"), source, "")
                .is_err()
        );
    }
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::home",
        r#"<a data-note="<" title=">" href="{{ url }}">{{ label }}</a>"#,
        "url: &feluqa_view::SafeUrl, label: &str",
    )?;
    compiler.entry("render", "app::home")?;
    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}\", render(&feluqa_view::SafeUrl::new(\"/welcome\").expect(\"URL\"), \"<&\").expect(\"render\"));",
            false
        )?,
        "<a data-note=\"<\" title=\">\" href=\"/welcome\">&lt;&amp;</a>"
    );
    add(
        &mut compiler,
        "app::ordinary_attribute",
        r#"<div title="{{ text }}">mail@if.example</div>"#,
        "text: &str",
    )?;
    compiler.entry("render_text", "app::ordinary_attribute")?;
    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}\", render_text(\"\\\" ><&\").expect(\"render\"));",
            false,
        )?,
        "<div title=\"&quot; &gt;&lt;&amp;\">mail@if.example</div>"
    );
    Ok(())
}

#[test]
fn components_reject_unknown_duplicate_props_and_slots() -> TestResult {
    for source in [
        "<x-ui::card bad=\"value\" />",
        "<x-ui::card title=\"a\" title=\"b\" />",
        "<x-ui::card><x-slot name=\"unknown\">x</x-slot></x-ui::card>",
        "<x-ui::card><x-slot name=\"actions\">x</x-slot><x-slot name=\"actions\">y</x-slot></x-ui::card>",
        "<x-slot name=\"actions\">orphan</x-slot>",
    ] {
        let mut compiler = compiler()?;
        add(&mut compiler, "app::card", "@yield(\"actions\")", "")?;
        compiler.component("ui::card", "app::card", &["actions"])?;
        add(&mut compiler, "app::home", source, "")?;
        compiler.entry("render", "app::home")?;
        assert!(compiler.generate().is_err(), "accepted {source}");
    }
    Ok(())
}

#[test]
fn nested_components_keep_slots_in_the_callers_scope() -> TestResult {
    let mut compiler = compiler()?;
    add(
        &mut compiler,
        "app::card",
        "<b>{{ title }}</b>@yield(\"default\")",
        "title: &str",
    )?;
    compiler.component("ui::card", "app::card", &["default"])?;
    add(
        &mut compiler,
        "app::home",
        r#"@rs let title = "parent"; @endrs<x-ui::card title="outer"><x-ui::card title="inner">{{ title }}</x-ui::card></x-ui::card>"#,
        "",
    )?;
    compiler.entry("render", "app::home")?;
    assert_eq!(
        render(
            &compiler,
            "std::print!(\"{}\", render().expect(\"render\"));",
            false
        )?,
        "<b>outer</b><b>inner</b>parent"
    );
    Ok(())
}
