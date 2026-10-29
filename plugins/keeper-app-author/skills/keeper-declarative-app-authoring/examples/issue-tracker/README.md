# Issue Tracker — Comprehensive Example

A GitHub Issues–style tracker for teams, built only from the current Keeper runtime. It runs on
JSONL storage; the manifest omits `storage`.

## What's in it

| View | For | Built from |
| --- | --- | --- |
| [Issues](views/issues.yaml) (default) | Everyone | `record_table` over a projection; Open/Closed filters, search and CSV export; Type and wrapping Created by columns by default |
| [Issue](views/issue.yaml) (hidden, `?issueId=`) | Everyone | Editable `record_detail`; comment and event timeline; two-column details with Change type and Move on board dialogs; sub-issue and link lists; state-aware Close/Reopen |
| [Board](views/board.yaml) | Everyone | `record_board` per project: saved rank, WIP limit, facets, side-pane detail, and movement activity |
| [My work](views/my_work.yaml) | Everyone | Tabs: assigned to me, opened by me, open issues nobody owns |
| [Agent queue](views/agent_queue.yaml) | Everyone and connected agents | Tabs: issues ready for the Agent, and those waiting on people; exposed to MCP |
| [Document](views/document.yaml) (hidden, `?documentId=`) | Everyone | `document_page` with passage comments, for the issue's documents |
| [Milestones](views/milestones.yaml) | Everyone | Progress from two `aggregate_table` counts joined by a projection |
| [Setup access](views/setup_access.yaml) and the other `setup_*` views | Admins | Projects; labels, types and priorities; issue templates; optional assignment profiles, groups and project grants |

Fifteen workflows own every change that should leave a trace: `open_issue`, `close_issue`,
`reopen_issue`, `add_comment`, `assign_issue`, `set_labels`, `set_milestone`, `set_issue_type`,
`move_issue_on_board`, `record_board_move`, `link_issues`, `unlink_issues`, `transfer_issue`,
`lock_conversation` (admins) and `delete_issue` (admins), plus `hand_back_to_agent`.
Seven [AI tasks](../../reference/automation/task.md), exposed to connected agents as procedures,
let a coding agent work an issue. Four work the Agent queue: `ask_questions`,
`write_implementation_plan`, `write_solution_design` and `revise_solution_design` (for either
document). Three report work done in a session on any open issue or project: `post_update`
(comment, optional board move), `report_fix` (comment, close as completed, Done, drop
`needs-triage`, leave the Agent) and `file_issue` (a new or follow-up issue). Each is saved by its
commit workflow. The issue page has two [`copy_text`](../../reference/views/copy-text.md) buttons
that hand a connected agent the issue: **Copy agent prompt** (`text_templates/agent-prompt.txt`,
only while the issue waits in the Agent queue) carries the rule for choosing between the four
queue tasks, and **Copy prompt to work on it** (`text_templates/work-prompt.txt`, on open issues a
person works) has the agent post updates while it works and report the fix once it is deployed.
End-user help is in `docs/`.

Read the selected [component references](../../reference/views/components/index.md),
[data-source syntax](../../reference/views/data-sources/index.md), and
[membership guidance](../../reference/security/membership.md) before adapting unfamiliar
properties. This example demonstrates a composition; its domain and complete feature set are not
requirements for other apps.

## Design decisions worth knowing

- **Projects are the access root.** `projects`, `issues` and `milestones` use a
  `resource_grant` policy over direct and group grants, the Time Tracker pattern. Grant and group
  tables are admin-only.
- **Activity follows its issue.** `issue_activity` and `issue_links` use
  `related_resource_grant` to `issues`, so a transferred issue keeps its conversation visible
  without rewriting rows. The cost is that each activity read loads the reader's authorized
  issues; that's fine at test scale, but it's the first thing to revisit for large projects.
- **No "opened" event.** Row policy is checked against issues that already exist, so the
  transaction that creates an issue can't also write an activity row for it. The issue's author
  and created time record the opening.
- **Notifications follow commits.** The optional [notifications.yaml](notifications.yaml) addresses
  the assignee on creation and reassignment, and the issue author and assignee on comments. Each
  event has its own inbox wording. The app does not store delivery addresses or send messages itself.
- **Numbers come from a counter row.** `open_issue` and `transfer_issue` read and bump
  `projects.next_number` in the same transaction; `unique [project_id, number]` backs it up.
- **Workflow-only fields.** State, reason, author, assignee, labels, milestone, number and
  counters are `workflowOnly`. Direct edits (inline title/body, details panel, board moves) can
  only touch title, body, type, priority, parent and board fields; anything else is ignored.
  The issue page uses workflows for type and board-column changes so they leave timeline events.
- **An enriched member profile.** Platform membership comes from `keeper_app_members`. The
  admin-maintained [members](schemas/members.yaml) table adds issue-tracker display and assignment
  settings without granting access. It supplies eligible assignee choices and presentation. Issues
  store both `assignee_member_id` (display, dialog prefill) and `assignee_user_id`
  (`context.userId` filters).
- **Links are stored twice.** Each relationship is a pair of rows sharing `pair_id`, one per
  side, so an issue lists its links with one equality filter and either side can remove both.
- **The vocabularies are data.** Labels, types and priorities are ordinary tables (`rowAccess: all`,
  admin-only writes) that admins maintain under **Setup → Labels & types**. `issues.labels` is a
  multi-value reference; type and priority are single references. Row ids are slugs, so stored values
  read the same as before the conversion and an entry can be renamed without touching an issue.
  A vocabulary row an issue still carries cannot be deleted; mark it inactive instead, which keeps it
  on the issues that use it and stops offering it. Each row carries a `color` (chips show it) and a
  `position`; the list joins the priority's position as `priority_rank` so sorting by priority is
  urgent-first rather than alphabetical.
- **One timeline, one primary action.** The issue page reads `issue_activity` once: comments render
  as bubbles and rows without a body render as one-line events (`summary_field`). Close and Reopen
  are separate workflows shown by `visible_when` on the issue's state, and lock/unlock reuse one
  workflow with a hidden `mode` preset. Every issue-page dialog hides the preset issue id
  (`action_dialog.hidden_inputs`), so dialogs ask only for what the reader decides.
  Comments stay in `issue_activity` rather than a [comment-role table](../../reference/schema/roles.md#comments)
  on purpose: the conversation interleaves with events, comment bodies take attachments, and
  `add_comment` keeps `comment_count`, which the list, board and "New comment" notification use.
- **Quiet list.** `issue_rows.status` is the resolution of a closed issue and empty while open, and
  a zero comment count is projected as empty. The default list shows Type and Created by; long
  creator names wrap, while Labels, Resolution and Comments remain optional columns. The label
  filter is a real `includes` predicate on the issues source rather than a projection script.
- **The Agent works for a person.** `assign_issue` takes **Worked by**: the assignee, or Agent (on
  behalf of the assignee). The person stays in `assignee_member_id`/`assignee_user_id`, so My work,
  notifications and accountability don't change; `assignee_kind: agent` and `agent_status` (ready,
  waiting on answers, in review) drive the Agent queue. A connected agent always runs as
  whoever connects it, so there is no separate agent principal.
- **The queue is the picker.** Each queue procedure's issue input has
  `reference_where: {assignee_kind: agent, agent_status: ready, state: open}`, so
  `app_procedure_input_options` lists exactly the Ready tab, and preparing a run for any other
  issue is refused. Each commit workflow checks the issue is still Ready, so an issue taken back
  while the agent works can't be saved. The reporting procedures (`post_update`, `report_fix`)
  take any open issue (`reference_where: {state: open}`) and refuse a closed or locked one at
  commit.
- **A filed issue is traced on its origin.** Under `related_resource_grant`, activity and link
  rows can't be written for an issue created in the same transaction, so `file_issue` writes no
  event or link on the new issue: the issue it follows up gets an Agent event naming it, and the
  new issue's description names the original.
- **Plans and designs are documents in the issue's own folder.** `issues.collection_id` is a
  [document collection](../../reference/schema/roles.md); `assign_issue` creates it the first time
  an issue goes to the Agent, and the issue page's Documents panel can start one by hand. The
  design is an ordinary Markdown file people can edit and comment on passage by passage;
  `revise_solution_design` revises it in place. `issue_documents` links other documents with a
  role. Collection documents follow the collection, not the project grant: any app member who can
  open the issue's folder can read them.
- **Agent comments are conversation rows, named as the Agent.** Questions and handovers are
  `issue_activity` comments stored under the person who ran the agent, with its `agent_run_id`.
  The conversation and the board's activity set `agent_field: agent_run_id`, so those rows read
  **Agent (on behalf of <person>)** with an agent avatar, never as the person's own words; so do
  the close, board and label events of `report_fix`. Three notification rules
  (`issue_agent_questions`, `issue_agent_design`, `issue_agent_update`) tell the author and the
  assignee, because the comment rule only follows `add_comment`; `issue_closed` also follows
  `commit_fix_report`. A person's comment on a waiting issue returns it to the queue; **Hand back to the
  Agent** does the same after a design, with an optional note.
- **`invalidate: "*"` everywhere.** Workflows run from several views whose source keys differ,
  and `invalidate` names view source keys, not tables.

## Sample data and first use

When adapting the complete example, copy all descriptors, declared guide documents, and seed data
into the candidate before making domain changes. Validate the complete candidate rather than a
view in isolation. After deployment, as a workspace owner or manager (an implicit app admin):

1. Add testers from **Administration → Members** or **Access & sharing**.
2. If they should be assignable, add their optional profiles under **Setup → Access → People**.
3. Under **Setup → Access → Project access**, grant the seeded **Demo project** (`DEMO`) to them
   with the Editor role. Admins see every project without a grant.

The seed data contains the filter catalog, three templates, the Demo project and one milestone.
There are no seeded issues or people, because both need real Keeper principals.

## Known limits (phase 1)

- One assignee per issue.
- A label change records the slug it added or removed, not the label's display name.
- Comments can't be edited or deleted from the UI (admins can moderate data directly).
- Title and description edits leave no event in the conversation.
- No mentions or reactions.
- Search is a substring match over reference, title and description of the loaded project
  issues, bounded by the 20,000-record complete-read limit.

## Runtime gaps seen in live testing (2026-09-17)

- Dialogs opened from a `record_detail` `actions_source` don't compute the workflow preview; the
  issue page turns previews off everywhere, because the dialog already names the change.
- Menu buttons take their accessible name from the view description instead of the title.
- Workflow timestamps come from a hidden computed input (`changed_at`), because `system.nowIso` is
  UTC while datetime fields hold the reader's local time.

## Validation expectation

The complete 76-file app candidate (the author-facing README is excluded) verifies with zero
errors and zero warnings with data included. Re-run validation after any adaptation.
