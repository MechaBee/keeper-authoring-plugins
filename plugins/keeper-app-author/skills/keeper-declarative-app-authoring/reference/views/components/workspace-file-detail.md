# `workspace_file_detail` Component

Use for one workspace file, not a JSONL row:

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

## Files that are not text

The file's kind comes from its name. Markdown and text files are read and edited as before; any
extension the runtime does not know as binary is still treated as text. PDFs, images (`png`,
`jpg`, `gif`, `webp`, `svg`, …) and known binary formats (office documents, archives, media) are
never read as text:

- a **PDF** opens in the browser's PDF viewer inside the card, with a **Download** button;
- an **image** is shown inline;
- anything else is a file card — name, size, date — with **Download**.

Nothing needs to be declared: the same component previews whichever file its source resolves to.
The bytes come from the runtime for this component only — it re-resolves the component's own
source under the viewer's access, so a preview can never fetch a path the view would not show —
and they are served as a typed, sandboxed attachment, never as a page. Files over 25 MB say so and
point to the workspace. Share-link viewers see the file card without a download.
