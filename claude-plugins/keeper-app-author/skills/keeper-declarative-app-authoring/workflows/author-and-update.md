# Author and Update

Use for new applications and definition changes. This workflow produces a validated, reviewable
candidate; publication follows [Apply](apply.md).

## Establish the baseline

Resolve the target using [Inspect and open](inspect-and-open.md), reusing discovery already completed
for this task. Read `contract_read(topic: "application")` before constructing or changing a
candidate. For new apps and changes to writes, workflows, validation, constraints, or read
completeness, read `contract_read(topic: "all")` and inspect `consistency` before designing the
change. There is no standalone `consistency` topic. It defines the `query_records`/`collect_records`
distinction, JSONL-only legacy query validation, transaction guarantees, and constraint backfill.
A label-only edit does not need that additional reading. Reuse a current contract already read
in this task rather than requesting it repeatedly.

For an existing app, call `app_get`, inspect `effectiveAccess`, and read definitions with
`app_files_read(contentScope: "definitions")`. Preserve the returned revision, source files, and
installed guide documents. Read the affected files and every definition that refers to a changed
table, field, view, workflow, or agent. Inspect actual app definitions, rather than unrelated sibling
apps as templates.

Definition work uses `dataMode: "preserve"` and omits JSONL. Do not obtain live records just to
carry them forward. Use schema information and synthetic examples to reason about shape. If the
change needs backfill, data rewriting, or tighter access, follow [Migrate and repair](migrate-and-repair.md)
and [App security](../reference/security/index.md) as applicable.

## Design only the affected scope

For a new app or substantial redesign, use [App design](../design/app-design.md). For a small edit,
retain the existing storage engine, unaffected topology, and policies. Read the exact
[syntax references](../reference/index.md) needed by the change. Do not infer keys from related
types or silently ignored fields.

Turn the user's brief into a compact acceptance checklist before choosing the topology. Cover each
required field, relationship, role-visible attribute, lifecycle transition, comment or activity
surface, and primary create/edit path. Mark requirements that depend on platform-owned identity or
access policy so they are not accidentally implemented as ordinary app data. Use the checklist to
review the candidate and later to select smoke tests; do not invent a fixed screen or test count.

An [example](../examples/index.md) is optional. When using a whole app as a starting point, inspect
its descriptors and dependencies. For one interaction, read its relevant composition only. Adapt
domain fields and screen count to the brief while preserving runtime binding and action syntax.

## Construct the candidate

Pass complete UTF-8 `{path, content}` entries, not patches. Paths are app-relative; see the
[application reference](../reference/application/app.md) for supported file types. Include guide
documents in the candidate when present. Do not submit absolute paths, traversal, duplicates, or
binary content. Use MCP candidate tools rather than directly writing an installed app's filesystem.

For a new app, include `app.yaml`, required schemas, all requested views, and the actions/navigation
that make those views usable. Include workflows, agents, and seed data when needed by the brief.
For new apps, use manifest `schemaVersion: 2`. New tables use `version: 2` with explicit `rowAccess`;
these are separate declarations. Examples containing legacy version-1
schemas illustrate syntax compatibility, not the default for new team data.

For existing apps, select the intended definition mode:

- `replace`: candidate is the complete desired definition/content set; omitted files are deleted.
- `merge`: an explicitly partial overlay; omitted installed files remain.

Both use `dataMode: "preserve"` for definition-only work. New JSONL apps may include requested
seed rows. DynamoDB candidates contain no JSONL; see [Storage](../reference/storage/index.md).

## Check fitness and validity

Check the changed behavior and its dependencies, extending to the whole app for new creation:

- `defaultView` is a usable first destination for the intended audience, normally a primary work
  or browse surface. Do not accidentally land members on an admin-only screen or a detail/edit
  screen requiring an unprovided selection. An explicitly requested admin-only app may have an
  admin landing view. Hidden contextual views have incoming links supplying their required routes.
- Trace each table to a view, workflow, agent, relation, projection, or security-policy dependency;
  each workflow/agent must have an invocation path or an intentional external caller. Flag orphan
  schemas and dead automation. Do not delete existing data-bearing tables merely because the UI
  does not show them; resolve their purpose and deletion impact first.
- File stems and descriptor IDs agree; schema `table` and any JSONL stem agree. Cross-file fields,
  relations, sources, components, workflows, and agents resolve.
- Mutations target the intended record and authorized source. Projections stay read-only; view
  filters do not stand in for row access. Review changed access with the security reference.
- Labels describe the user's task. Avoid duplicate detail fields and configuration prose in UI copy.
- Retain installed guides. Update guide content when a changed status, workflow, role, or view makes
  it inaccurate; use [guide design](../design/user-guide.md) for new explanatory content.

Call candidate-source `app_validate` with the complete effective candidate required by the current
tool schema; set `includeData: true` when intentionally validating submitted JSONL. A partial upload
overlay may need the retained installed definitions included for standalone candidate validation.
Fix errors and revalidate. Review warnings for real risks rather than assuming a valid candidate
satisfies the brief. Report any unresolved limitation.

When a workspace change is requested, continue to [Apply](apply.md), which owns diff, staging,
revision checks, deployment progress, and launch. For a review-only request, report the validated
candidate and findings without preparing an upload.
