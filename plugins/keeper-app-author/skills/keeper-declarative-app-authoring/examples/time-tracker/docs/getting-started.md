# Setting up and getting started

Start by granting people Time Tracker membership. Then set up the projects and accounting periods
they will use, and help them record their first entry. Reporting profiles are optional metadata;
they are not app access.

## For administrators: invite a member

1. **Open app membership.** Choose **Access & sharing** in the app header or
   **Administration → Members** in the grouped app menu.
2. **Invite the person as an Editor.** Enter their full email address, select **Editor**, and click
   **Add**. Editor is the normal role for people who will enter, modify, or delete their own time.
   Use Viewer only when the person should read data without changing it.
3. **Save access.** Keeper records the role and sends an invitation when the address does not yet
   resolve to a registered principal. Check the result for any invitation delivery failure.
4. **Have the person register.** Ask them to open the invitation and register using the invited
   email address, or sign in if they already have an account. An invitation to an unregistered
   email. A pending email invitation is not yet an active app principal and cannot be selected in
   grants or profiles.
5. **Optionally create a reporting profile.** After the person is an active app member, open
   **Access control → Members → New member profile**. Select the app member, enter a unique alias
   and optional full name, then create the profile. The profile improves report labels but does not
   grant, suspend, or remove app access.
6. **Assign their projects.** Once projects exist, use **Access control → Project access** to grant
   the active app member directly or through a group. Membership, optional reporting profile, and
   project assignment are separate concerns; an Editor with no project grants has nothing to log
   against.

If the sharing screen says users must already have workspace access, ask the workspace owner or
manager to grant it. Owners and managers can grant the required workspace access when saving app
roles; an app administrator without that authority changes app roles only.

## For administrators: set up the work

For a new app, create the catalogs and accounting period before members begin logging time.

1. **Add your clients.** *Setup → Clients → Add client.* Whoever the work is for.
2. **Add projects under them.** *Setup → Projects → Add project.* Pick the client, name the project,
   and decide **Billable by default** — it pre-fills the billable flag on every entry, and people
   can still override it per entry. Project names must be unique within a client.
3. **Add tasks, if you want them.** *Setup → Tasks.* Tasks are optional throughout; add them only
   where a project genuinely needs a breakdown. Nobody is ever forced to pick one.
4. **Open the current accounting period.** *Setup → Periods → Add period.* Enter the current month in
   `YYYY-MM` format (for example, `2026-09`); the start and end must be that month's first and last day, and status **Open**.
   **Nothing can be logged in a month that has no period** — anyone who tries is told
   *"The accounting period for this date is not configured."* This is the step people forget, and
   it is the one that stops the whole team at once.
5. **Group people, if it helps.** *Access control → Groups.* Groups exist so you can grant a project
   to a team rather than to eight people.
6. **Grant project access.** *Access control → Project access.* Select a project, then add
   **direct member grants** or **group grants**. This is the step that makes a project usable:
   without a grant, an ordinary member cannot see the project or log against it.
   Administrators can see team records without granting themselves each project.

### Keeping it running

- **At month end**, set the finished month to **Locked** and add the next month as **Open**. Lock
  only when you are content that the month is final — a locked month refuses every change.
- **When a project finishes**, mark it **Closed** rather than deleting it. History stays; new time
  stops.
- **When someone leaves**, remove their membership from **Access & sharing**. Their profile and
  historical entries remain. You may also clear **Reporting profile active** to hide the profile
  from current reporting choices; that flag never controls app admission.

### Roles

| Role | What it can do |
| --- | --- |
| **Viewer** | Read their own time and reports. Cannot log time. |
| **Editor** | Log, edit and delete their own time. This is the everyday role. |
| **Developer** | An editor who also maintains the app definition. |
| **Admin** | My reports for their own time; Team reports, Setup, Access control, and entries on behalf of other members. |

Roles are Keeper app roles, set outside this app; project *access* is set inside it, in Access
control. Both matter: an editor with no project grants has nothing to log against.

Administrators have **My reports** for their own entries, just like other members. Its owner filter
still applies even though administrators may read all rows. **Team reports** includes the whole
team, including the administrator, subject to its chosen report filters.

## For everyone: your first day

Open your invitation and register with the invited email address, or sign in to your existing
account. Your administrator assigns your projects; a reporting profile is optional.

1. **Open Projects** and check the list. If a project you need is missing, ask an administrator for
   access — do not create a second one under another name.
2. **Star the projects and tasks you use daily** in *Favourite projects* and *Favourite tasks*. They
   are private to you.
3. **Log something.** *My entries → Add entry.* Choose the project, leave the task empty unless you
   need it, set the date, and enter either a duration or a start and end time. Save.
4. **Look at My week.** Your entry is in the grid — the weekly sheet was created for you when you
   saved it. From here on you can type hours straight into cells — `1.5` or `1:30` — and the grid
   saves as you go.

Two ways of working, both fine: add entries one at a time in *My entries* as the day goes, or fill
the *My week* grid in one pass. They are the same data.

## The rules that will catch you out

- **Time comes in quarter hours.** 15 minutes minimum, and multiples of 15 thereafter.
  *"Duration must be a positive multiple of 15 minutes."*
- **Start and end times are optional, but if you give them, they must add up.** Both on the work
  date, and the gap between them must equal the duration.
  *"Start and end must both be present on the work date and agree with the duration."*
- **A task must belong to its project.** Changing the project clears the task; pick the task second.
  *"The selected task does not belong to the selected project."*
- **Closed projects and tasks take no new time.** Existing entries are untouched.
  *"Time entries can only be added to open projects."*
- **A locked month is closed to everyone,** including administrators. If you need to correct a
  locked month, an administrator has to reopen it.
- **24 hours is the daily ceiling** across all your entries for that date.
  *"A member cannot record more than 24 hours on one day."*
- **Weeks start on Monday.** A weekly sheet always begins on one.

## When something looks wrong

**An invited user does not appear in a member or project picker.** Check **Access & sharing**. The
invitation must resolve to an active app principal before Keeper exposes it through
`keeper_app_members`; pending email invitations are deliberately not assignable.

**A project is missing from the dropdown.** Either you have no grant to it, or it has been closed.
Both are fixed by an administrator, in Access control or Setup respectively.

**"The accounting period is locked."** That month has been closed off. Ask an administrator whether
it can be reopened; if not, the correction belongs in the current month.

**"The accounting period for this date is not configured."** Nobody has created that month yet. An
administrator adds it in *Setup → Periods* — it is one row, and it unblocks everyone.

**You cannot add an entry at all, on any project.** You are probably a viewer; logging time needs
the editor role.

**A report is empty after you changed the filters.** Reports do not refresh by themselves — press
**Query**.

**Someone's time is missing from Team reports.** Check the date, member, client and project filters, then press **Query**.
Administrators can see all team rows; granting yourself a project is not required.

## Who to ask

Your team's administrator for anything about projects, access, periods or someone else's time.
Whoever installed the app in your workspace if the app itself will not open.
