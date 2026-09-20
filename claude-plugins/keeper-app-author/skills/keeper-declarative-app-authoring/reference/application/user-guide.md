# App User Guide Reference

An app may ship an end-user guide: markdown documents under `docs/`, declared by `app.yaml`.

```yaml
docs:
  entry: docs/guide.md            # required whenever `docs` is present
  title: How to use this app      # optional; default "User guide"
  entry_title: Start here         # optional; label for the entry document
  summary: Log hours, submit a week, get it approved.   # optional, <= 240 chars
  show_on_first_open: true        # optional; open the guide once per reader
  topics:                         # optional; the entry document is always first
    - {id: week,       title: Filling your week,        path: docs/week.md}
    - {id: submitting, title: Submitting and approvals, path: docs/submitting.md}
```

Rules:

- Documents are flat markdown files: `docs/{name}.md`, `[A-Za-z0-9_-]+`. No subdirectories.
- Topic ids are safe identifiers, unique, and may not be `entry` — that id names the entry document,
  so `?guide=entry` always resolves. Ids are addressable in links; keep them stable once published.
- Two topics may not point at the same document, and the entry document counts.
- Keep each document under 64 KB; the whole app is still capped at 2 MB and 256 files.
- Declared documents must exist (`KEEPER_APP_DOCS_MISSING`), and a `docs/*.md` file nothing declares
  is unreachable in the app (`KEEPER_APP_DOCS_UNDECLARED`).
- Documents may link to each other by file name (`[Setting up](getting-started.md)`) and within
  themselves by heading anchor (`[the rules](#the-rules)`); the reader resolves both in place. A
  relative link naming no declared document does nothing — write `http(s)` links for anything
  outside the guide, which open in a new tab.

Guide documents are **content, not definition**: they travel with download, upload, app copy, and
marketplace copy, but they are excluded from the definition revision, so editing help text never
requires a redeploy and never blocks a DynamoDB app. They are still part of the candidate — a
`replace` candidate that omits an installed `docs/*.md` deletes it, and the upload will require that deletion
to be acknowledged like any other destructive path.

Everyone who can open the app can read the guide, including share-link recipients. Keep internal
detail out of it.

Write the guide for the people who use the app; see
[guide design](../../design/user-guide.md) for what belongs in one.
