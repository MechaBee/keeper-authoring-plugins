# What's in the app

Seven screens. Which ones you see depends on your role — a short menu is your role, not a fault.

## My entries

Your working list. It shows your recent entries, newest first, with the columns in the order you
read them: Work date, Project, Billable, Time (hrs), Task, Description.

- **Add entry** opens a compact dialog: project, optional task, date, times or a duration,
  description, billable. Choosing a project narrows the task list to that project's tasks.
- Selecting a row opens **Entry detail** beside the list, where you can edit or delete it.
- **Duplicate entry** copies a selected entry onto another date — the fastest way to record a
  recurring block of work.
- The **Period** and **Week** selectors at the top narrow the list.

## My week

A Monday-to-Sunday grid. Rows are the combination of project, task and billable status; columns are
the seven days. Cells hold the hours you worked.

- Type straight into a cell — `1.5` or `1:30` both work, in 15-minute steps — and it saves itself.
- Row totals, daily totals and a **40-hour weekly target** are shown alongside.
- A cell holding several entries shows a count. Select it and the entries behind it appear below,
  where you can open and edit any of them.
- Clearing a cell deletes the entry behind it.
- Weekly sheets appear by themselves the first time you log time in a week; **Create week** makes
  an empty one ahead of time, and the week selector moves between the ones you have.

## Projects

What you are allowed to log against, and your personal shortcuts.

- **Available projects** lists every open project you have been granted, with its client. Selecting
  one shows its tasks.
- **Favourite projects** and **Favourite tasks** are yours alone — a private shortlist, no effect on
  anyone else's view.

## My reports

Your own time, filtered and exportable, for every role including administrators. My reports always
filters entries to the signed-in user. Administrators also have Team reports for team-wide review.

- Filters: **From** / **To** dates, **Client**, **Project**. Client and project both offer
  *All clients* and *All projects* to clear them again; changing the client clears the project.
- **This month** and **This year** fill the date range in one click.
- Nothing is fetched until you press **Query**, so you can set several filters without waiting
  between them.
- The table shows Work date, Client, Project, Billable, Time (hrs), Task, Description, Start, End.
- **Export CSV** downloads exactly what the filters selected, with client and project as separate
  columns.

## Team reports — administrators

The same idea across everyone whose time you can see.

- Filters: dates, **Member**, **Client**, **Project**, each clearable, plus **This month**,
  **This year** and **Query**.
- Columns run Client, Project, User, Billable, Work date, Duration, Description, Start, End.
- Selecting a row opens the entry beside the table, where an administrator can correct it —
  changing the times recalculates the duration. No row is selected when the report opens, so the
  panel stays out of the way until you ask for it.
- **Add entry for member** records time on someone else's behalf.
- **Export CSV** exports the filtered rows.

## Setup — administrators

Four sections behind one screen: **Clients**, **Projects**, **Tasks**, **Periods**.

- Clients, projects and tasks are created and edited here. Projects carry a **Billable by default**
  flag and a **Closed** flag; closing one keeps its history and stops new time.
- Archived and closed rows are hidden until you tick *Include archived* / *Include closed projects*.
- **Accounting periods** are calendar months, created as `2026-08` and set to **Open** or
  **Locked**. Locking a month stops all changes to entries dated inside it.

## Access control — administrators

Platform membership is managed from **Access & sharing**. This screen holds optional reporting
profiles plus the groups and project grants that determine what active members can reach.

- **Members** — create optional reporting metadata for an active app member, with an alias and
  optional full name. **Reporting profile active** controls whether the profile appears in current
  member-filter choices. It does not grant or revoke app access, and historical time remains.
- **Groups** — named sets of members, maintained with their memberships.
- **Project access** — grant a project to a member directly, or to a group. Project grants make it appear in an ordinary member's project list and allow them to log
  against it. Ordinary members see their own entries on granted projects; administrators can
  review team records without assigning themselves each project.

Next: [Setting up and getting started](getting-started.md).
