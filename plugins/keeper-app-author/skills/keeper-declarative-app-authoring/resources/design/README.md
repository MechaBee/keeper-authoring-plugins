# Keeper Design Decisions

Read this after discovery and `contract_read`, and **before** opening leaf contracts. These files
decide *which* construct to reach for and *why*; they never restate grammar. Every decision ends in
a pointer to the authoritative contract, and the live `contract_read` output and validation
diagnostics override anything here when they differ.

Make the decisions in this order, then read only the exact contracts those decisions require:

| Decide | Read |
| --- | --- |
| App archetype, the component for each view, and how to organize a growing app's navigation (menus, tabs) | [`shape-and-views.md`](shape-and-views.md) |
| Storage engine (JSONL vs. DynamoDB), table modeling, read access, and whether you need write/validation/index policy | [`data-and-access.md`](data-and-access.md) |
| Direct action vs. workflow vs. agent vs. compute | [`automation.md`](automation.md) |

Then, before `app_validate`, run the design-fitness gate in [`review.md`](review.md).

## Selection principles

- **Pick the smallest shape that satisfies the brief.** Do not add a board, dashboard, extra table,
  workflow, or policy the brief did not ask for. A valid app that does more than requested is a
  worse design, not a more sophisticated one.
- **Anchor on at most one composition example.** The pattern and example index in
  [`../example-patterns.md`](../example-patterns.md) maps each app shape to a runnable example; read
  every descriptor of the one you pick, and adapt only domain identifiers and labels.
- **The two advanced examples are mutually exclusive starting points.**
  [`../operations-desk`](../operations-desk/README.md) (operational coordination) and
  [`../effective-dated-rules`](../effective-dated-rules/README.md) (historical "valid on date"
  semantics) are combined only when the brief independently requires both.
- **Reference is authoritative over judgment.** When a decision here and a leaf contract seem to
  disagree, the contract wins; report the discrepancy rather than following this file.
