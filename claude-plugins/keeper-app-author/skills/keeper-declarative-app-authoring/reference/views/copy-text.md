# Copy Buttons (`copy_text`) And Text Templates

A copy button shows a text template, filled in from the screen's values, and copies it. The person
sees the whole text before anything reaches the clipboard. Use it for text a person carries to
another tool: an agent prompt, a CLI command, an email or chat snippet, a ticket reference.

The text lives in the app folder as `text_templates/{template}.txt`; the button names the template
and binds its values.

## View Bar button

A top-level `actions[]` item:

```yaml
actions:
  - id: pick_up_prompt
    kind: copy_text
    label: Pick up in a session
    template: pick-up-prompt          # text_templates/pick-up-prompt.txt
    description: Paste into a coding-agent session connected to this workspace.
    values:
      project_id: {bind: state.project_id}
      project_slug: {bind: source.project.record.slug}
      workspace: {bind: context.workspaceId}
      app: {bind: context.appId}
    visible_when:
      - {bind: source.project.record.status, operator: not_equals, value: archived}
    display: code                     # code (default) | text
    placement: inline                 # inline (default) | overflow
    appearance: secondary             # default | secondary (default when omitted)
```

Required: `id`, `kind: copy_text`, `label`, `template`. Optional: `description` (shown under the
dialog title), `values`, `display`, `visible_when`, `placement`, `appearance`. `placement: overflow`
moves the button into the view bar's **More actions** menu.

`values` keys are placeholder names (`[A-Za-z_][A-Za-z0-9_]*`, at most 20). Each value is a
primitive or a binding on `state`, `route`, `source` or `context`; `source.*` must name a declared
data source. `visible_when` uses the bound-condition shape of action-set sources
(`bind`, `operator: equals|not_equals|is_empty|is_not_empty`, primitive `value`); every condition
must hold for the button to show.

## Record button

On a `record_detail` (standalone, or a table's `detail`), an inline `actions[]` entry may carry
`copy_text` instead of `action`. `record.*` binds to the record the detail shows:

```yaml
detail:
  table: domains
  data_source: selected_domain
  actions:
    - id: start_project_prompt
      label: Start a project here
      appearance: secondary
      copy_text:
        template: new-project-prompt
        description: Paste into a coding-agent session.
        values:
          domain_id: {bind: record.id}
          domain_name: {bind: record.name}
          workspace: {bind: context.workspaceId}
      visible_when:
        - {bind: record.status, operator: not_equals, value: retired}
```

Exactly one of `action` and `copy_text`. `copy_text` takes `template`, `description`, `values` and
`display`; `visible_when` belongs to the entry and is accepted only beside `copy_text`. `confirm` is
not used: the dialog already shows the text first. The binding roots add `record`.

Copying changes nothing, so copy buttons stay visible in read-only details, read-only views and
share-link views. Values resolve when the button is clicked, from the record and state on screen.

## Template files

- Path: `text_templates/{template}.txt`, `[A-Za-z0-9_-]+`, flat (no subfolders). Keep each under
  16 KB; a larger file is cut off when copied.
- The file is copied exactly as written and never rendered, so write plain text. Prefer one line
  per paragraph or list item: the dialog and the paste target reflow it, while hard wraps at a fixed
  width read ragged on narrow screens.
- Placeholders are `${name}`. Only names the button declares in `values` are replaced; any other
  `${...}`, such as a shell `${HOME}`, stays as written. `$${name}` is a literal `${name}`.
- A declared value that is empty renders as `<name>`, and the dialog asks the reader to fill it in.
- Everyone who can open the app can read every template, including share-link recipients. Never put
  secrets or private operational detail in one.

Templates are **content, not definition**, like [guide documents](../application/user-guide.md):
they travel with download, upload, app copy and marketplace copy, but are excluded from the
definition revision. Editing a template never needs a redeploy, never blocks a DynamoDB app, and
shows to readers at once. They are still part of a `replace` candidate: omitting an installed
template deletes it, and that deletion must be acknowledged like any other destructive path.

## Diagnostics

| Code | Severity | Meaning |
| --- | --- | --- |
| `TEXT_TEMPLATE_MISSING` | error | A button names a template the app does not contain. |
| `TEXT_TEMPLATE_PLACEHOLDER_UNFILLED` | warning | The file uses `${name}` the button does not fill; it is copied as written. |
| `TEXT_TEMPLATE_VALUE_UNUSED` | warning | The button fills a value the file never uses (usually a renamed placeholder). |
| `TEXT_TEMPLATE_UNUSED` | warning | A template file no button uses. |
| `TEXT_TEMPLATE_EMPTY` | warning | The file is empty. |
| `TEXT_TEMPLATE_TOO_LARGE` | warning | The file exceeds 16 KB. |

Status checks verify presence from inventory; explicit `app_validate` also checks contents. Agents
reading a view through `app_view_read` do not see copy buttons: they reach the same work through
procedures.

For when a copy button is the right tool and how to write an agent prompt, see
[copy buttons](../../design/copy-text.md).
