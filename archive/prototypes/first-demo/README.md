# Webkernel Rust HTTP probe

A tiny dependency-free HTTP service for checking that a Rust binary can run behind the Hestia-hosted domain. This is a deployment probe, not a Rust port of Webkernel.

## Build

Build on Linux x86_64:

```sh
cargo build --release --target x86_64-unknown-linux-gnu
```

The binary is `target/x86_64-unknown-linux-gnu/release/webkernel-rust-probe`. It is dynamically linked to the GNU C library, so the Hestia server must be x86_64 Linux and have a compatible glibc. Check on the server with `uname -m` and `ldd --version`.

## Run locally

```sh
./target/x86_64-unknown-linux-gnu/release/webkernel-rust-probe
```

It binds to `127.0.0.1:3000` by default. Override this with `BIND_ADDR`, for example:

```sh
BIND_ADDR=127.0.0.1:38127 ./webkernel-rust-probe
```

Routes: `/` returns a small HTML page, `/healthz` returns JSON, and unknown paths return 404. `GET` and `HEAD` are supported.

## Hestia deployment outline

1. Check the server architecture and glibc version (`uname -m`, `ldd --version`).
2. Upload the binary to a private directory outside `public_html`, such as `~/web/demo.webkernelphp.com/rust/`, then `chmod 755 webkernel-rust-probe`.
3. Start it as the domain user with `BIND_ADDR=127.0.0.1:38127 nohup ./webkernel-rust-probe >server.log 2>&1 &` and confirm it with `curl http://127.0.0.1:38127/healthz`.
4. Configure the domain's Nginx frontend to proxy requests to `http://127.0.0.1:38127`. Hestia's standard PHP-FPM backend setting does not do this by itself; adding a custom Nginx proxy template generally requires the Hestia administrator. Keep the Rust listener on loopback and serve public HTTP/HTTPS through Nginx.

For a persistent production service, use a systemd unit or a process supervisor rather than `nohup`. A user-level Hestia account may not have permission to install a system service or change the Nginx template; ask the server administrator to configure those parts.
