use std::{fs, time::Instant};
use wasmtime::{Engine, Linker, Module, Store, TypedFunc};

struct HostState;
type Pooled = (Store<HostState>, TypedFunc<(i32, i32, i32), i32>);

fn main() -> anyhow_free::Result<()> {
    let engine = Engine::default();
    let wasm = fs::read("../guest.wasm")?;
    let module = Module::new(&engine, wasm)?;
    let mut linker = Linker::new(&engine);
    linker.func_wrap(
        "feluka",
        "owner_matches",
        |owner: i32, user: i32| if owner == user { 1 } else { 0 },
    )?;
    let mut pool: Vec<Pooled> = Vec::new();
    for _ in 0..8 {
        let mut store = Store::new(&engine, HostState);
        let instance = linker.instantiate(&mut store, &module)?;
        let function = instance.get_typed_func::<(i32, i32, i32), i32>(&mut store, "can_read")?;
        pool.push((store, function));
    }
    for (args, expected) in [((42, 42, 0), 1), ((42, 7, 0), 0), ((42, 7, 1), 1)] {
        let (store, function) = &mut pool[0];
        assert_eq!(function.call(store, args)?, expected);
    }
    for i in 0..100_000usize {
        let (store, function) = &mut pool[i % 8];
        let result = function.call(store, (42, 42, 0))?;
        assert_eq!(result, 1);
    }
    let mut samples = Vec::with_capacity(100);
    let mut checksum: i64 = 0;
    for _ in 0..100 {
        let start = Instant::now();
        for i in 0..10_000usize {
            let index = i % 8;
            let (store, function) = &mut pool[index];
            checksum += i64::from(function.call(store, (42, 42, 0))?);
        }
        samples.push(start.elapsed().as_nanos() as f64 / 10_000.0);
    }
    samples.sort_by(f64::total_cmp);
    println!(
        "{{\"runtime\":\"rustc 1.99.0\",\"wasmtime\":\"38.0.4\",\"pool_size\":8,\"warmup_calls\":100000,\"measured_calls\":1000000,\"host_callback_per_call\":true,\"checksum\":{},\"ns_per_call\":{{\"min\":{:.1},\"p50\":{:.1},\"p95\":{:.1},\"p99\":{:.1},\"max\":{:.1}}}}}",
        checksum, samples[0], samples[49], samples[94], samples[98], samples[99]
    );
    Ok(())
}

mod anyhow_free {
    pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;
}
