# DynamoDB Authoring

Read this only after `contract_read` when a task creates, changes, converts, or repairs a
DynamoDB-backed Keeper app. The live MCP contract and validation diagnostics override this
reference when they differ.

## Author logical intent only

For a new DynamoDB app, declare `storage.engine: dynamodb` in `app.yaml`. `storage.performance`
may be `standard` or `high_throughput`; omit it unless the approved brief requires that scale
intent. A query may declare `performance.intent` and an optional `maxFallbackRecords` bound. Do not
invent physical table names, keys, indexes, shard counts, capacity, or registry entries.

When a table needs an indexed access capability, declare logical `queryPaths` on its schema. Views,
workflows, agents, and API calls discover compatible READY paths at runtime; those consumers do not
own Access records and changing them alone does not redeploy storage. Add paths gradually as bounded
fallback telemetry demonstrates the need. Keeper continues to own mandatory policy and relation
paths and every physical Access-entry detail.


Cross-record write rules must use a supported logical schema constraint. For grouped sums, declare
`constraints.kind: aggregate_bound`; Keeper compiles it to an atomic per-group accumulator and
backfills that guard during deployment. Do not use `validationPolicy.check` plus `query_records`
for a write invariant: a read-then-write script has no portable concurrency meaning.

Keep DynamoDB candidates definition-only: they do not contain `data/*.jsonl`. Run the normal
`app_validate`, `app_diff`, `app_upload_prepare`, and reviewed `app_upload_apply` workflow. Prepare
returns the exact compiled impact without publishing it. Apply accepts an immutable deployment job,
not a launch link. Poll `app_job_status` until `COMPLETED`, then call `app_url_get`.

If the job fails, report its diagnostics and state. Retry only after the user asks to retry the
same diagnosed job; a changed candidate always requires a fresh validation, diff, and prepare.

## Convert an existing JSONL app only on explicit request

An ordinary upload cannot change an installed app's storage engine. For an explicit, authorized
JSONL-to-DynamoDB migration, use the contract-advertised conversion prepare tool with the current
definition and data revisions from `app_get`. Review its diagnostics and impact, then start the
exact prepared conversion only after user approval. The conversion job preserves the pinned source
until its forward-only cutover; do not try to reproduce it through a hand-written manifest or data
upload. DynamoDB-to-JSONL conversion is unsupported.

## Repair only an inconsistent deployment

When installed-app status reports an inconsistent DynamoDB deployment, use the contract-advertised
repair prepare tool to obtain evidence and impact. Start that exact repair only after approval.
Repair may rebuild disposable derived paths and republish the compiled plan; it must never rewrite
canonical records or be replaced by manual edits to storage control data.
