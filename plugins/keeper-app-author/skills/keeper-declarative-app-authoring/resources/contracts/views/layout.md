# View Layout Contract

Layout nodes are a component leaf, a stack, or a split.

```yaml
layout:
  component: records_table
```

```yaml
layout:
  kind: stack
  gap: md
  children:
    - component: controls
    - component: records_table
```

```yaml
layout:
  kind: split
  direction: horizontal
  sizes: [2, 1]
  children:
    - component: records_table
    - component: record_detail
```

`gap` is `sm`, `md`, or `lg`. Split `direction` is `horizontal` or `vertical`. When present,
`sizes` contains one positive number per child. Every leaf references a key from `components`.
