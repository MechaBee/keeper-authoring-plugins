# `markdown_panel` Component

```yaml
kind: markdown_panel
title: Summary
data_source: selected_record
field: summary_md
empty_message: No summary yet.
```

Required: record-shaped `data_source`. Optional: `title`, `description`, schema `field`, and
`empty_message`. Use a markdown-containing record field; do not assume arbitrary table/provider
sources render markdown.
