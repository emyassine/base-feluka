package rules

import (
	"encoding/json"
	"os"
	"testing"
)

type suiteFile struct {
	Records []record `json:"records"`
	Cases   []vector `json:"cases"`
}

type referenceFile struct {
	Cases []referenceCase `json:"cases"`
}

type referenceCase struct {
	Name   string `json:"name"`
	Status int    `json:"status"`
	Items  *int   `json:"items"`
}

type vector struct {
	Name        string  `json:"name"`
	RuleKind    string  `json:"rule"`
	Filter      *string `json:"filter"`
	Action      string  `json:"action"`
	AuthID      *string `json:"auth_id"`
	BodyOwnerID *string `json:"body_owner_id"`
	Superuser   bool    `json:"superuser"`
	Record      *record `json:"record"`
	Allowed     *bool   `json:"allowed"`
	Status      int     `json:"status"`
	ListCount   *int    `json:"list_count"`
}

func TestPocketBaseRESTCases(t *testing.T) {
	data, err := os.ReadFile("../vectors.json")
	if err != nil {
		t.Fatal(err)
	}
	var suite suiteFile
	if err := json.Unmarshal(data, &suite); err != nil {
		t.Fatal(err)
	}
	referencePath := os.Getenv("M0_POCKETBASE_REFERENCE")
	if referencePath == "" {
		referencePath = "../../../results/2026-10-24-23_11_32/pocketbase-reference.json"
	}
	referenceBytes, err := os.ReadFile(referencePath)
	if err != nil {
		t.Fatal(err)
	}
	var reference referenceFile
	if err := json.Unmarshal(referenceBytes, &reference); err != nil {
		t.Fatal(err)
	}
	if len(suite.Cases) != len(reference.Cases) {
		t.Fatalf("vectors=%d captured=%d", len(suite.Cases), len(reference.Cases))
	}
	for _, test := range suite.Cases {
		t.Run(test.Name, func(t *testing.T) {
			var captured *referenceCase
			for i := range reference.Cases {
				if reference.Cases[i].Name == test.Name {
					captured = &reference.Cases[i]
					break
				}
			}
			if captured == nil {
				t.Fatalf("missing PocketBase REST case %q", test.Name)
			}
			if test.Status != captured.Status {
				t.Fatalf("status vector=%d PocketBase=%d", test.Status, captured.Status)
			}
			if (test.ListCount == nil) != (captured.Items == nil) || (test.ListCount != nil && *test.ListCount != *captured.Items) {
				t.Fatalf("list count vector=%v PocketBase=%v", test.ListCount, captured.Items)
			}
			rule := Rule{Kind: test.RuleKind, Filter: test.Filter}
			action := Action(test.Action)
			request := Request{AuthID: test.AuthID, BodyOwnerID: test.BodyOwnerID, Superuser: test.Superuser}
			if test.Allowed != nil && Allows(rule, action, request, test.Record) != *test.Allowed {
				t.Fatalf("Allows() = %v, want %v", Allows(rule, action, request, test.Record), *test.Allowed)
			}
			if got := StatusFor(rule, action, test.Allowed != nil && *test.Allowed); got != test.Status {
				t.Fatalf("StatusFor() = %d, want %d", got, test.Status)
			}
			if test.ListCount != nil {
				records := append([]record(nil), suite.Records...)
				if test.Name == "superuser_list_bypasses_rule" {
					records = append(records, record{OwnerID: "alice", Status: "active"})
				}
				if got := ListCount(rule, request, records); got != *test.ListCount {
					t.Fatalf("ListCount() = %d, want %d", got, *test.ListCount)
				}
			}
		})
	}
}

func TestPrecedenceParenthesesAndMalformedFiltersFailClosed(t *testing.T) {
	auth := "alice"
	request := Request{AuthID: &auth}
	active := &record{OwnerID: "bob", Status: "active"}
	precedence := `status = "active" || owner_id = @request.auth.id && @request.auth.id != ""`
	if !Allows(Rule{Kind: "filter", Filter: &precedence}, View, request, active) {
		t.Fatal("&& must bind more tightly than ||")
	}
	grouped := `(status = "draft" || owner_id = @request.auth.id) && @request.auth.id != ""`
	if Allows(Rule{Kind: "filter", Filter: &grouped}, View, request, active) {
		t.Fatal("parentheses must override the default precedence")
	}
	for _, malformed := range []string{`unknown = "x"`, `status = "active" &&`, `status = "active`} {
		if Allows(Rule{Kind: "filter", Filter: &malformed}, View, request, active) {
			t.Fatalf("malformed or unknown filter %q must fail closed", malformed)
		}
	}
}
