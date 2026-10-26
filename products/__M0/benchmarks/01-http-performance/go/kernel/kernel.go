// Package kernel contains a dependency-free authorization primitive shared by
// the Go target smoke builds.
package kernel

type RecordScope struct {
	OwnerID uint32
	Public  bool
}

func CanRead(record RecordScope, userID uint32, authenticated bool) bool {
	return record.Public || (authenticated && record.OwnerID == userID)
}
