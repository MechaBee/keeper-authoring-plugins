# Table Roles: Document Collections and Comments

A table can declare a `role`: a part Keeper understands and supplies behaviour and screens for.
The rows stay the app's own data, stored like any other table, with its row access and mutation
policy. A role fixes the field ids and types Keeper relies on; add any other fields you need.

| Role | One per | Keeper supplies |
| --- | --- | --- |
| `collection` | app | A workspace folder per row, named when the row is created. Its files are the collection's documents |
| `document` | app | One row per file in a collection's folder, kept in step with the folder: new files, renames, edits, missing files |
| `document_link` | linking record type | Links from a record to whole collections or single documents, with a role and a note |
| `comment` | commented table | Threads, replies, resolve and reopen, author stamping, locking, quoted passages |

Use roles when people and agents work on **files**: a library, a deal's documents, specifications.
Use [`doc_page`](../views/components/doc-page.md) when each record simply has one body. Keep activity
timelines (status moves, assignments) in ordinary tables; they are not comments. When the
conversation should read as one stream with those events, keep the comments in the timeline table
too and show it with [`comment_thread`](../views/components/comment-thread.md), as Issue Tracker
does.

## Collections and documents

**The folder is the content.** Every file in a collection's folder, including subfolders, belongs
to it however it got there: the app, an agent, or any workspace tool. When a collection is opened,
Keeper syncs it:

- a file without a row gets one, titled from its first `# Heading` (else its name);
- a row whose file moved is matched by content hash and follows it;
- an edited file updates the row's hash and revision, and the title while it still equals the
  file's own title (`file_title`);
- a row whose file has gone shows as **missing**. People re-attach it to the renamed file (keeping
  its comments and links) or delete it.

Sync runs as Keeper, not as the viewer, never deletes anything, and writes at most 100 rows per
opening. Hidden files and folders are ignored.

Collection folders are `docs/<app id>/<slug of the name>`, moved aside to `-2`, `-3` when taken;
they never nest. Every route that creates a collection row gets one (forms, workflows, the
collection dialog); a `folder` value supplied by them is ignored. The folder never changes when the
collection is renamed. Seed data may set `folder` explicitly.

Role tables use `primaryKey: id`. **Managed fields** are written only by Keeper: declare them
`managed: role` and `readonly: true`. They can't be required, defaulted, computed or set by
workflows (`WORKFLOW_STEP_MANAGED_FIELD`).

```yaml
table: collections
version: 1
primaryKey: id
idPrefix: coll
displayField: name
role: collection
rowAccess: {mode: all}
fields:
  - {id: id, type: text, label: ID, required: true, readonly: true}
  - {id: name, type: text, label: Name, required: true}
  - {id: description, type: textarea, label: Description}                 # optional
  - {id: folder, type: text, label: Folder, managed: role, readonly: true}
  - {id: field_definitions, type: json, label: Document fields}           # optional
  - id: features                                                          # optional
    type: multi_select
    label: Features
    options: [comments, review_status, agent_tasks]
  - {id: editor_roles, type: multi_select, label: Editors, options: [editor, admin]}  # optional
  - {id: archived, type: boolean, label: Archived}                        # optional
```

```yaml
table: documents
version: 1
primaryKey: id
idPrefix: doc
displayField: title
role: document
rowAccess: {mode: all}
validationPolicy:
  unique:
    - {fields: [body_path], message: Another document already uses that file.}   # required
fields:
  - {id: id, type: text, label: ID, required: true, readonly: true}
  - {id: collection_id, type: reference, label: Collection, referenceTable: collections, required: true}
  - {id: title, type: text, label: Title, required: true}
  - {id: summary, type: textarea, label: Summary}                         # optional; agents read it first
  - {id: body_path, type: text, label: File, managed: role, readonly: true}
  - {id: media_type, type: text, label: Media type, managed: role, readonly: true}
  - {id: content_hash, type: text, label: Content hash, managed: role, readonly: true}
  - {id: file_signature, type: text, label: File signature, managed: role, readonly: true}
  - {id: file_title, type: text, label: Title in the file, managed: role, readonly: true}
  - {id: revision, type: number, label: Revision, managed: role, readonly: true}
  - {id: properties, type: json, label: Properties}                       # optional
  - {id: review_status, type: select, label: Status, options: [draft, in_review, approved]}  # optional
  - {id: state, type: select, label: State, options: [active, archived, missing], managed: role, readonly: true}
relations:
  - {field: collection_id, references: {table: collections, field: id}, onDelete: block}
```

Collection settings people change in the app:

- `field_definitions`: the extra fields its documents carry, edited in the collection dialog
  (text, long text, number, date, choice, yes/no). Values live in each document's `properties` and
  are checked against the definitions on every write.
- `features`: `comments` shows comments, `review_status` shows a status, `agent_tasks` lets
  [AI tasks](../automation/task.md#documents) write into the collection. When the table offers
  `agent_tasks`, it is off until someone turns it on.
- `editor_roles`: narrows who may change its documents through the app.

`json` is allowed only on `field_definitions` and `properties`: plain objects and arrays up to
32 KB, never a key, label, index, relation or constraint.

**Workspace access.** Anyone who can open a collection can read its files. Workspace members can
still change files with other tools; that is intended. Every path Keeper writes is checked to stay
inside the collection's folder.

## Links

```yaml
table: opportunity_documents
version: 1
primaryKey: id
idPrefix: odoc
displayField: note
role: document_link
role_options: {record_field: opportunity_id}
rowAccess: {mode: all}
fields:
  - {id: id, type: text, label: ID, required: true, readonly: true}
  - {id: opportunity_id, type: reference, label: Opportunity, referenceTable: opportunities, required: true}
  - {id: collection_id, type: reference, label: Collection, referenceTable: collections}
  - {id: document_id, type: reference, label: Document, referenceTable: documents}
  - id: link_role
    type: select
    label: Use
    required: true
    options:                        # the app's own vocabulary
      - {value: reference, label: From the library}
      - {value: template, label: Use this structure}
  - {id: note, type: textarea, label: Why it matters}   # optional; agents read it
  - {id: position, type: number, label: Order}          # optional
```

A link points at exactly one collection or one document. A linked collection includes files added
to it later. A record that owns a collection outright uses an ordinary reference on the record, such
as `opportunities.collection_id`; [`linked_documents`](../views/components/linked-documents.md)
shows both.

## Comments

One comment table per commented table, of any kind (a document, an opportunity, an issue):

```yaml
table: opportunity_comments
version: 1
primaryKey: id
idPrefix: ocmt
displayField: body
role: comment
role_options: {target_field: opportunity_id}
rowAccess: {mode: all}
fields:
  - {id: id, type: text, label: ID, required: true, readonly: true}
  - {id: opportunity_id, type: reference, label: On, referenceTable: opportunities, required: true}
  - {id: thread_id, type: text, label: Thread}
  - {id: reply_to_comment_id, type: reference, label: In reply to, referenceTable: opportunity_comments}
  - {id: body, type: textarea, label: Comment, required: true, contentFormat: markdown}
  - {id: is_resolved, type: boolean, label: Resolved}
  - {id: author_user_id, type: text, label: Author}
  - {id: author_kind, type: select, label: Written by, options: [person, ai]}
  - {id: agent_run_id, type: text, label: AI run}
  - {id: created_at, type: datetime, label: Posted, readonly: true, computed: {kind: now, on: create, format: datetime}}
relations:
  - {field: opportunity_id, references: {table: opportunities, field: id}, onDelete: cascade}
```

On a table with the `document` role, add `anchor_quote` (textarea) and `anchor_heading` (text): a new
thread can then quote a passage, which the [document page](../views/components/document-page.md)
highlights.

Who may comment is a setting of the **commented** table:

```yaml
table: opportunities
comments:
  who_can_comment: [editor, admin]     # default editor, developer, admin; add viewer to let readers comment
  who_can_resolve: [editor, admin]     # default: the commenters
  locked_when: {field: stage, equals: lost}
```

Keeper writes comments itself: it starts threads, keeps a reply in the thread of the comment it
answers, stamps the author from the session, and sets resolved on a thread's first comment. These
rules apply instead of the comment table's own edit rights, so a reviewer who can't edit the record
can still comment when their role is listed. Share-link visitors read only. Admins may always
comment. Commit workflows of AI tasks may create comments like any table.

## Verification

`SCHEMA_ROLE_INVALID` names the missing or mistyped role field, a second table for a single role,
a role reference to the wrong kind of table, or anchors on a target without a body.
