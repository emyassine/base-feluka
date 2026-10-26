use axum::{
    Router,
    body::Body,
    extract::{OriginalUri, State},
    http::{HeaderMap, HeaderValue, StatusCode, header},
    response::Response,
    routing::get,
};
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};
use std::{env, path::PathBuf, time::Instant};

#[derive(Clone)]
struct AppState {
    db: SqlitePool,
}

#[derive(Debug)]
struct LineItem {
    name: String,
    qty: i64,
    unit: i64,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let db_path = env::var("M0_DB")
        .map(PathBuf::from)
        .unwrap_or_else(|_| PathBuf::from("data/orders.sqlite"));
    let db_url = format!("sqlite://{}?mode=ro", db_path.canonicalize()?.display());
    let db = SqlitePoolOptions::new()
        .max_connections(1)
        .connect(&db_url)
        .await?;
    let state = AppState { db };

    let app = Router::new()
        .route("/healthz", get(health))
        .route("/orders/{id}", get(order))
        .with_state(state);
    let addr = env::var("M0_ADDR").unwrap_or_else(|_| "127.0.0.1:38101".to_string());
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    eprintln!(
        "Feluka M0 Rust listening on http://{addr}; db={}",
        db_path.display()
    );
    axum::serve(listener, app).await?;
    Ok(())
}

async fn health() -> Response<Body> {
    Response::builder()
        .header(header::CONTENT_TYPE, "application/json; charset=utf-8")
        .body(Body::from(r#"{"status":"ok","runtime":"rust"}"#))
        .expect("constant response is valid")
}

async fn order(
    State(state): State<AppState>,
    uri: OriginalUri,
    headers: HeaderMap,
) -> Response<Body> {
    let started = Instant::now();
    let id = uri.path().rsplit('/').next().unwrap_or_default();
    let (status, body) = serve_order(&state.db, id, &headers).await;
    let mut response = Response::new(Body::from(body));
    *response.status_mut() = status;
    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("text/html; charset=utf-8"),
    );
    response
        .headers_mut()
        .insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
    response.headers_mut().insert(
        "x-content-type-options",
        HeaderValue::from_static("nosniff"),
    );
    let elapsed_ms = started.elapsed().as_secs_f64() * 1000.0;
    if let Ok(value) = HeaderValue::from_str(&format!("app;dur={elapsed_ms:.3}")) {
        response.headers_mut().insert("server-timing", value);
    }
    response
}

async fn serve_order(db: &SqlitePool, raw_id: &str, headers: &HeaderMap) -> (StatusCode, String) {
    let Some((user, raw_scope)) = headers
        .get("x-feluka-session")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.split_once(':'))
    else {
        return (StatusCode::UNAUTHORIZED, "unauthorized".into());
    };
    let Ok(scope) = raw_scope.parse::<i64>() else {
        return (StatusCode::UNAUTHORIZED, "unauthorized".into());
    };
    if user != "reader" || scope < 1 {
        return (StatusCode::UNAUTHORIZED, "unauthorized".into());
    }
    let Ok(id) = raw_id.parse::<i64>() else {
        return (StatusCode::BAD_REQUEST, "bad order id".into());
    };
    if id < 1 {
        return (StatusCode::BAD_REQUEST, "bad order id".into());
    }

    let order = sqlx::query_as::<_, (i64, i64)>(
        "SELECT id, customer_id FROM orders WHERE id = ? AND customer_id <= ?",
    )
    .bind(id)
    .bind(scope)
    .fetch_optional(db)
    .await;
    let (order_id, customer_id) = match order {
        Ok(Some(row)) => row,
        Ok(None) => return (StatusCode::NOT_FOUND, "not found".into()),
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, "database error".into()),
    };

    let rows = sqlx::query_as::<_, (String, i64, i64)>(
        "SELECT product_name, quantity, unit_price_cents FROM line_items WHERE order_id = ? ORDER BY position",
    )
    .bind(id)
    .fetch_all(db)
    .await;
    let items = match rows {
        Ok(rows) => rows
            .into_iter()
            .map(|(name, qty, unit)| LineItem { name, qty, unit })
            .collect::<Vec<_>>(),
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, "database error".into()),
    };

    let customer =
        sqlx::query_as::<_, (String, String)>("SELECT name, email FROM customers WHERE id = ?")
            .bind(customer_id)
            .fetch_one(db)
            .await;
    let (name, email) = match customer {
        Ok(row) => row,
        Err(_) => return (StatusCode::INTERNAL_SERVER_ERROR, "database error".into()),
    };
    (StatusCode::OK, render(order_id, &name, &email, &items))
}

fn render(id: i64, name: &str, email: &str, items: &[LineItem]) -> String {
    let mut html = format!(
        "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Order #{id}</title></head><body><header><a href=\"/\">Feluka</a></header><main><h1>Order #{id}</h1><p>Customer: {name} ({email})</p><table><thead><tr><th>Product</th><th>Quantity</th><th>Total</th></tr></thead><tbody>"
    );
    for item in items {
        let cents = item.unit * item.qty;
        html.push_str(&format!(
            "<tr><td>{}</td><td>{}</td><td>${}.{:02}</td></tr>",
            item.name,
            item.qty,
            cents / 100,
            cents % 100
        ));
    }
    html.push_str(&format!(
        "</tbody></table><footer>Order #{id} · {} items</footer></main></body></html>",
        items.len()
    ));
    html
}
