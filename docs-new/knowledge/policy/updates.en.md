# Feluqa update and release policy

This is the canonical policy for distributing and activating Feluqa updates.
Remote service URLs are defined in `feluqa-definitions::RemoteLink`; products
must use those named links instead of constructing URLs or maintaining their
own endpoint lists. Cargo's registry configuration remains the static input
Cargo needs to resolve private dependencies.

## Current status

`RemoteLink::PrivateCrateRegistry` identifies the configured private Cargo
registry. `RemoteLink::CliUpdate` identifies the registry metadata endpoint
reserved for the `feluqa-cli` package, but the CLI package is not published and
the CLI `update` command is not implemented. `RemoteLink::PlatformUpdate` has
no URL configured. There is no automatic update check, installation, or
activation in the current product. A remote link alone does not mean a feed,
release artifact, signature, or update service is available.

## CLI updates

The CLI may check for updates on a throttled schedule and report availability.
Checks must never block normal CLI startup or silently replace the executable.
Automatic installation is opt-in and controlled by an explicit update policy.
Before installation, the client must verify signed release metadata and the
artifact digest, confirm the operating system and architecture, and reject
expired or rolled-back metadata. It must stage the new executable beside the
current one, verify it can start, then atomically activate it while retaining
the previous version for recovery. Any failed check, download, verification,
or activation leaves the current CLI usable.

## Platform and application updates

The platform updater must not overwrite files used by live processes. It must
stage a versioned release, verify trusted metadata and artifact digests, check
configuration and application compatibility, and start replacement instances
before shifting traffic. Traffic moves progressively only after readiness and
health checks pass. The previous healthy version remains available until the
new version passes the configured observation period; failed checks restore
traffic to that version and preserve diagnostic output.

Zero-interruption rolling activation requires multiple serving instances and
a traffic router. Feluqa must not promise zero downtime for a single-instance
installation; a restart there can interrupt requests. Session handling and
graceful draining must be included in any availability claim.

Database changes must follow expand-and-contract compatibility: deploy
additive changes first, keep old and new application versions compatible
during rollout, and remove obsolete schema only after rollback to the old
version is no longer needed. Code rollback does not roll back committed data.
Data migrations need their own recovery plan.

## Release acceptance

Update activation is not complete until release engineering demonstrates
signature and digest rejection, interrupted-download recovery, failed-health
rollback, concurrent old/new process compatibility, session behavior, and the
documented single-instance interruption behavior. Automatic activation remains
off unless an operator explicitly enables a policy with a channel, maintenance
window, and health thresholds. These are release requirements, not claims that
the current CLI or platform already implements them.
