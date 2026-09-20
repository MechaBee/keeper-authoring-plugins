# `workspace_file_collection` Component

Use for a workspace file list:

```yaml
kind: workspace_file_collection
data_source: documents
search: {enabled: true, placeholder: Search files}
navigation:
  detail_view: document-detail
  path_query_param: path
  preserve_route_keys: "*"
empty_message: No files found.
```

Required: source resolving to `workspace_file_collection` and `navigation.detail_view`. Optional
component keys are `title`, `description`, `search`, and `empty_message`. Search contains `enabled`
and `placeholder`. Navigation optionally changes the path query key and preserves `"*"` or selected
route keys.
