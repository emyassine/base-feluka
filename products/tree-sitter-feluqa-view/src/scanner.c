#include <tree_sitter/parser.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

enum TokenType { RUST_BLOCK_BODY, RUST_EXPRESSION, RUST_RAW_EXPRESSION, RUST_ATTRIBUTE_EXPRESSION, RUST_CONDITION };
enum { MAX_GROUPS = 512 };

void *tree_sitter_feluqa_view_external_scanner_create(void) { return NULL; }
void tree_sitter_feluqa_view_external_scanner_destroy(void *payload) { (void)payload; }
unsigned tree_sitter_feluqa_view_external_scanner_serialize(void *payload, char *buffer) {
    (void)payload; (void)buffer; return 0;
}
void tree_sitter_feluqa_view_external_scanner_deserialize(void *payload, const char *buffer, unsigned length) {
    (void)payload; (void)buffer; (void)length;
}

static bool scan_marker(TSLexer *lexer, enum TokenType token) {
    const char *value = token == RUST_BLOCK_BODY ? "@endrs" : token == RUST_EXPRESSION ? "}}" : token == RUST_RAW_EXPRESSION ? "!!}" : token == RUST_ATTRIBUTE_EXPRESSION ? "\"" : ")";
    size_t length = strlen(value);
    if (lexer->lookahead != (unsigned char)value[0]) return false;
    lexer->mark_end(lexer);
    for (size_t index = 0; index < length; ++index) {
        if (lexer->lookahead != (unsigned char)value[index]) return false;
        lexer->advance(lexer, false);
    }
    if (token == RUST_BLOCK_BODY && ((lexer->lookahead >= 'a' && lexer->lookahead <= 'z') || (lexer->lookahead >= 'A' && lexer->lookahead <= 'Z') || (lexer->lookahead >= '0' && lexer->lookahead <= '9') || lexer->lookahead == '_')) return false;
    return true;
}

static void advance(TSLexer *lexer, bool skip) { lexer->advance(lexer, skip); }
static bool quoted(TSLexer *lexer, int32_t quote) {
    advance(lexer, false);
    while (!lexer->eof(lexer)) {
        if (lexer->lookahead == '\\') { advance(lexer, false); if (!lexer->eof(lexer)) advance(lexer, false); }
        else if (lexer->lookahead == quote) { advance(lexer, false); return true; }
        else if (quote == '\'' && (lexer->lookahead == '\n' || lexer->lookahead == '\r')) return false;
        else advance(lexer, false);
    }
    return false;
}
static bool comment(TSLexer *lexer) {
    advance(lexer, false); advance(lexer, false); unsigned depth = 1;
    while (!lexer->eof(lexer)) {
        if (lexer->lookahead == '/') {
            advance(lexer, false);
            if (lexer->lookahead == '*') { advance(lexer, false); ++depth; }
        } else if (lexer->lookahead == '*') {
            advance(lexer, false);
            if (lexer->lookahead == '/') { advance(lexer, false); if (--depth == 0) return true; }
        } else advance(lexer, false);
    }
    return false;
}
static bool line_comment(TSLexer *lexer) {
    advance(lexer, false); advance(lexer, false);
    while (!lexer->eof(lexer) && lexer->lookahead != '\n') advance(lexer, false);
    if (!lexer->eof(lexer)) advance(lexer, false);
    return true;
}
static bool raw_string(TSLexer *lexer, unsigned hashes) {
    advance(lexer, false); /* opening quote */
    while (!lexer->eof(lexer)) {
        if (lexer->lookahead == '"') {
            advance(lexer, false); unsigned found = 0;
            while (found < hashes && lexer->lookahead == '#') { advance(lexer, false); ++found; }
            if (found == hashes) return true;
        } else advance(lexer, false);
    }
    return false;
}
static bool rust_opaque(TSLexer *lexer) {
    if (lexer->lookahead == '/') {
        advance(lexer, false);
        if (lexer->lookahead == '/') { lexer->mark_end(lexer); return line_comment(lexer); }
        if (lexer->lookahead == '*') { lexer->mark_end(lexer); return comment(lexer); }
        return false;
    }
    if (lexer->lookahead == '"') { lexer->mark_end(lexer); return quoted(lexer, '"'); }
    if (lexer->lookahead == '\'') {
        /* Lifetimes are not character literals; only skip a quoted scalar/escape. */
        advance(lexer, false);
        if (lexer->lookahead == '\\') { advance(lexer, false); if (!lexer->eof(lexer)) advance(lexer, false); if (lexer->lookahead == '\'') { advance(lexer, false); return true; } return false; }
        if (lexer->lookahead >= 0 && lexer->lookahead < 128) { advance(lexer, false); if (lexer->lookahead == '\'') { advance(lexer, false); return true; } }
        return false;
    }
    /* Raw strings: [b|c]r###" ... "### */
    bool prefix = false;
    if (lexer->lookahead == 'b' || lexer->lookahead == 'c') { advance(lexer, false); prefix = true; }
    if (lexer->lookahead != 'r') { if (prefix) return true; return false; }
    advance(lexer, false); unsigned hashes = 0;
    while (lexer->lookahead == '#' && hashes < 16) { advance(lexer, false); ++hashes; }
    if (lexer->lookahead != '"') return true; /* raw identifier or lifetime-like token */
    lexer->mark_end(lexer);
    return raw_string(lexer, hashes);
}

bool tree_sitter_feluqa_view_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
    (void)payload;
    enum TokenType token;
    if (valid_symbols[RUST_BLOCK_BODY]) token = RUST_BLOCK_BODY;
    else if (valid_symbols[RUST_ATTRIBUTE_EXPRESSION]) token = RUST_ATTRIBUTE_EXPRESSION;
    else if (valid_symbols[RUST_RAW_EXPRESSION]) token = RUST_RAW_EXPRESSION;
    else if (valid_symbols[RUST_EXPRESSION]) token = RUST_EXPRESSION;
    else if (valid_symbols[RUST_CONDITION]) token = RUST_CONDITION;
    else return false;

    bool consumed = false; bool attribute_string = false; int32_t groups[MAX_GROUPS]; size_t group_count = 0;
    while (!lexer->eof(lexer)) {
        if (token == RUST_ATTRIBUTE_EXPRESSION && lexer->lookahead == '\\' && attribute_string) {
            advance(lexer, false);
            if (!lexer->eof(lexer)) advance(lexer, false);
            consumed = true; lexer->mark_end(lexer); continue;
        }
        if (token == RUST_ATTRIBUTE_EXPRESSION && lexer->lookahead == '"' && group_count == 0) {
            if (attribute_string) {
                advance(lexer, false); attribute_string = false;
                consumed = true; lexer->mark_end(lexer); continue;
            }
            lexer->mark_end(lexer); advance(lexer, false);
            if (lexer->eof(lexer) || lexer->lookahead == '>' || lexer->lookahead == '/' || lexer->lookahead == ' ' || lexer->lookahead == '\t' || lexer->lookahead == '\r' || lexer->lookahead == '\n') {
                if (!consumed) return false;
                lexer->result_symbol = token; return true;
            }
            attribute_string = true; consumed = true; lexer->mark_end(lexer); continue;
        }
        if (group_count == 0 && token != RUST_ATTRIBUTE_EXPRESSION && scan_marker(lexer, token)) {
            if (!consumed) return false;
            lexer->result_symbol = token; return true;
        }
        /* Rust comments and literals shield template closing delimiters. */
        int32_t before = lexer->lookahead;
        if (before == '/' || before == '"' || before == '\'' || before == 'r' || before == 'b' || before == 'c') {
            lexer->mark_end(lexer);
            if (rust_opaque(lexer)) { consumed = true; lexer->mark_end(lexer); continue; }
        }
        int32_t character = lexer->lookahead;
        if (character == '(' || character == '[' || character == '{') {
            if (group_count == MAX_GROUPS) return false;
            groups[group_count++] = character == '(' ? ')' : character == '[' ? ']' : '}';
        } else if (character == ')' || character == ']' || character == '}') {
            if (group_count == 0 || groups[group_count - 1] != character) return false;
            --group_count;
        }
        advance(lexer, false); consumed = true; lexer->mark_end(lexer);
    }
    return false;
}
