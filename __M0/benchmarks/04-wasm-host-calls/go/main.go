package main

import (
	"context"
	"fmt"
	"os"
	runtimever "runtime"
	"sort"
	"time"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
)

func main() {
	ctx := context.Background()
	wasm, err := os.ReadFile("../guest.wasm")
	check(err)
	wazeroRuntime := wazero.NewRuntimeWithConfig(ctx, wazero.NewRuntimeConfigCompiler())
	defer wazeroRuntime.Close(ctx)
	_, err = wazeroRuntime.NewHostModuleBuilder("feluka").
		NewFunctionBuilder().WithFunc(func(_ context.Context, _ api.Module, owner, user int32) int32 {
		if owner == user {
			return 1
		}
		return 0
	}).Export("owner_matches").Instantiate(ctx)
	check(err)
	compiled, err := wazeroRuntime.CompileModule(ctx, wasm)
	check(err)
	const poolSize = 8
	pool := make([]api.Function, poolSize)
	for i := range pool {
		instance, instantiateErr := wazeroRuntime.InstantiateModule(ctx, compiled, wazero.NewModuleConfig())
		check(instantiateErr)
		pool[i] = instance.ExportedFunction("can_read")
	}
	callArgs := func(i uint64, owner, user, public uint64) uint64 {
		values, callErr := pool[i%poolSize].Call(ctx, owner, user, public)
		check(callErr)
		return values[0]
	}
	if callArgs(0, 42, 42, 0) != 1 || callArgs(1, 42, 7, 0) != 0 || callArgs(2, 42, 7, 1) != 1 {
		panic("authorization result mismatch")
	}
	for i := uint64(0); i < 100_000; i++ {
		callArgs(i, 42, 42, 0)
	}
	const batches, batchCalls = 100, 10_000
	samples := make([]float64, batches)
	var checksum uint64
	for batch := range samples {
		start := time.Now()
		for i := 0; i < batchCalls; i++ {
			checksum += callArgs(uint64(i), 42, 42, 0)
		}
		samples[batch] = float64(time.Since(start).Nanoseconds()) / batchCalls
	}
	sort.Float64s(samples)
	fmt.Printf("{\"runtime\":%q,\"wazero\":%q,\"pool_size\":%d,\"warmup_calls\":100000,\"measured_calls\":1000000,\"host_callback_per_call\":true,\"checksum\":%d,\"ns_per_call\":{\"min\":%.1f,\"p50\":%.1f,\"p95\":%.1f,\"p99\":%.1f,\"max\":%.1f}}\n", runtimever.Version(), "v1.9.0", poolSize, checksum, samples[0], samples[49], samples[94], samples[98], samples[len(samples)-1])
}

func check(err error) {
	if err != nil {
		panic(err)
	}
}
