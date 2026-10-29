---
icon: "shield-check"
title: "What Rust Does—and Does Not—Protect"
description: "Understand Rust's memory-safety guarantees and the application security risks that still need engineering controls."
date: 2026-10-29
lastmod: 2026-10-29
weight: 4
status: "Exploring"
tags: [feluqa, security, rust, memory-safety]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# What Rust Does—and Does Not—Protect

Rust's ownership, borrowing, and type systems prevent many memory-safety
errors in safe Rust. That is a major security benefit, but it does **not** make
an application automatically secure. Application logic, configuration,
dependencies, unsafe code, and the way the program handles untrusted input
still matter.

## Memory-safety errors that safe Rust helps prevent

Safe Rust's compile-time rules make many common memory-corruption errors
unrepresentable in safe code, including:

- use-after-free, dangling references, and double frees;
- out-of-bounds memory access through ordinary safe indexing (an invalid index
  can panic, but safe indexing does not become an unchecked memory write);
- null references: Rust references cannot be null, and `Option<T>` represents
  an optional value explicitly;
- data races in safe concurrent code.

These guarantees depend on the soundness of unsafe code, foreign-function
interfaces (FFI), and the libraries the application uses. The Rust compiler
does not verify that an unsafe abstraction or an external library is sound.

## Security risks Rust does not remove

### Injection

Rust does not prevent untrusted data from being interpreted as SQL, a shell
command, a directory path, or another language. Building a query by inserting
input into a string is dangerous if the resulting string is executed as SQL:

```rust
let query = format!(
    "SELECT id FROM users WHERE name = '{username}'"
);
```

Use a parameterized query API, and validate input for the application's
business rules. Apply the same principle to operating-system commands: prefer
APIs that avoid a shell and pass validated arguments separately.

### Authentication and authorization

Logging a person in does not authorize every action they can reach. Check
permissions and resource ownership on the server for each protected operation;
do not rely on hidden buttons or client-side role checks.

```rust
if user.is_authenticated() {
    // Authentication alone does not authorize this operation.
    delete_all_records();
}
```

Password reset, session management, role changes, and tenant boundaries also
need explicit design and review. See the [authorization model](01-authorization-model.en.md).

### Cryptography and secrets

Rust does not choose sound cryptographic protocols or protect secrets that
developers hard-code, log, or expose to clients. Use maintained cryptographic
libraries, established protocols, appropriate random sources, and approved
secret storage. Do not implement cryptographic primitives yourself.

### Cross-site scripting (XSS) and request forgery (CSRF)

Web applications still need context-appropriate output escaping and safe
handling of URLs and raw HTML. A formatting operation such as
`format!("<div>{input}</div>")` does not escape HTML. State-changing browser
requests also need CSRF defenses appropriate to the application's session and
request model.

### Server-side request forgery (SSRF)

If a server fetches a URL influenced by a user, it may be tricked into
contacting internal services or other protected network addresses. Validate
and allowlist destinations where possible, control redirects, and apply
network-level restrictions as a second layer.

### Denial of service and resource exhaustion

Memory safety is not resource safety. An attacker may send oversized requests,
trigger expensive work, create excessive concurrency, or cause repeated
allocation. Set limits for request bodies, time, concurrency, memory, and other
resources that matter to the application. A panic caused by untrusted input may
also disrupt a task or process, depending on how the application handles
panics.

### Deserialization and validation

Parsing untrusted input into a Rust type does not prove that its values are
valid for the business operation. Bound input size and nesting where relevant,
validate invariants after parsing, and authorize the requested action. Data
formats and deserializers have different security properties; select and
configure them deliberately.

### Unsafe Rust, FFI, and dependencies

`unsafe` blocks and FFI boundaries carry obligations that the compiler cannot
prove. Keep them small, document their safety invariants, and review them
carefully. Safe code can also depend on an unsound library. Review dependency
ownership, maintenance, features, and known vulnerabilities; pin and audit the
dependency graph according to the project's supply-chain policy.

### Business logic and logical races

Rust's data-race guarantees do not prove that a business operation is correct
under concurrent requests. Duplicate transfers, replayed actions, skipped
approval steps, and race conditions between checking and changing a record
remain possible. Use transactions, idempotency controls, server-side policy
checks, and tests that reflect the application's rules.

## A useful mental model

Rust helps protect memory integrity and prevents data races in safe concurrent
code. It does not by itself provide authentication, authorization, correct
business rules, injection defenses, secure cryptography, safe configuration,
supply-chain integrity, or availability under attack. Treat these as separate
security requirements and verify them at application and deployment level.

## Further reading

- [Rust Reference: behavior considered undefined](https://doc.rust-lang.org/reference/behavior-considered-undefined.html)
- [Rust Reference: unsafety](https://doc.rust-lang.org/reference/unsafety.html)
- [OWASP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Cross-Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Denial of Service Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html)
- [OWASP Deserialization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html)
