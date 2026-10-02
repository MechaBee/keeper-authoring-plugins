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

Required: source resolving to `workspace_file_collection`, plus `navigation.detail_view` or
`selection`. Optional component keys are `title`, `description`, `search`, `presentation`,
`selection`, and `empty_message`. Search contains `enabled` and `placeholder`. Navigation optionally
changes the path query key and preserves `"*"` or selected route keys.

## A record's own folder

Bindings cannot build a glob, so a record cannot hold a `pattern`. Give the source `folder` instead
of `pattern` and bind it to the record's folder field — typically a text field with
`input.variant: workspace_folder` (see [fields](../../schema/fields.md)):

```yaml
files:
  kind: provider_resource
  provider: workspace
  resource: file_collection
  params:
    folder: {bind: source.proposal.record.folder_path}
  depends_on: [proposal]
```

`folder` lists everything beneath that folder (`recursive` defaults to `true`), and the tree names
files relative to it. A record with no folder yet shows **No folder is linked yet.** instead of an
error; a value that escapes the workspace (`..`) or contains a glob reports that the folder could
not be opened, without echoing the path. Use `selection.reconcile: first_available` so that moving
to another record never leaves the previous record's file in the preview.

## Hand off to the assistant

`open_in_assistant` adds an **Ask the assistant** button that opens chat in a new tab, on the app's
own agent and workspace, with a message already typed. It only navigates: nothing is sent until
the person sends it, so an app still never generates documents itself — the assistant does, in
chat, where people can steer it.

```yaml
open_in_assistant:
  label: Ask the assistant            # optional
  prompt: "I'm working on the {customer} proposal. Its documents are in {folder}."
  values:
    customer: {bind: source.proposal.record.customer}
```

`{folder}` is the listed folder's workspace path (what the assistant needs to find the files) and
`{folder_name}` its name; every other `{key}` must be declared in `values`, which take ordinary
state/route/source/context bindings. A value that does not resolve leaves its placeholder empty.
The prompt is capped at 1,000 characters. The button is hidden while no folder is linked, when the
listing failed, and for share-link viewers, who have no chat to hand off to.

## Folder tree

`presentation: tree` groups files by folder instead of listing them flat. Names are shown relative
to the pattern's static folder — the segments before its first glob — so
`Proposals/Acme Logistics/**` lists `01 requirements/call-notes.md` under an
**01 requirements** folder and never prints the workspace path. Folders sort before files and
names sort naturally (`2 notes` before `10 notes`), so numbered folders keep their authored order.
Folders start open and can be collapsed; a search shows every match with its folders open. The
default `list` keeps the flat card list. Pair `tree` with `recursive: true` on the source, or the
listing has no subfolders to group.

## Preview beside the list

`selection` makes a click select a file instead of leaving the view. The selected path is written
to the named view state key; bind a `workspace_file` source to it and place a
`workspace_file_detail` next to the collection:

```yaml
state:
  selectedPath: ""

data_sources:
  documents:
    kind: provider_resource
    provider: workspace
    resource: file_collection
    params: {pattern: "Proposals/Acme Logistics/**", recursive: true}
  selected_file:
    kind: provider_resource
    provider: workspace
    resource: file
    params:
      path: {bind: state.selectedPath}

components:
  files:
    kind: workspace_file_collection
    data_source: documents
    presentation: tree
    selection:
      state_key: selectedPath
      reconcile: first_available
    navigation:
      detail_view: document-detail   # optional here: a per-file "open on its own page" link
  preview:
    kind: workspace_file_detail
    data_source: selected_file
    mode: read_only
    empty_message: Select a file to preview it.

layout:
  kind: split
  direction: horizontal
  sizes: [2, 3]
  children:
    - component: files
    - component: preview
```

The `state_key` must be declared under the view's `state`. Map it through `route_state` to make
the selected file deep-linkable. With no file selected the `file` source resolves to an empty file,
so the preview shows its empty message rather than failing the view.

`reconcile` decides what happens when the selected path is not in the listing — first open, a
bound folder that changed, a deleted file: `none` (default) keeps it, `first_available` selects the
first file in display order, and `clear` empties the selection. A listing that failed to load never
reconciles, so an unavailable folder cannot erase a deep link. Use `first_available` when the
collection's folder follows another selection, so the preview never shows a file from the
previous folder.

When both `selection` and `navigation` are set, a click selects and each file also offers a link
to the detail view. On small screens the split stacks, so the preview sits below the list.
