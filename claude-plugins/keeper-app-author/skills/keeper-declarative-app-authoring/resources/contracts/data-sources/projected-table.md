# `projected_table` Data Source

Use only for a read-only join, derived column, or richer filter that plain table queries cannot
express:

```yaml
order_overview:
  kind: projected_table
  schema: order_overview
  from: {source: orders, as: order}
  lookups:
    - {source: customers, as: customer, local: order.customer_id, foreign: id, mode: left}
  fields:
    - field: id
      value: {path: order.id}
    - field: customer_name
      value:
        op: coalesce
        values: [{path: customer.display_name}, {literal: Unknown customer}]
```

Required: `schema`, `from`, and a mapping for every output schema field. Optional: `lookups`,
`where`, `sort`, `limit`, and `refresh_on`. Aliases are unique safe ids and cannot be `state`,
`route`, `source`, or `context`. `path` reads an alias; `bind` reads runtime state/route/source/context.

Compare operators are `equals`, `not_equals`, `lt`, `lte`, `gt`, `gte`, `in`, `not_in`,
`contains`, `not_contains`, `starts_with`, `ends_with`, `between`, `is_null`, and `is_not_null`.
Projected scripts are synchronous JavaScript receiving only declared `input` and `helpers`; no
ambient `fetch`, `process`, or `require`.

When a filter's initial empty or `all` value means "show everything", do not bind the sentinel to a
plain table equality filter. Pass the filter into a projected script and bypass it explicitly.
With multiple optional selectors, the predicate must consume and bypass each sentinel correctly;
mentioning a key only in `refresh_on` or script `input` is insufficient.

Projected output is read-only: no direct editable `record_detail`; no board group moves; collection
create/delete/ordering/pinning/actions must be absent and embedded detail must be read-only.
