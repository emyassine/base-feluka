# Generated builds

Cargo caches and compiled targets are stored in `cargo/`, Go executables in `bin/`, cross-target artifacts in `targets/`, and the generated SQLite database in `data/`. These outputs are ignored by Git. `make clean` removes them; regular runs reuse the compiler cache.
