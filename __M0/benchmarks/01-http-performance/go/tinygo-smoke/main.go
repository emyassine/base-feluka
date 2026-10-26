package main

import "feluka-m0-go/kernel"

func main() {
	if !kernel.CanRead(kernel.RecordScope{OwnerID: 7}, 7, true) {
		panic("owner must read the record")
	}
	if kernel.CanRead(kernel.RecordScope{OwnerID: 7}, 8, true) {
		panic("another user must not read the record")
	}
	if !kernel.CanRead(kernel.RecordScope{Public: true}, 0, false) {
		panic("guests must read public records")
	}
}
