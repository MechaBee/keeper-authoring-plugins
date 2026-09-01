# Design: Data And Access

Decide the storage engine, how many tables to model, how rows are read, and — the part with no home
until now — whether a table needs a write, validation, or index policy at all. Add protection where
the brief requires it and nowhere else: a policy that merely restates a weaker default is noise, and
a missing one is a hole. Each decision points to
[`../contracts/schemas/table.md`](../contracts/schemas/table.md) and
[`../contracts/schemas/fields.md`](../contracts/schemas/fields.md) for the shape.

## Storage engine: JSONL or DynamoDB

Every app persists through one engine, declared once in `app.yaml` (`storage.engine`). Choose by how
the app will be used, not by table shape:

- **JSONL — the default; omit `storage` entirely.** File-backed with per-file optimistic
  concurrency, and it ships with seed/live `data/*.jsonl`. Right for prototypes, personal apps, and
  low-concurrency data — the fastest way to stand an app up.
- **DynamoDB — `storage.engine: dynamodb`.** Per-record concurrency, indexed `queryPaths`, and
  aggregate guarantees enforced atomically at scale. Choose it for team-facing apps with real
  concurrent writers, queries that must stay fast as data grows, or hard aggregate bounds. A DynamoDB
  candidate is definition-only — it carries no `data/*.jsonl`. Read
  [`../dynamodb-authoring.md`](../dynamodb-authoring.md) before authoring or converting one.

You do not have to choose perfectly up front, and JSONL is the right default for a first pass. When a
prototype graduates to team use, **migrate it to DynamoDB** — forward-only, keeping the same
descriptors — from the management UI or through the MCP conversion workflow. Never hand-migrate: an
ordinary upload cannot change an installed app's engine, you do not rewrite the schemas by hand, and
DynamoDB-to-JSONL is unsupported. Add `queryPaths` and `performance` intent (below) only as the
DynamoDB app actually needs them.

## How many tables

- **One table** when the brief describes one kind of record with a flat field set.
- **Separate tables** when a record *references* another kind (owner, project, period) — model the
  reference with a relation, do not embed copies. See
  [`../contracts/schemas/relations.md`](../contracts/schemas/relations.md).
- **Three tables — logical identity, version history, current snapshot** only when the brief needs
  historical "valid on date" semantics. This is the effective-dated register; do not reach for it to
  keep an ordinary edit history. Anchor on
  [`../effective-dated-rules`](../effective-dated-rules/README.md).
- **A `projected_table`** is not a stored table — it is a read-only join/derivation for a dashboard.
  See [`../projected-tables-and-providers.md`](../projected-tables-and-providers.md).

## Read access: `rowAccess` mode

Every version-2 schema declares `rowAccess`. Choose the mode by *how a row becomes visible*:

| Reach for | when a row is visible to… | not when… |
| --- | --- | --- |
| `mode: all` | everyone on the team | rows are personal or assignment-scoped |
| `mode: owner` | only the member who created it (hours, expenses, submissions, personal drafts) | any teammate should see it |
| `mode: policy` | whoever holds a direct or group **assignment** to the row's resource | plain ownership or team-wide access already fits — `policy` is the heaviest mode, use it only for genuine assignment/sharing |

Never imitate `owner` or `policy` scope with a view filter, workflow code, or an app-defined
expression — those narrow presentation but do not enforce access, and a caller can bypass them. Views
may narrow row scope but never widen it. Read the `rowAccess` section of `table.md` for the exact
`owner` and `policy` shapes before authoring either.

## Write access: do you need a `mutationPolicy`?

**Default: no.** `rowAccess` already governs who sees a row, and in `owner`/`policy` modes who may
touch their own rows. Add a `mutationPolicy` **only** when one of these holds:

- **A write path must be closed.** The table may be written *only* through workflows, never a direct
  edit → declare a `workflow` channel with `workflowIds`. Every workflow that writes the table — or
  a table it transitively creates — must be listed.
- **Editability depends on another record's lifecycle.** A row is mutable only while the record it
  points to qualifies (a time entry editable only while its `period` is `open`) → `relationField` +
  `allowWhen`, where `allowWhen.field` is a field on the *related* table.
- **Writes need a narrower role than reads.** → `allowedRoles`.

If none hold, omit it. A `mutationPolicy` that only repeats `rowAccess` adds surface without adding
protection. Read the mutation-policy section of `table.md` for the channel/lifecycle shape.

## Write integrity: `validationPolicy`, `constraints`

Escalate only as far as the rule requires:

- **A single field's shape** (type, required, min, options) → field definitions in `fields.md`. Not
  a `validationPolicy`.
- **Uniqueness** (single or composite) → `validationPolicy.unique`.
- **Cross-field or cross-record truth** a field type cannot express → `validationPolicy.checks`, with
  the declared `input` kinds (`candidate`, `current`, `related_record`, `query_records`).
- **A per-group sum that must stay within a bound** (daily hours ≤ 24) → `constraints.aggregate_bound`.
  **Never** emulate this with a `check` that scans sibling rows — a read-then-write script has no
  portable concurrency meaning, and Keeper compiles the constraint to an atomic accumulator instead.

## Query capability: `queryPaths`

Declare `queryPaths` on a schema **only** when a query sets `performance.intent: indexed`, or when
bounded-fallback telemetry shows a real query needs one. Do not declare them preemptively, and never
author physical keys, shards, or Access records — a path is logical intent
(`{id, equalityFields, orderFields}`). Omit any field `rowAccess` already owns (an owner field);
Keeper compiles the authorization variants. Read the DynamoDB query-paths section of `table.md` and
[`../dynamodb-authoring.md`](../dynamodb-authoring.md).

## Changes that are migrations

Treat these as data migrations, not edits — inspect existing data and confirm intent before making
them, because each can invalidate stored rows:

- field, table, or view rename; primary-key change
- a required field added to a table that already has rows
- select / multi-select options tightened
- a reference field added without its relation and reference-table loading
- an editable component placed over projected or provider (synthetic, non-stored) data

When one is requested, follow the migration guidance in
[`../data-and-schema-evolution.md`](../data-and-schema-evolution.md) and confirm with the user before
touching live data.
