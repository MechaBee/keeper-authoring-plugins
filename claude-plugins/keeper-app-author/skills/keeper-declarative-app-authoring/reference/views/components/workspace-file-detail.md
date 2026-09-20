# `workspace_file_detail` Component

Use for one workspace text file, not a JSONL row:

```yaml
kind: workspace_file_detail
data_source: selected_file
mode: editable
show_path: true
content_format: markdown
save_label: Save document
open_in_workspace_editor: {enabled: true, label: Open editor}
delete: {enabled: true, label: Delete, confirm: "Delete this file?"}
```

Required: source resolving to `workspace_file`. Optional: `title`, `description`,
`mode: editable|read_only`, `show_path`, `content_format: plain_text|markdown`, `empty_message`,
`save_label`, editor control, and delete control.
