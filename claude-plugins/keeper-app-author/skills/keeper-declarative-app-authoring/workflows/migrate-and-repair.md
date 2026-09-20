# Migrate and Repair

Use for changes affecting stored rows or authorization, storage conversion, and deployment repair.
Resolve the target and `effectiveAccess` through [Inspect and open](inspect-and-open.md). Read the
current runtime contract, including `all` when conversion/repair capabilities are not exposed as
focused topics. Use only tools advertised by that server.

## Classify the impact

Separate a definition edit from a stored-data rewrite and an authorization change. A view ID rename
does not rewrite rows but can break issued share links and saved URLs; review the
[identity compatibility rules](../reference/schema/evolution.md#view-identity-and-existing-links).
A label change can retain the ID. Adding an optional field
may be compatible with retained data. Required fields, removed select values, field/table renames,
primary-key changes, and new aggregate constraints need compatibility analysis.

Use [schema evolution](../reference/schema/evolution.md) for the affected operation. Use
[app security](../reference/security/index.md) for access changes. Preserve live data unless its
replacement is explicitly part of the request. Installed validation and deployment diagnostics can
establish incompatibilities without granting the author permission to read raw data.

## JSONL data migration

When inspection or rewriting of live JSONL is necessary, require explicit user intent and the
corresponding app-admin raw-data/replacement capability. A definition-only developer must not
download data or weaken a policy to make a migration possible. Report the capability gap and the
specific admin action required.

For an authorized rewrite, read with `contentScope: "full"`, inspect affected stored rows, and
retain preimages or another recovery route. Build the complete coherent schema/data/reference
change, validate with data, and describe expected additions, transformations, and removals. Follow
[Apply](apply.md) with `dataMode: "replace"` and `mode: "replace"`. Do not claim a rewrite is safe
without checking the affected actual rows.

## DynamoDB definition changes

Use definition-only candidates and [Apply](apply.md). Do not export or submit JSONL as a way to
migrate DynamoDB rows. Logical constraints and access/query paths may require deployment backfill;
review the compiled impact and diagnostics. If the request needs a data transformation that the
advertised tools cannot perform, report that unsupported operation rather than inventing physical
storage edits.

## JSONL-to-DynamoDB conversion

An ordinary upload cannot change an installed app's engine. For an explicit conversion request:

1. Obtain the current definition revision from `app_get`. Conversion requires definition editing,
   deployment, raw-data access, and data-replacement capabilities.
2. Call `app_storage_conversion_prepare` with the target and `expectedDefinitionRevision`.
   Optional `performance` is `standard` or `high_throughput`. The server reads and pins the source
   data itself; the tool does not accept an `expectedDataRevision` parameter.
3. Review impact and diagnostics. When preparation succeeds and the reviewed impact is authorized,
   call `app_storage_conversion_start` with the exact returned `conversionId` and `deploymentId`.
   Do not substitute a different definition or edit the prepared conversion.
4. Follow [Job control](jobs.md) for the returned `job.jobId`; open for writes only after completion.

The conversion preserves its pinned source until forward-only cutover. DynamoDB-to-JSONL conversion
is unsupported. Do not reproduce conversion with a manifest edit or a manual record copy.

## Deployment repair

Use repair only when the installed DynamoDB app reports an inconsistent deployment and the user
asks to repair it. Call `app_deployment_repair_prepare` with the target and current
`expectedDefinitionRevision`. It returns signed evidence, diagnostics, and impact without changing
canonical records, registry state, or the live pointer. If preparation succeeds, review that impact
and call `app_deployment_repair_start` within the user's authorization, passing the returned
`repairId`, `deploymentId`, and pinned `expectedDefinitionRevision`. Follow [Job control](jobs.md)
for its returned `job.jobId`. A stale repair requires new preparation rather than altered evidence.

Repair rebuilds disposable derived paths and republishes the compiled plan. It must not rewrite
canonical records. Never edit registry entries, storage identities, physical keys, or publication
pointers. Retry or cancellation uses the named tools and state rules in [Job control](jobs.md).
Unrelated app errors belong in ordinary inspection and definition repair.
