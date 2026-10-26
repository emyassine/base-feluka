use std::env;
use std::io::{BufRead, BufReader, Read, Write};
use std::net::{TcpListener, TcpStream};
use std::thread;

const MAX_REQUEST_BYTES: u64 = 16 * 1024;

fn main() -> std::io::Result<()> {
    let address = env::var("BIND_ADDR").unwrap_or_else(|_| "127.0.0.1:3000".to_owned());
    let listener = TcpListener::bind(&address)?;
    eprintln!("webkernel-rust-probe listening on http://{address}");

    for incoming in listener.incoming() {
        match incoming {
            Ok(stream) => {
                thread::spawn(|| {
                    if let Err(error) = handle_connection(stream) {
                        eprintln!("request failed: {error}");
                    }
                });
            }
            Err(error) => eprintln!("connection failed: {error}"),
        }
    }

    Ok(())
}

fn handle_connection(stream: TcpStream) -> std::io::Result<()> {
    let mut request = String::new();
    let mut reader = BufReader::new(stream.try_clone()?);
    let mut bounded_reader = (&mut reader).take(MAX_REQUEST_BYTES);
    bounded_reader.read_line(&mut request)?;

    let mut parts = request.split_whitespace();
    let method = parts.next().unwrap_or("GET");
    let path = parts.next().unwrap_or("/").split('?').next().unwrap_or("/");
    let head_only = method == "HEAD";

    let (status, content_type, body) = match (method, path) {
        ("GET" | "HEAD", "/") => (
            "200 OK",
            "text/html; charset=utf-8",
            "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Webkernel Rust</title><body><main><h1>Rust HTTP service is running</h1><p>This response is served by a standalone Rust binary behind your web server.</p><p><a href=\"/healthz\">Health check</a></p></main></body></html>",
        ),
        ("GET" | "HEAD", "/healthz") => (
            "200 OK",
            "application/json; charset=utf-8",
            "{\"status\":\"ok\",\"runtime\":\"rust\"}",
        ),
        ("GET" | "HEAD", _) => (
            "404 Not Found",
            "application/json; charset=utf-8",
            "{\"error\":\"not_found\"}",
        ),
        _ => (
            "405 Method Not Allowed",
            "application/json; charset=utf-8",
            "{\"error\":\"method_not_allowed\"}",
        ),
    };

    let mut stream = reader.into_inner();
    write!(
        stream,
        "HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nCache-Control: no-store\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\n\r\n",
        body.len()
    )?;
    if !head_only {
        stream.write_all(body.as_bytes())?;
    }
    stream.flush()
}
