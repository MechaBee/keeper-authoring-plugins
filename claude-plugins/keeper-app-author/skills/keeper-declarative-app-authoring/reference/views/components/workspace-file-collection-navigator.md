# `workspace_file_collection_navigator` Component

Use for provider-grouped workspace file lists:

```yaml
kind: workspace_file_collection_navigator
data_source: grouped_documents
navigation:
  detail_view: document-detail
  path_query_param: path
empty_message: No document groups found.
```

Required: source resolving to `workspace_file_collection_groups` and `navigation.detail_view`.
Optional: `title`, `description`, `empty_message`, `path_query_param`, and
`preserve_route_keys: "*"|[...]`.
