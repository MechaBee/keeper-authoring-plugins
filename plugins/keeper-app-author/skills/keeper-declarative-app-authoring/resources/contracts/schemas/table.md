# Table Schema Contract

Store one schema at `schemas/{table}.yaml`:

```yaml
table: tasks
version: 2
primaryKey: id
idPrefix: task
displayField: title
rowAccess:
  mode: all
fields:
  - id: id
    type: text
    label: ID
    required: true
    readonly: true
  - id: title
    type: text
    label: Title
    required: true
```

Required keys are `table`, `version`, `primaryKey`, `idPrefix`, `displayField`, and non-empty
`fields`. Version 2 also requires `rowAccess`. Optional keys are `referenceLabelTemplate`,
`relations`, `mutationPolicy`, `validationPolicy`, `constraints`, and `queryPaths`. `table` must match both the
schema filename stem and any `data/{table}.jsonl` filename. Primary and display fields must exist.
The schema and data path share one exact identifier: `schemas/{table}.yaml` must declare
`table: {table}`.

Use `rowAccess: { mode: all }` for team-wide rows. Use the following elementary owner policy when
members must see and mutate only their own rows:

```yaml
rowAccess:
  mode: owner
  ownerField: owner_user_id
```

The owner field must be an existing required, readonly `text` field or a reference to the runtime
`keeper_principals` table, and cannot be the primary key. Keeper stamps it from the authenticated
stable user ID. Views and caller filters may narrow row scope but never widen it. App admins and
workspace managers see all rows. Version 1 schemas without `rowAccess` retain legacy `all`
behavior with a validation warning.

## Resource-Grant Policy

Use `mode: policy` only when a record must be reachable through a direct assignment or a group
assignment. The runtime evaluates every `allOf` entry; authors may not add expressions, scripts,
request bindings, email addresses, or another caller-controlled identity.

```yaml
rowAccess:
  mode: policy
  allOf:
    - kind: resource_grant
      resourceField: resource_id
      directGrants:
        table: resource_user_access
        resourceField: resource_id
        principalField: principal_id
      groupGrants:
        table: resource_group_access
        resourceField: resource_id
        groupField: group_id
      groupMemberships:
        table: group_memberships
        groupField: group_id
        principalField: principal_id
    - kind: owner
      ownerField: owner_user_id
      adminCreateAssignment: resolved_principal
```

`resource_grant` permits a direct assignment for the authenticated principal or an assignment for
one of their groups. Each entry in `allOf` is conjunctive, so the optional `owner` requirement
also applies and is stamped/immutable. An owner clause may use
`adminCreateAssignment: resolved_principal` only when its owner field is a required readonly
`keeper_principals` reference. It lets an unrestricted app admin select a resolved principal while
creating a row; an absent selection is stamped to the administrator, unresolved selections fail,
and all updates preserve the existing owner. The declaration is unavailable for `mode: owner` and
never applies to shared-link sessions. Use `related_resource_grant` only to derive
scope from rows already authorized in another table; do not maintain a client-side projection to
broaden access:

```yaml
    - kind: related_resource_grant
      resourceTable: projects
      resourceField: id
      targetField: project_id
```

This permits a row only when its `targetField` equals the authorized resource row's
`resourceField`; the resource table must already have a valid row policy.

Every table named by `directGrants`, `groupGrants`, or `groupMemberships` is security metadata and
must itself be admin-only:

```yaml
rowAccess:
  mode: policy
  allOf:
    - kind: app_role
      anyOf: [admin]
```

Keeper verifies all referenced tables and scalar fields, rejects policy cycles, and compiles the
required DynamoDB paths. A grant or membership change invalidates a protected cursor and fences a
subsequent write. App admins may bypass row policy only after normal app/workspace admission;
shared-link sessions do not inherit that bypass.

Use `referenceLabelTemplate` only when one `displayField` cannot produce a useful reference label.
Read [`fields.md`](fields.md) and [`relations.md`](relations.md) before adding their entries.

## Mutation policy

`mutationPolicy` restricts *who* and *through which path* rows may be created, updated, or deleted;
it complements `rowAccess`, which governs read visibility. It must define at least one of
`allowedRoles`, `channels`, or a relation lifecycle rule (`relationField` + `allowWhen`).

```yaml
mutationPolicy:
  allowedRoles: [editor, developer, admin]   # app roles permitted to mutate at all
  relationField: period_id                   # a reference field that also has a table relation
  allowWhen:                                  # mutate only while the related row qualifies
    field: status                            # a field on the related (period) record
    values: [open]
  channels:
    direct:
      operations: [update, delete]           # what a direct provider_action may do
    workflow:
      operations: [create, update]           # what workflows may do
      workflowIds: [create_time_entry, quick_add_time_entry]   # only these workflows
```

- `allowedRoles` — non-empty array of app roles (`viewer`, `editor`, `developer`, `admin`).
- `channels` — restrict the mutation path. `direct` governs `provider_action` writes; `workflow`
  governs workflow steps. Each channel lists allowed `operations` (`create` / `update` / `delete`);
  the `workflow` channel may also pin `workflowIds` (only those workflows may write through it) and
  an optional per-channel `allowCurrentWhen: {field, values, operations?}` gate on the existing row.
  A workflow-only table lists just a `workflow` channel — and every workflow that writes the table,
  or a table it transitively creates, must appear in that `workflowIds` list.
- `relationField` + `allowWhen` (provided together) — a relation lifecycle rule: a row may be
  mutated only while the record reached through the `relationField` relation has `field` in
  `values`. Example: a time entry is editable only while its accounting `period` `status` is
  `open`.
- `bypassRoles` — optional non-empty array of roles that may mutate regardless of the channel and
  lifecycle rules.

## Validation policy

`validationPolicy` adds write-time integrity beyond field types. It must define `unique`, `checks`,
or both.

```yaml
validationPolicy:
  unique:
    - fields: [owner_user_id, week_start]     # composite uniqueness
      message: This member already has a timesheet for that week.
  checks:
    - id: quarter_hour_duration
      operations: [create, update]            # optional; defaults to both
      message: Duration must be a positive multiple of 15 minutes.
      input:
        candidate: {kind: candidate}          # the row being written
      code: |
        const c = input.candidate;
        return Number.isInteger(c.duration_minutes)
          && c.duration_minutes >= 15
          && c.duration_minutes % 15 === 0;
```

- `unique` — each entry is `{fields, message}`; `fields` is a non-empty list of schema field ids
  enforced as one composite uniqueness constraint.
- `checks` — each is a named predicate with a unique `id`, optional `operations`
  (`create` / `update`), a `message` shown on failure, a non-empty JavaScript `code` string, and a
  non-empty `input` map. The script returns truthy to pass and receives only its declared `input`.
- Validation-check `input` kinds:
  - `{kind: candidate}` — the row as it will be written.
  - `{kind: current}` — the existing stored row (update only).
  - `{kind: related_record, relationField: <field>}` — the record referenced through a declared
    relation, so a check can compare against it (for example a task's `project_id`).
  - `{kind: query_records, table: <table>, filter: {...}}` — rows from another table; each filter
    value binds a `candidate.*`, `current.*`, or `system.actorUserId|actorEmail|appRole` value.

Prefer field types, `unique`, `relations`, and `constraints` for structural rules; reserve `checks`
for cross-field logic. Never emulate a cross-record aggregate with a check that scans sibling rows —
use a `constraints` `aggregate_bound` instead.

## DynamoDB query paths

Declare stable logical query capabilities on the schema when a query must avoid bounded canonical
fallback. These declarations are storage-engine neutral; never author physical keys, shards,
generations, scope variants, or Access records. A path is `{id, equalityFields, orderFields}` and
takes one of three shapes:

```yaml
queryPaths:
  - id: by_updated                 # pure ordering — equalityFields may be empty
    equalityFields: []
    orderFields: [updated_at]
  - id: exact_period_key           # equality only — orderFields may be omitted
    equalityFields: [period_key]
  - id: by_owner_cell_start        # composite equality plus ordering
    equalityFields: [timesheet_id, work_date, project_id]
    orderFields: [started_at]
```

Design each path from the query it must serve: a query binds a declared path when its equality
filters match `equalityFields` and its `sort` field matches `orderFields`. So `equalityFields` are
the query's equality filters (plain `filter` values and `where … op: equals` comparisons) and
`orderFields` is its sort field. Omit any field that `rowAccess` already owns — for example an
`owner` policy's owner field — because Keeper compiles the authorization variants for you; that is
why owner-scoped tables list only their non-owner filters.

Rules the runtime enforces: every field must exist and be scalar/key-encodable; a path declares at
least one equality or order field; a field may not appear in both lists; and `orderFields` must
omit the primary key — Keeper appends it automatically. A view, workflow, or agent may use a
compatible declared path, but changing those consumers alone does not redeploy DynamoDB storage.
Queries without a compatible path use their bounded fallback policy; `performance.intent: indexed`
instead produces a validation/runtime error with a suggested `queryPaths` entry.


## Cross-record invariants

Use a logical `aggregate_bound` when a sum must remain within a bound for every group. Keeper owns
the physical enforcement for each storage engine; never emulate this with a write-time
`validationPolicy.check` that queries sibling rows.

```yaml
constraints:
  - id: daily-hours-at-most-24
    kind: aggregate_bound
    groupBy: [owner_user_id, work_date]
    aggregate:
      operation: sum
      field: hours
    maximum: 24
    message: Daily time cannot exceed 24 hours.
```

`id`, non-empty `groupBy`, `aggregate.operation: sum`, finite non-negative `maximum`, and `message`
are required. The aggregate field must be a required number with a finite non-negative field-level
`min`; this makes writes and backfill monotonic. `minimum` is intentionally unsupported because a
lower-bound sum needs distinct group creation/deletion semantics. Group fields must be scalar and key-encodable.
Changing a constraint is a data migration: Keeper backfills and verifies its guard before a
DynamoDB definition becomes active, while JSONL evaluates the complete candidate table under its
optimistic write revision.
