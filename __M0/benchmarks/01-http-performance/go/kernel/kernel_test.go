package kernel

import "testing"

func TestCanRead(t *testing.T) {
	tests := []struct {
		name          string
		record        RecordScope
		userID        uint32
		authenticated bool
		want          bool
	}{
		{"owner", RecordScope{OwnerID: 7}, 7, true, true},
		{"other user", RecordScope{OwnerID: 7}, 8, true, false},
		{"guest private", RecordScope{OwnerID: 7}, 0, false, false},
		{"public guest", RecordScope{Public: true}, 0, false, true},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			if got := CanRead(test.record, test.userID, test.authenticated); got != test.want {
				t.Fatalf("CanRead() = %v, want %v", got, test.want)
			}
		})
	}
}
