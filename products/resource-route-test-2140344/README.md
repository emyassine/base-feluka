# Resource Route Test 2140344

Feluqa web application. Routes are in `src/routes/`. Shared website handlers/views live in `src/app/` and `resources/views/`; domain modules keep their controllers, migrations, providers and panel views together under `src/modules/<module>/`.

```sh
feluqa dev
feluqa make model Customer
feluqa make controller Customer
feluqa make migration create_customers --module app
feluqa migrate
feluqa build
```

The application uses the private Feluqa Cargo registry. Authenticate with `cargo login --registry feluqa` using your own registry credential. Credentials are never written into this project.
