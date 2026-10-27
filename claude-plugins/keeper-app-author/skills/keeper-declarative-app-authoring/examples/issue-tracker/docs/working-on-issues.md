# Working on an issue

Most changes happen in the **Details** panel on the right of the issue page. **Assign**, **Labels**,
**Milestone**, **Change type** and **Move on board** open small dialogs, and each change appears in
the conversation. Select **Priority** or **Parent** to edit them in place. Moving an issue to
**Done** does not close it.

## Assign someone

1. Select **Assign**.
2. Pick a person, or leave **Assignee** empty to unassign.
3. Confirm. The change appears in the conversation.

An issue has one assignee. **My work → Needs an owner** lists open issues nobody has picked up yet.

## Give an issue to the Agent

A connected coding agent (Claude Code or Codex with the MechaBee Workspace Content plugin) can work
an issue for you: it writes a solution design or asks its questions on the issue.

1. Select **Assign**, pick the person the Agent works for, and set **Worked by** to **Agent (on
   behalf of the assignee)**. That person stays the assignee and is notified as usual.
2. The issue appears in **Agent queue → Ready**, and gets its own **Documents** folder.
3. On the issue, select **Copy agent prompt** and paste it into your agent session. The agent
   reads the issue and decides what it needs. You can also ask it to "work the Issues agent
   queue".

Everything the Agent writes appears as **Agent (on behalf of <name>)**, naming the person who ran
it, with a robot avatar. What the Agent can do, and what you see:

- **Ask questions.** Its questions arrive as one comment headed **Questions**, and **Details**
  shows **Waiting on answers**. Reply with a comment and the issue goes back to the queue. The
  issue's author and assignee are notified.
- **Write an implementation plan**, when the fix is clear, or **a solution design**, when the
  approach still has choices to make. The document appears under **Documents**, a comment headed
  **Wrote:** says what to look at first, and **Details** shows **In review**. Open the document
  to read it, and select a passage to comment on it.
- **Revise the plan or design.** When it needs changes, select **Hand back to the Agent** and say
  what should change. The Agent rewrites the same document and reads your comments on its
  passages.

When the plan or design is good, assign the issue to a person to build it, or close it.

## Let an agent report its work

A coding agent working on an issue in a session can keep the issue up to date, on any open
issue, whether or not it was given to the Agent. Ask it in your own words, for example "post
an update on TTR#19", "the fix is deployed, close TTR#19" or "file a follow-up issue for that".

- **Post an update.** A comment headed **Update** says where the work stands, and the issue can
  move on the board, to **In progress** or **In review** for example.
- **Report a fix.** A comment headed **Fixed** says what changed, and the issue closes as
  completed: it moves to **Done**, loses the `needs-triage` label and leaves the Agent queue.
  Only ask for this once the fix is live.
- **File a new issue.** The agent opens an issue in the project, in the Backlog and unassigned,
  with you as its author. For a follow-up, the original issue's conversation names the new one.

The issue's author and assignee are notified of updates and fixes as usual.

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

- Drag a card to move it, or use the card menu. The move appears in the issue's activity.
  **In progress** shows a work-in-progress limit of five and is highlighted when it holds more.
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
