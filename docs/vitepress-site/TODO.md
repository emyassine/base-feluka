# VitePress site: ownership and build speed

This is an active investigation, not a commitment to preserve upstream VitePress
as the long-term owner of the final site experience. The project may fork and
internalize VitePress where that is the clearest way to make the published site
predictable and fast.

## Outcomes we require

### Final site stability

- Own the components, responsive states, navigation behavior, and micro-interactions
  that determine the final Feluqa site experience.
- Make desktop, intermediate-width, and mobile behavior explicit and testable.
- Avoid behavior depending on undocumented VitePress component internals or CSS
  overrides that hide broken markup. If upstream code is retained, pin it and put
  the integration behind a small, owned boundary.
- Decide whether this boundary is a maintained fork, selective vendoring of the
  theme/navigation layer, or a full internal renderer. Compare maintenance cost
  against the stability we gain; do not assume that copying the whole package is
  automatically simpler.
- Define visual and interaction acceptance cases for navigation, locale selection,
  search, appearance controls, and responsive transitions. A build passing is not
  visual verification.

### Much faster builds

- Set a measured build-time target after recording clean and incremental baselines
  for each registered site and for all sites together.
- Attribute time and resource use to preparation stages, VitePress bundling,
  Markdown rendering, Mermaid, link validation, and output staging.
- Keep cache invalidation deterministic. A faster build that can publish stale or
  mixed output is not acceptable.

## Is parallel build orchestration possible?

Yes, with important limits.

- **Different sites:** likely the first safe opportunity. Each site already has a
  separate declaration, generated project, cache, and output directory. An
  orchestrator can launch independent site builds concurrently, subject to CPU,
  memory, and disk limits. Confirm that every scratch path and lock is site-scoped
  before enabling this by default.
- **Several builds of the same site:** do not point concurrent processes at the
  same generated project, cache, or output. The current preparation pipeline uses
  a per-site lock, and VitePress writes into a shared project/output tree. Parallel
  builds need isolated workspaces and a deterministic merge/publish step, or they
  will race and can produce incomplete output.
- **Stages within one site:** the preparation pipeline currently runs dependent
  stages in sequence. First identify independent page/data transformations and
  measure them. Parallelize only those with isolated inputs/outputs and a
  deterministic aggregation step. VitePress rendering itself may need upstream
  architectural work or a renderer replacement; launching shell processes alone
  does not make a single site build safely parallel.
- **Bash:** suitable for supervising independent site processes, limiting
  concurrency, collecting logs, handling signals, and reporting failures. Keep
  path/config validation and build semantics in the site host rather than
  duplicating them in a large shell script.
- **Rust:** a plausible later orchestrator or replacement for measured,
  CPU-heavy preparation stages. Rust can schedule isolated jobs and enforce
  resource limits, but it does not make VitePress's Node-based rendering faster
  unless that rendering is also changed. Benchmark a Rust prototype against the
  Node implementation before migrating behavior.

## Work sequence

1. Record clean, warm, and single-file incremental build timings for `site-1`,
   `site-2`, and the full registered site set. Include peak memory and CPU use.
2. Add stage-level timings to the full build, not only Markdown preparation.
3. Audit site-scoped locks, generated directories, caches, temporary directories,
   and output paths. Document which are safe for concurrent site builds.
4. Prototype bounded parallel builds across different sites using isolated
   processes. Verify failure propagation, cancellation, logs, and that one site's
   build cannot alter another site's output.
5. Profile the slowest stage. Compare bounded Node workers/processes, a Rust
   orchestrator, and Rust replacement of only the measured hot stage.
6. Decide the VitePress ownership boundary and write the selected architecture
   into the relevant `docs-new/` guide. Keep this TODO active until a tested path
   meets both stability and speed requirements.

## Acceptance evidence

- Before/after timing reports for clean, warm, incremental, and multi-site builds.
- Peak resource use and concurrency limits documented for the measured machine.
- Visual/interaction checks at desktop, intermediate, and mobile widths for owned
  navigation and site controls.
- Repeated builds produce complete, internally consistent site outputs; failures
  never publish partial output or overwrite another site's build.
- The chosen fork/internalization boundary, update policy, and upstream merge
  strategy are documented before the site depends on it in production.
