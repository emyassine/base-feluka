# Test and release a module

## Test the module in layers

- Keep focused unit tests beside the implementation when they need private
  details.
- Put cross-resource, cross-service and HTTP integration tests under `tests/`.
- For binary products that need private application state, put fixtures under
  `tests/support/` and include them only for tests.
- Test both allowed and denied access, including CSRF, tenant isolation,
  record ownership and field grants.
- Run the repository's formatting, locked workspace checks, Clippy and tests
  before claiming a change is verified.

## Treat packaging as incomplete

Feluqa's current development products statically compose Rust modules. An
installable artifact format, compatibility resolver, signature verification,
domain license enforcement, staged activation, upgrade/recovery and safe
uninstall/data-retention flow have not been completed. Do not publish a crate
or compiled library as a supported runtime-installable module until that
lifecycle and its security tests exist.

See [the enterprise delivery plan](../../_todo/enterprise-delivery.en.md) and
[visual panel QA procedure](../reference/testing/panel-visual-qa.en.md).
