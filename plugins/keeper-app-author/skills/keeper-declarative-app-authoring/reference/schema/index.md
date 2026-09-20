# Schema

| Need | Read |
| --- | --- |
| Table identity and required keys | [Table](table.md) |
| Field types, defaults, coercion, timestamp computation | [Fields](fields.md) |
| References and deletion behavior | [Relations](relations.md) |
| JSONL naming and record mutations | [JSONL](jsonl.md) |
| Unique values and validation checks | [Validation](validation.md) |
| Atomic grouped-sum bounds | [Constraints](constraints.md) |
| Compatibility and schema changes | [Evolution](evolution.md) |

Use [row access](../security/row-access.md) for version-2 visibility and
[mutation policy](../security/mutations.md) for restricted writes. Use
[query paths](../storage/query-paths.md) only when a query needs an indexed capability.
Schema filenames, `table`, and any corresponding JSONL filename stem must agree.
