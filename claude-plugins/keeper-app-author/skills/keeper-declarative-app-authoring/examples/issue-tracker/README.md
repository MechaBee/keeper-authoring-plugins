# Issue Tracker — Comprehensive Example

A GitHub Issues–style tracker for teams, built only from the current Keeper runtime. This is
copied from the repository's current `documentation/examples/keeper/apps/issue-tracker` example.
It runs on JSONL storage; the manifest omits `storage`.

## What's in it

| View | For | Built from |
| --- | --- | --- |
| [Issues](views/issues.yaml) (default) | Everyone | `record_table` over a projection; view-bar filters with live Open/Closed counts; search; CSV export |
| [Issue](views/issue.yaml) (hidden, `?issueId=`) | Everyone | Editable `record_detail`; one `comment_thread` timeline of comments and events with an inline composer; two-column details panel; compact sub-issue and link lists; state-aware Close/Reopen with rarer actions in the overflow menu |
| [Board](views/board.yaml) | Everyone | `record_board` per project: saved rank, WIP limit, facets, side-pane detail with activity |
| [My work](views/my_work.yaml) | Everyone | Tabs: assigned to me, opened by me, open issues nobody owns |
| [Milestones](views/milestones.yaml) | Everyone | Progress from two `aggregate_table` counts joined by a projection |
| [Setup access](views/setup_access.yaml) and the other `setup_*` views | Admins | Projects; labels, types and priorities; issue templates; optional assignment profiles, groups and project grants |

Twelve workflows own every change that should leave a trace: `open_issue`, `close_issue`,
`reopen_issue`, `add_comment`, `assign_issue`, `set_labels`, `set_milestone`, `link_issues`,
`unlink_issues`, `transfer_issue`, `lock_conversation` (admins) and `delete_issue` (admins).
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
- **Numbers come from a counter row.** `open_issue` and `transfer_issue` read and bump
  `projects.next_number` in the same transaction; `unique [project_id, number]` backs it up.
- **Workflow-only fields.** State, reason, author, assignee, labels, milestone, number and
  counters are `workflowOnly`. Direct edits (inline title/body, details panel, board moves) can
  only touch title, body, type, priority, parent and board fields; anything else is ignored.
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
- **Quiet list.** `issue_rows.status` is the resolution of a closed issue and empty while open, and
  a zero comment count is projected as empty, so the default Open list carries no repeated values.
  The label filter is a real `includes` predicate on the issues source rather than a projection
  script.
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
- No attachments, mentions, notifications or reactions.
- Search is a substring match over reference, title and description of the loaded project
  issues, bounded by the 20,000-record complete-read limit.

## Runtime gaps seen in live testing (2026-09-17)

- Dialogs opened from a `record_detail` `actions_source` don't compute the workflow preview; the
  issue page turns previews off everywhere, because the dialog already names the change.
- Menu buttons take their accessible name from the view description instead of the title.
- Workflow timestamps come from a hidden computed input (`changed_at`), because `system.nowIso` is
  UTC while datetime fields hold the reader's local time.

## Validation expectation

The complete 52-file app candidate (the author-facing README is excluded) verifies with zero
errors and zero warnings with data included. Re-run validation after any adaptation.
