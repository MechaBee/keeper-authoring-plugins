# Mutation Policy Reference

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
