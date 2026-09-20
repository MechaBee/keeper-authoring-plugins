# Storage

Choose an engine for new apps from expected concurrency and query needs. Preserve an installed
app's engine during ordinary definition work.

- **JSONL:** default when `storage` is omitted. Suitable for prototypes and low-concurrency apps.
  Requested initial seed records may travel in the candidate as `data/*.jsonl`.
- **DynamoDB:** use for concurrent team writes and queries that need maintained indexed paths.
  Candidates are definition-only and contain no JSONL. Keeper owns physical storage layout.

Declare new DynamoDB app intent in `app.yaml`:

```yaml
storage:
  engine: dynamodb
  performance: high_throughput # optional; standard is also supported
```

`performance` is valid only with DynamoDB. Omit it unless that scale intent is required. Never
author physical table names, keys, indexes, shards, capacity, registry records, or Access entries.
Add logical [query paths](query-paths.md) when an indexed query needs them or bounded-fallback
telemetry demonstrates the need. Query performance intent is documented in
[table sources](../views/data-sources/table.md).

Use logical [aggregate constraints](../schema/constraints.md) for cross-record bounds. Keeper owns
their transactional enforcement; a script that reads sibling rows and then writes is not a portable
concurrency guarantee. `query_records` validation checks are not supported for DynamoDB writes.

Definition deployment follows [Apply](../../workflows/apply.md), including job advancement and launch.
Installed JSONL-to-DynamoDB conversion and inconsistent-deployment repair follow
[Migrate and repair](../../workflows/migrate-and-repair.md). An ordinary upload cannot change an
installed engine, and DynamoDB-to-JSONL conversion is unsupported.
