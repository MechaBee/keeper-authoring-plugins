# Pattern: Board

Selected via [App design](../../design/app-design.md). Read the
[`record_board` reference](../../reference/views/components/record-board.md), then consult the relevant descriptors in the complete
[`board-example/`](../board-example/README.md), keeping these board rules explicit:

- The group field is a writable select field on the component table.
- Every explicit group value matches one select option value.
- Group changes are enabled only for a mutable table source.
- Projected/provider sources remain read-only boards.
- Search, archiving, limits, and completion markers are included only when requested.
