# Keeper Authoring Workflow

Keeper apps are declarative and file-backed. The authoring job is to keep YAML descriptors, JSONL data, and runtime binding assumptions consistent.

## Operating Modes

| Mode | First action |
| --- | --- |
| New app | Design app id, tables, views, and create the folder set under `keeper/apps/{appId}/`. |
| Existing app | Read current app files before editing anything. |
| Schema/data change | Inspect JSONL before changing schema constraints. |
| View/runtime change | Inspect target schemas, data sources, and peer navigation patterns. |
| Debug/validate | Inventory all descriptors and report issues before editing unless asked to fix. |

## Safe Edit Sequence

1. Identify app id and task type.
2. Read relevant files.
3. Build the dependency list:
   - schemas
   - data files
   - views
   - workflows
   - agents
   - app descriptor
4. Make the smallest coherent change across all dependent files.
5. Validate syntax and cross-file references.
6. Report what changed and what remains risky.

## UI Copy And Genre Defaults

Before writing view YAML, pick the interaction genre through `components-and-layout.md`, read only
the selected component and pattern files, and apply
its defaults consistently. Authored `title`/`description` strings render
verbatim to end users — write product microcopy, omit descriptions that only
narrate configuration, and never duplicate a field between detail header meta
and a section.

## Existing App Read Checklist

Read these when they exist and are relevant:

- `keeper/apps/{appId}/app.yaml`
- `keeper/apps/{appId}/schemas/*.yaml`
- `keeper/apps/{appId}/views/*.yaml`
- `keeper/apps/{appId}/workflows/*.yaml`
- `keeper/apps/{appId}/agents/*.yaml`
- `keeper/apps/{appId}/data/*.jsonl`

For focused edits, read every file that names the touched table, field, view, workflow, or agent.

## Cross-File Checkpoints

- `app.yaml defaultView` points to a real view.
- App folder and `app.yaml id` match.
- Schema filename, top-level `table`, and corresponding JSONL filename use one exact identifier:
  `schemas/{table}.yaml`, `table: {table}`, and `data/{table}.jsonl`.
- View filename and `view.id` match.
- Agent/workflow filename and `id` match.
- Every schema `primaryKey` and `displayField` field exists.
- Every relation targets a real table and field.
- Every data source references a real schema or documented provider resource.
- Every component references an existing data source of the correct shape.
- Every layout component exists.
- Every component field exists in the schema it renders.
- Every direct action under `record_detail.actions` or `record_collection.detail.actions` has a
  nested `action.type: provider_action`; its optional appearance is `default`, `secondary`, or
  `destructive`, and navigation/save controls are not placed there.
- Every JSONL row has the primary key and valid field values.

## High-Risk Changes

The changes that must be treated as data migrations — renames, primary-key changes, a required field
added to a populated table, tightened options, and editable UI over synthetic data — are listed with
their handling in [`design/data-and-access.md`](design/data-and-access.md) under "Changes that are
migrations." Confirm intent and inspect data before making any of them.

## When To Ask Before Editing

Ask or present options when:

- multiple app ids are plausible
- a requested operation can discard or rewrite user data
- a field/table/view rename requires broad migration
- the requested feature needs undocumented Keeper behavior
- user intent conflicts with a read-only runtime rule

In delegated managed-team execution, specialists and the coordinator cannot ask
the user: treat each of these conditions as an explicit reported failure to the
coordinator or caller, never as a question to relay.

## Final Response Checklist

Include:

- files created or changed
- app id and path
- validation performed
- data migrated or not touched
- assumptions and residual risks
