# Feluqa Documentation Operating Principles for AI Agents

Audience: coding agents, technical writers and core engineers. Scope: `docs/`.
English is the normative baseline. Start with [the index](00.index.en.md) and
[current baseline](01.introduction/01.platform-overview.en.md).

## Directory structure

| Directory | Responsibility |
|---|---|
| `01.introduction/` | Platform overview, intent and roadmap entry point |
| `02.architecture/` | Layout, compilation, runtime, UI and application contracts |
| `03.for-developers/` | Module authoring, routes, data, authorization, tests and product consumers |
| `04.for-organizations/` | Availability, modules, licensing, data and security |
| `05.reference/` | CLI, editor, Rust rules, visual QA and view language |
| `06.governance-and-policy/` | Dependencies, proprietary distribution, updates and documentation provenance |
| `07.research-and-notes/` | Experiments, ideas, original prompts and measured research |
| `roadmap/` | Delivery tracks, dependencies, estimates and acceptance gates |
| `decisions/` | Pending owner choices, options, consequences and existing decision records |

`roadmap/` replaces `_todo/`. `decisions/` is intentionally unnumbered as requested.
There is no new `exists/` tree: delivered behavior lives in the relevant guides
and reference pages, with explicit status and evidence. Directory membership
alone never proves implementation.

## Naming

Documentation pages MUST use `<two-digit-order>.<kebab-case-slug>.<lang>.md`.
Translations share number and slug. `00.index.en.md` is the entry point.
`DOCS_GUIDELINES.md` is the explicitly requested filename exception.
Machine-readable support files such as `migration-manifest.json` are not pages.
Use unique integer positions within each directory; renumber and update all links
when inserting a page. Do not use decimal ordering, which would break the exact
filename convention. Leave repository/product README files, legal notices and
preserved benchmark evidence under their owners; the numbering rule is for `docs/`.

## Status and authority

- `[Delivered]`: a bounded capability with implementation and acceptance evidence.
- `[Target]`: accepted direction or planned work, never a shipped guarantee.
- `[Exploring]`: proposal or hypothesis awaiting evaluation/decision.

Architecture and product pages MUST identify mixed status explicitly. An accepted
ADR is a decision, not proof of delivery. Use MUST, SHOULD and MAY with their
RFC 2119 meanings; do not turn a research suggestion into a requirement.

Current user decisions and `AGENTS.md` govern work. Domain contracts and the
English delivery plan govern their respective scope. The current baseline lists
known stale assertions. Original proposals and historical records retain their
text for traceability, but their status notices take precedence over obsolete
present-tense wording. Never infer approval from migration or from a `[Target]`
label inside a conflicting proposal.

## Decisions and maintenance

Record a conflict in `decisions/` with a stable ID, sources, current rule, options,
impact, required evidence and **Pending owner decision**. Tell the owner before
implementing a conflicting choice. Do not select a winner silently. After the
owner decides, record date/rationale, update affected contracts, `AGENTS.md`,
roadmap and templates, and preserve the earlier proposal as history.

Consolidate related work into navigable chapters; preserve detailed acceptance
criteria, task IDs, examples, caveats and evidence. Link to one canonical contract
instead of copying it into each guide. Do not erase a rejected alternative without
retaining its rationale in the decision record.

When English changes, update French or explicitly mark synchronization pending.
The inherited French enterprise plan is a historical detailed record, not a
synchronized translation: F8/F9 differ from English. Preserve those IDs until
a mapping is approved. Some inherited `.en.md` notes contain French; their notices
identify that provenance, and language normalization remains tracked in decisions.

## Verification and evidence

Check local Markdown file links, anchors, naming, entry-point reachability and
references outside `docs/`. Use `python3 scripts/check-docs.py`.
For this migration, the manifest records original hashes and retained-body hashes;
`--migration` verifies those retained bodies. Update provenance deliberately when
editing a retained body later; do not refresh hashes to hide accidental loss.

M0 raw reports, snapshots and hashes MUST remain unchanged. External source URLs
are preserved references, not a fresh verification of their claims. A documentation
migration does not establish runtime, security, editor or release acceptance.
