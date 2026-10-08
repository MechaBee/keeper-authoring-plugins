# Proposal Studio — Document Collections and Exposed AI Tasks

A sales app built for connected agents, on Keeper's document collections. The team curates a
library, briefs each opportunity, discusses it, and links the documents that matter. Then a person
asks their own agent (Claude Code or Codex with the Workspace Content plugin) to **draft** or
**revise** a document. Both tasks are exposed with `exposure: {mcp: true}`: Keeper resolves exactly
what the agent may read, validates what it returns, writes the document, and saves the rest through
a commit workflow. The agent does the writing with its own model. It runs on JSONL storage; the
manifest omits `storage`.

Use it as the reference for [table roles](../../reference/schema/roles.md): a collection is a
workspace folder, its files are its documents, and Keeper keeps a row per file.

## Tables

| Table | Role | What it holds |
| --- | --- | --- |
| `customers` | | Who the opportunities are for. |
| `opportunities` | | The hub: stage, value, owner, the brief (needs, requirements, decision criteria) and `collection_id`, its own collection. `customer_name` is copied so `referenceLabelTemplate` names the customer in the label an agent picks from. Has a `comments:` block. |
| `collections` | `collection` | The library's shelves and each opportunity's own folder. `in_library` (app data) keeps opportunity collections out of the Library view. |
| `documents` | `document` | One row per file in a collection's folder, kept by Keeper: path, hash, revision, missing state. People edit title, summary and status. Has a `comments:` block. |
| `opportunity_documents` | `document_link` | Library documents and whole collections linked to an opportunity, as "From the library" or "Use this structure", with why they matter. |
| `opportunity_comments` | `comment` | The opportunity's discussion. AI handovers land here. |
| `document_comments` | `comment` | Review threads on a document, which can quote a passage. AI change notes land here. |

There are no workflows for comments, links or new documents: Keeper supplies them for the role
tables. The app's own workflows are `create_opportunity` (which also creates the opportunity's
collection), `change_customer` and the two commit workflows.

## Files

Every document is an ordinary Markdown file outside `keeper/`, so any agent or tool can reach it:

```
docs/proposal-studio/
  company/ product/ sales/ templates/       library collections
  <customer>-<opportunity>/                 an opportunity's collection
    files/<slug>.md                         material about the deal
    working/<slug>.md                       documents written for it, by people or agents
```

Keeper names a new collection's folder after the collection. A file written into a folder by
anything becomes a document the next time the collection is opened.

## The two tasks

| Task | Input the agent picks | Reads | Returns | Saved |
| --- | --- | --- | --- | --- |
| [`draft_document`](agents/draft_document.yaml) | An opportunity, then a brief | Opportunity, customer, discussion, and a `documents` context: the opportunity's own collection and every linked document and collection, with the link notes | `draft` (title, summary and the Markdown body) and a `handover` comment | `on_result`: Keeper writes the draft into the opportunity's `working/` folder, then [`commit_drafted_document`](workflows/commit_drafted_document.yaml) marks it Draft and posts the handover |
| [`revise_document`](agents/revise_document.yaml) | A document, then instructions | The document, its current text, its review threads (quotes, replies, resolved state) and the opportunity brief | `revision` (summary and the new body) and a `change_note` | `on_approval`: accepted from the document page's run card, which shows the changed lines; Keeper writes the new text onto the same file, then [`commit_document_revision`](workflows/commit_document_revision.yaml) posts the change note |

A revision is accepted only if the document still has the text the agent read; otherwise acceptance
is refused with what changed, so a person's edit is never silently replaced. Agents can write only
into collections with the `agent_tasks` feature on: each opportunity's collection has it, the
library's don't, so revising a library document is refused when the run is prepared.

## Views

- **Opportunities** (default): every opportunity, by expected close.
- **Opportunity** (hidden, `opportunityId`): the brief, the discussion, details, agent drafts in
  progress, and its documents (`linked_documents`): its own collection with New and Upload, and the
  linked library documents with **Link…**.
- **Document** (hidden, `documentId`): `document_page` with Read, Edit and Focus, select-to-comment,
  and "Used by"; the `agent_task_runs` review card for revisions; review threads (`comments`).
- **Library**: library collections (`collection_list`) and the chosen one's documents
  (`collection_view`).
- **Setup → Customers**.

## Try it

1. Install the app files (everything except `README.md` and `workspace/`) through the normal
   [author-and-update](../../workflows/author-and-update.md) and [apply](../../workflows/apply.md)
   workflows. The seed in `data/` holds four customers, four opportunities with their collections,
   the library collections and documents, links and a few discussion and review threads.
2. Upload `workspace/docs/proposal-studio/` to the same workspace root as ordinary workspace
   content. The seed's document rows point at these files; they are not part of the app package.
3. In an agent with the Workspace Content plugin, ask: "In Proposal Studio, draft a proposal for the
   Northwind cold-chain opportunity. Lead with the monitoring service." The agent lists tasks,
   picks the opportunity from `app_task_input_options`, prepares a run, reads its documents and
   submits `draft` and `handover`.
4. Open the opportunity: the draft is under Documents and the handover is in Discussion. Comment
   on a passage, ask the agent to revise the document, and accept the revision on the document
   page.

Read the [table roles](../../reference/schema/roles.md), the [task reference](../../reference/automation/task.md)
(`documents` context and document outputs), the collection components
([`collection_list`](../../reference/views/components/collection-list.md),
[`collection_view`](../../reference/views/components/collection-view.md),
[`document_page`](../../reference/views/components/document-page.md),
[`linked_documents`](../../reference/views/components/linked-documents.md),
[`comments`](../../reference/views/components/comments.md)) and
[`agent_task_runs`](../../reference/views/components/agent-task-runs.md) before adapting it.
For a managed (Keeper-run) task instead of an exposed one, start from the
[AI task pattern](../patterns/ai-task.md).
