package rules

import "strings"

type record struct {
	OwnerID string `json:"owner_id"`
	Status  string `json:"status"`
}

type Request struct {
	AuthID, BodyOwnerID *string
	Superuser           bool
}
type Rule struct {
	Kind   string
	Filter *string
}
type Action string

const (
	List   Action = "list"
	View   Action = "view"
	Create Action = "create"
	Update Action = "update"
	Delete Action = "delete"
)

type tokenKind uint8

const (
	tWord tokenKind = iota
	tString
	tEq
	tNe
	tAnd
	tOr
	tLeft
	tRight
)

type token struct {
	kind tokenKind
	text string
}

func Allows(rule Rule, _ Action, request Request, item *record) bool {
	if request.Superuser {
		return true
	}
	switch rule.Kind {
	case "locked":
		return false
	case "public":
		return true
	case "filter":
		if rule.Filter == nil {
			return false
		}
		tokens, ok := tokenize(*rule.Filter)
		if !ok {
			return false
		}
		p := parser{tokens: tokens}
		value, ok := p.parseOr(request, item)
		return ok && p.at == len(p.tokens) && value
	default:
		return false
	}
}

func StatusFor(rule Rule, action Action, allowed bool) int {
	if allowed {
		if action == Delete {
			return 204
		}
		return 200
	}
	if rule.Kind == "locked" {
		return 403
	}
	switch action {
	case List:
		return 200
	case Create:
		return 400
	default:
		return 404
	}
}

func ListCount(rule Rule, request Request, records []record) int {
	count := 0
	for i := range records {
		if Allows(rule, List, request, &records[i]) {
			count++
		}
	}
	return count
}

func tokenize(source string) ([]token, bool) {
	var out []token
	for i := 0; i < len(source); {
		if source[i] <= ' ' {
			i++
			continue
		}
		switch source[i] {
		case '(':
			out = append(out, token{kind: tLeft})
			i++
		case ')':
			out = append(out, token{kind: tRight})
			i++
		case '=':
			out = append(out, token{kind: tEq})
			i++
		case '!':
			if i+1 >= len(source) || source[i+1] != '=' {
				return nil, false
			}
			out = append(out, token{kind: tNe})
			i += 2
		case '&':
			if i+1 >= len(source) || source[i+1] != '&' {
				return nil, false
			}
			out = append(out, token{kind: tAnd})
			i += 2
		case '|':
			if i+1 >= len(source) || source[i+1] != '|' {
				return nil, false
			}
			out = append(out, token{kind: tOr})
			i += 2
		case '\'', '"':
			q := source[i]
			start := i + 1
			i = start
			for i < len(source) && source[i] != q {
				i++
			}
			if i == len(source) {
				return nil, false
			}
			out = append(out, token{kind: tString, text: source[start:i]})
			i++
		default:
			start := i
			for i < len(source) && source[i] > ' ' && !strings.ContainsRune("()=!&|'\"", rune(source[i])) {
				i++
			}
			if start == i {
				return nil, false
			}
			out = append(out, token{kind: tWord, text: source[start:i]})
		}
	}
	return out, true
}

type parser struct {
	tokens []token
	at     int
}

func (p *parser) parseOr(req Request, item *record) (bool, bool) {
	v, ok := p.parseAnd(req, item)
	if !ok {
		return false, false
	}
	for p.take(tOr) {
		r, ok := p.parseAnd(req, item)
		if !ok {
			return false, false
		}
		v = v || r
	}
	return v, true
}
func (p *parser) parseAnd(req Request, item *record) (bool, bool) {
	v, ok := p.parsePrimary(req, item)
	if !ok {
		return false, false
	}
	for p.take(tAnd) {
		r, ok := p.parsePrimary(req, item)
		if !ok {
			return false, false
		}
		v = v && r
	}
	return v, true
}
func (p *parser) parsePrimary(req Request, item *record) (bool, bool) {
	if p.take(tLeft) {
		v, ok := p.parseOr(req, item)
		if !ok || !p.take(tRight) {
			return false, false
		}
		return v, true
	}
	l, ok := p.value(req, item)
	if !ok || p.at >= len(p.tokens) {
		return false, false
	}
	op := p.tokens[p.at].kind
	p.at++
	r, ok := p.value(req, item)
	if !ok {
		return false, false
	}
	switch op {
	case tEq:
		return equal(l, r), true
	case tNe:
		return !equal(l, r), true
	default:
		return false, false
	}
}
func (p *parser) value(req Request, item *record) (*string, bool) {
	if p.at >= len(p.tokens) {
		return nil, false
	}
	t := p.tokens[p.at]
	p.at++
	if t.kind == tString {
		v := t.text
		return &v, true
	}
	if t.kind != tWord {
		return nil, false
	}
	switch t.text {
	case "@request.auth.id":
		if req.AuthID == nil {
			v := ""
			return &v, true
		}
		return req.AuthID, true
	case "@request.body.owner_id":
		return req.BodyOwnerID, true
	case "owner_id":
		if item == nil {
			return nil, true
		}
		return &item.OwnerID, true
	case "status":
		if item == nil {
			return nil, true
		}
		return &item.Status, true
	default:
		return nil, false
	}
}
func equal(a, b *string) bool {
	if a == nil {
		return b == nil
	}
	return b != nil && *a == *b
}
func (p *parser) take(k tokenKind) bool {
	if p.at < len(p.tokens) && p.tokens[p.at].kind == k {
		p.at++
		return true
	}
	return false
}
