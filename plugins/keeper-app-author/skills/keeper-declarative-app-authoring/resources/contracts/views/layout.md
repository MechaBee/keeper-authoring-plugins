# View Layout Contract

Layout nodes are a component leaf, a stack, a split, or tabs.

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

```yaml
layout:
  kind: tabs
  state_key: active_tab   # optional
  tabs:
    - id: members
      label: Members
      icon: users          # optional lucide name
      layout:
        component: members_table
    - id: access
      label: Project access
      layout:
        kind: stack
        gap: md
        children:
          - component: user_access_table
          - component: group_access_table
```

`gap` is `sm`, `md`, or `lg`. Split `direction` is `horizontal` or `vertical`. When present,
`sizes` contains one positive number per child. Every leaf references a key from `components`.

A `tabs` node groups sibling surfaces behind a switcher. Each tab needs a unique `id`
(`[A-Za-z0-9_-]+`) and a `label`; `icon` is an optional lucide name (same vocabulary as the app
`icon`). Each tab's `layout` is a full layout node, so tabs nest stacks, splits, or further tabs.
Only the active tab's subtree is rendered.

Give `state_key` to bind the active tab to view state: declare that key under the view's `state`,
optionally map it through `route_state` for deep links, and switch tabs programmatically with a
`set_state` action. Omit `state_key` for an ephemeral switcher that resets on reload.

Tabs are purely visual: every tab's `data_sources` still load when the view opens, so switching is
instant but nothing is deferred. Reach for tabs to organize related, lightweight surfaces on one
screen. When surfaces are heavy or independent — each wanting its own route, lazy data, and access
gate — give them separate views instead of stacking their data behind tabs.
