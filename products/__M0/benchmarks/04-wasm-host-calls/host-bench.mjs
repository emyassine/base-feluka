import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';

const bytes = await readFile(new URL('./guest.wasm', import.meta.url));
const module = await WebAssembly.compile(bytes);
const poolSize = 8;
const instances = Array.from({ length: poolSize }, () => {
  const imports = { feluka: { owner_matches: (owner, user) => Number(owner === user) } };
  return new WebAssembly.Instance(module, imports);
});
const call = (index) => instances[index % poolSize].exports.can_read(42, 42, 0);
if (call(0) !== 1 || instances[0].exports.can_read(42, 7, 0) !== 0 || instances[0].exports.can_read(42, 7, 1) !== 1) {
  throw new Error('WASM authorization behavior mismatch');
}

const warmup = 100_000;
const batchCalls = 10_000;
const batches = 100;
for (let i = 0; i < warmup; i++) call(i);
const samples = [];
let checksum = 0;
for (let batch = 0; batch < batches; batch++) {
  const start = performance.now();
  for (let i = 0; i < batchCalls; i++) checksum += call(i);
  samples.push((performance.now() - start) * 1e6 / batchCalls);
}
samples.sort((a, b) => a - b);
const percentile = (p) => samples[Math.ceil(p * samples.length) - 1];
console.log(JSON.stringify({
  runtime: process.version,
  engine: process.versions.v8,
  pool_size: poolSize,
  warmup_calls: warmup,
  measured_calls: batches * batchCalls,
  batch_calls: batchCalls,
  host_callback_per_call: true,
  checksum,
  ns_per_call: {
    min: samples[0], p50: percentile(0.50), p95: percentile(0.95),
    p99: percentile(0.99), max: samples.at(-1),
  },
}));
