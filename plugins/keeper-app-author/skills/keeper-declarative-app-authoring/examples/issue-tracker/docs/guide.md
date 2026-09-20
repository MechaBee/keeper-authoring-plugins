# Issues

Issues is where your team reports problems, plans work and keeps track of what's been decided.
Every issue belongs to a project and gets a short reference, such as **DEMO#12**, that you can
use in conversations.

## Before you start

You need two things, and an app admin grants both:

- **Access to the app.** An admin invites you in Keeper's app access controls.
- **Access to a project.** An admin grants a project to you, or to a group you belong to, under
  **Setup → Access → Project access**. You only see the projects you've been granted, and the
  issues, comments and milestones inside them.

To be assignable, you also need an entry under **Setup → Access → People**. If your name is missing
from the **Assignee** picker, ask an admin to add you. See
[Setting up a project](setting-up.md).

## Find an issue

1. Open **Issues**. It shows open issues from every project you can see, most recently updated
   first.
2. Narrow the list with the filters above it: **Project**, **State**, **Label**, **Type**,
   **Assignee** and **Milestone**. The **State** filter shows how many issues are open and closed
   for the other filters you've chosen. For issues you opened yourself, use **My work**.
3. Type into **Search issues** to match words in the reference, title or description.
4. Select a row to open the issue.

**Resolution** is filled in only for closed issues, and **Comments** only when there are some.
Use **Columns** to show type, priority, sub-issue progress, author or opening date.

The filters are kept in the page address, so you can bookmark or share a filtered list.
**Export CSV** downloads everything that matches, not just the page on screen.

## Report an issue

1. Select **New issue**.
2. Pick the **Project**. If you started from a filtered project, it's already chosen.
3. Pick a template card if one fits (**Bug report**, **Feature request** or **Task**). It fills
   in the type and a description outline, and may add labels such as `needs-triage`.
4. Write a clear **Title** and fill in the **Description**. Markdown works.
5. Under **Triage**, set whatever you already know: type, priority, labels, assignee or milestone.
6. Select **New issue**. The issue opens with its new reference.

To break an issue down, open it and choose **More actions (⋯) → Add a sub-issue** instead.

## Discuss and close

On the issue page:

- Write in the box under the conversation and select **Comment** (or press Cmd/Ctrl+Enter).
  Markdown works.
- **Close issue** asks for a **Reason**: **Completed** when the work is done, **Not planned** when
  you've decided not to do it, or **Duplicate of another issue**, where you pick the original.
  You can add a comment in the same step.
- On a closed issue the button reads **Reopen issue**, with an optional comment.
- Select the title or the description to edit it, then **Save changes**.

The conversation shows comments and changes in one timeline: who closed, reopened, assigned,
labelled or linked the issue, and when. Rarer actions (sub-issues, links, transfer, lock, delete)
are under **More actions (⋯)** at the top right.

## What the states mean

| You see | Meaning |
| --- | --- |
| **Open** | Still needs attention. |
| **Closed** (completed) | The work is done. |
| **Not planned** | Closed without doing it. |
| **Duplicate** | Closed because another issue covers it. The original is shown on the issue. |

The **Board column** (Backlog, Ready, In progress, In review, Done) is separate from the state.
Moving a card to **Done** doesn't close the issue. Close it from the issue page when it's finished.

## Who can do what

| Role | Can |
| --- | --- |
| Viewer | Read issues, comments and history in their projects. Can't comment or change anything. |
| Editor | Everything above, plus report issues, comment, close and reopen, assign, label, set milestones, link issues and move board cards. |
| Admin | Everything, in every project: set up projects, labels, types, priorities, people, groups, access and templates; lock conversations; delete issues. |

## When something looks wrong

- **"The conversation is locked. Only admins can comment."** An admin locked the issue. Ask them
  to unlock it if the discussion needs to continue.
- **"This project is archived and accepts no new issues."** Pick another project, or ask an admin
  to restore it under **Setup → Projects**.
- **"That issue number was just taken. Open the issue again."** Someone opened an issue in the
  same project at the same moment. Select **New issue** again; nothing was saved.
- **An issue or project you expect is missing.** You haven't been granted that project. Ask an
  admin to check **Setup → Access → Project access**.
- **A button is greyed out with "The viewer role cannot run this workflow."** Your app role is
  Viewer. Ask an admin for the Editor role.

More: [Working on an issue](working-on-issues.md).
