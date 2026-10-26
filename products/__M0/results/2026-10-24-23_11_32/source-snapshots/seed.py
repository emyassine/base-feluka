#!/usr/bin/env python3
"""Create deterministic, approximately one-million-row M0 SQLite dataset."""
import os
import sqlite3
import sys


def main() -> None:
    path = sys.argv[1] if len(sys.argv) > 1 else "./data/orders.sqlite"
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    if os.path.exists(path):
        os.remove(path)
    db = sqlite3.connect(path)
    db.executescript("""
        PRAGMA journal_mode = OFF;
        PRAGMA synchronous = OFF;
        PRAGMA temp_store = MEMORY;
        CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL);
        CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, created_at TEXT NOT NULL);
        CREATE TABLE line_items (
            id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL, position INTEGER NOT NULL,
            product_name TEXT NOT NULL, quantity INTEGER NOT NULL, unit_price_cents INTEGER NOT NULL
        );
        CREATE INDEX idx_orders_customer ON orders(customer_id, id);
        CREATE INDEX idx_line_items_order ON line_items(order_id, position);
    """)
    db.executemany(
        "INSERT INTO customers VALUES (?, ?, ?)",
        ((i, f"Customer {i:05d}", f"customer{i:05d}@example.test") for i in range(1, 10_001)),
    )
    orders = []
    items = []
    for order_id in range(1, 40_001):
        customer_id = ((order_id - 1) % 10_000) + 1
        orders.append((order_id, customer_id, "2026-10-24T12:00:00Z"))
        for position in range(1, 21):
            items.append((None, order_id, position, f"Product {((order_id + position) % 500) + 1:03d}", (position % 4) + 1, 1250 + position * 37))
        if order_id % 1000 == 0:
            db.executemany("INSERT INTO orders VALUES (?, ?, ?)", orders)
            db.executemany("INSERT INTO line_items VALUES (?, ?, ?, ?, ?, ?)", items)
            orders.clear()
            items.clear()
            print(f"seeded {order_id:,} orders", flush=True)
    if orders:
        db.executemany("INSERT INTO orders VALUES (?, ?, ?)", orders)
        db.executemany("INSERT INTO line_items VALUES (?, ?, ?, ?, ?, ?)", items)
    db.commit()
    counts = {table: db.execute(f"SELECT count(*) FROM {table}").fetchone()[0] for table in ("customers", "orders", "line_items")}
    db.close()
    print(f"created {path}: {counts}, total={sum(counts.values()):,}")


if __name__ == "__main__":
    main()
