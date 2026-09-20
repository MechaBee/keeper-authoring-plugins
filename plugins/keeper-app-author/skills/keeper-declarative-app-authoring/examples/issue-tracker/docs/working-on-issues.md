# Working on an issue

Most changes happen in the **Details** panel on the right of the issue page. Select **Type**,
**Priority**, **Board column** or **Parent** to change them in place. **Assign**, **Labels** and
**Milestone** open a small dialog, and each of those changes appears in the conversation.

## Assign someone

1. Select **Assign**.
2. Pick a person, or leave **Assignee** empty to unassign.
3. Confirm. The change appears in the conversation.

An issue has one assignee. **My work → Needs an owner** lists open issues nobody has picked up yet.

## Labels

Select **Labels**, then choose what to **Add** and what to **Remove**. Labels you don't
touch stay as they are.

Each label carries its own description, shown where an admin maintains it.

An admin maintains the list itself under **Setup → Labels & types**, along with issue types and
priorities. Each entry has a colour and an order; priorities sort the issue list urgent-first by
their order, not by name. A label an issue still carries cannot be deleted — clear **Offered** to
retire it instead, which leaves it on the issues that have it and stops offering it on new ones.
Renaming an entry is safe: issues keep pointing at the same row.

## Milestones

Select **Milestone** to add the issue to one of its project's open milestones, or leave the
field empty to take it out. **Milestones** shows every milestone with how many of its issues are
closed and how much time is left. Select a milestone to edit it, then **Show this milestone's
issues** to jump to the filtered list.

## Break work into sub-issues

- **More actions (⋯) → Add a sub-issue** opens the New issue dialog with the parent already set.
- To attach an existing issue, open it and select **Parent** in **Details**. Both issues must be in
  the same project. Select the parent's name to jump to it.
- The parent lists its **Sub-issues** on the right, and the issue list can show progress such as
  **2 of 5** (turn on the **Sub-issues** column).

## Link related issues

1. Select **More actions (⋯) → Link an issue**.
2. Choose whether this issue **Blocks**, **Is blocked by** or **Is related to** the other one.
3. Find the other issue. It must be in the same project.

The link shows on both issues under **Linked issues**; select it to jump across. **More actions →
Remove a link** removes it from both sides.

## The board

**Board** shows one project's issues as cards, in the columns Backlog, Ready, In progress, In
review and Done.

- Drag a card to move it, or use the card menu. **In progress** shows a work-in-progress limit of
  five and is highlighted when it holds more.
- Select a card to edit its column, type, priority and title beside the board, and to see its
  recent activity. **Open full page** takes you to the issue page.
- **Archive card** hides a card from the board without changing the issue. Use it to clear old
  cards out of **Done**; **Include archived** shows them again, and **Restore card** brings one
  back.

## Move an issue to another project

Select **More actions (⋯) → Transfer to another project** and pick the project. The issue gets a new reference in that project, and its
conversation and history move with it. Its milestone and parent are removed, because those belong
to the old project.

A transfer is refused, with the reason, while the issue has sub-issues, has links, is a duplicate,
or has duplicates pointing to it. Sort those out first.

## Admins only

- **Lock conversation** stops everyone except admins from commenting; **Details** then shows
  the conversation as locked. The lock and its reason appear in the conversation, and **Unlock
  conversation** lifts it. Both are under **More actions (⋯)**.
- **Delete issue** (under **More actions**) removes the issue, its conversation and its links for good. Type the issue's
  reference to confirm. Issues that still have sub-issues or duplicates can't be deleted.
