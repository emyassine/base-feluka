package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type orderPage struct {
	id, customerID int64
	name, email    string
	items          []lineItem
}

type lineItem struct {
	name string
	qty  int64
	unit int64
}

type queries struct {
	order    *sql.Stmt
	items    *sql.Stmt
	customer *sql.Stmt
}

func main() {
	dbPath := os.Getenv("M0_DB")
	if dbPath == "" {
		dbPath = filepath.Join("data", "orders.sqlite")
	}
	db, err := sql.Open("sqlite3", "file:"+dbPath+"?mode=ro&_query_only=1&_busy_timeout=5000")
	if err != nil {
		log.Fatal(err)
	}
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	q := queries{}
	q.order, err = db.Prepare(`SELECT id, customer_id FROM orders WHERE id = ? AND customer_id <= ?`)
	if err != nil {
		log.Fatal(err)
	}
	q.items, err = db.Prepare(`SELECT product_name, quantity, unit_price_cents FROM line_items WHERE order_id = ? ORDER BY position`)
	if err != nil {
		log.Fatal(err)
	}
	q.customer, err = db.Prepare(`SELECT name, email FROM customers WHERE id = ?`)
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		_, _ = w.Write([]byte(`{"status":"ok","runtime":"go"}`))
	})
	mux.HandleFunc("GET /orders/{id}", func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		status, body := serveOrder(r.Context(), q, r)
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("Server-Timing", fmt.Sprintf("app;dur=%.3f", float64(time.Since(started).Nanoseconds())/1e6))
		w.WriteHeader(status)
		_, _ = w.Write(body)
	})

	addr := os.Getenv("M0_ADDR")
	if addr == "" {
		addr = "127.0.0.1:38100"
	}
	log.Printf("Feluka M0 Go listening on http://%s; db=%s", addr, dbPath)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func serveOrder(ctx context.Context, q queries, r *http.Request) (int, []byte) {
	parts := strings.Split(r.Header.Get("X-Feluka-Session"), ":")
	if len(parts) != 2 || parts[0] != "reader" {
		return http.StatusUnauthorized, []byte("unauthorized")
	}
	scope, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil || scope < 1 {
		return http.StatusUnauthorized, []byte("unauthorized")
	}
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id < 1 {
		return http.StatusBadRequest, []byte("bad order id")
	}

	var p orderPage
	err = q.order.QueryRowContext(ctx, id, scope).Scan(&p.id, &p.customerID)
	if err == sql.ErrNoRows {
		return http.StatusNotFound, []byte("not found")
	}
	if err != nil {
		return http.StatusInternalServerError, []byte("database error")
	}

	rows, err := q.items.QueryContext(ctx, id)
	if err != nil {
		return http.StatusInternalServerError, []byte("database error")
	}
	for rows.Next() {
		var item lineItem
		if err := rows.Scan(&item.name, &item.qty, &item.unit); err != nil {
			_ = rows.Close()
			return http.StatusInternalServerError, []byte("database error")
		}
		p.items = append(p.items, item)
	}
	if err := rows.Err(); err != nil {
		_ = rows.Close()
		return http.StatusInternalServerError, []byte("database error")
	}
	_ = rows.Close()
	if err := q.customer.QueryRowContext(ctx, p.customerID).Scan(&p.name, &p.email); err != nil {
		return http.StatusInternalServerError, []byte("database error")
	}
	return http.StatusOK, render(p)
}

func render(p orderPage) []byte {
	var b strings.Builder
	fmt.Fprintf(&b, "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Order #%d</title></head><body><header><a href=\"/\">Feluka</a></header><main><h1>Order #%d</h1><p>Customer: %s (%s)</p><table><thead><tr><th>Product</th><th>Quantity</th><th>Total</th></tr></thead><tbody>", p.id, p.id, p.name, p.email)
	for _, item := range p.items {
		fmt.Fprintf(&b, "<tr><td>%s</td><td>%d</td><td>$%d.%02d</td></tr>", item.name, item.qty, item.unit*item.qty/100, item.unit*item.qty%100)
	}
	fmt.Fprintf(&b, "</tbody></table><footer>Order #%d · %d items</footer></main></body></html>", p.id, len(p.items))
	return []byte(b.String())
}
