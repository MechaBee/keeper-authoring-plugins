# Schema Evolution

Classify compatibility before changing an installed schema. Inspect affected definitions and their
references; use permitted validation diagnostics to assess retained data. Only read or rewrite
live data through the authorized [migration workflow](../../workflows/migrate-and-repair.md).

| Change | Check |
| --- | --- |
| Add optional field | Existing rows may omit it; check defaults and consumers |
| Add required field | Establish whether existing rows satisfy it or require backfill |
| Rename field or table | Update stored keys/paths and all sources, filters, sorts, relations, components, bindings, workflows and agents |
| Remove field | Check stored keys, consumers, primary/display fields and relations |
| Tighten select options | Establish how existing values map before removing allowed values |
| Change primary key | Treat as a full migration of rows, relations, routes and mutations |
| Change idPrefix | Existing IDs remain valid; future generated IDs change |
| Change a view label | Keep the view ID stable; update user-facing guide text as needed |
| Rename a view ID | Update descriptors and routes, and assess issued share links and saved launch URLs; no record rewrite is implied |
| Add/change constraint | Review stored-row compatibility and deployment backfill impact |
| Introduce/change resource policy | Validate the entire security-metadata graph and admin authority |

## View identity and existing links

Issued share grants store `initialViewId` and allowed `viewIds`. Renaming a view ID or removing its
old descriptor does not rewrite those grants or saved launch URLs. Old links can fail to open the
view, and the existing grant does not automatically authorize the new ID. Changing `share.views`
in the candidate is not a migration of already issued grants.

Prefer changing `view.title` or `nav.title` when only the displayed name needs to change. For an
actual ID change, inventory known navigation and share entry points, explain the compatibility
impact, and retain the old view where compatibility is required or arrange authorized replacement
links through supported sharing controls. Do not invent aliases or edit stored grant manifests.
Definition validation alone cannot prove that external bookmarks remain usable.

A resource-policy change must include required grant/membership schemas and their admin-only
policies in the same coherent candidate. DynamoDB deployment rebuilds the compiled access plan;
JSONL stays preserved unless a separate data rewrite is explicitly requested.

Do not claim a data rewrite is safe without checking affected actual rows. A developer without
raw-data authority can identify the compatibility problem and prepare permitted definitions, but
cannot bypass access restrictions to complete a live-data migration. Report the specific remaining
admin operation when needed.
