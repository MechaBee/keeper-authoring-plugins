# Setting up a project

This page is for app admins. Everything here lives under **Setup**, which only admins see.

## 1. Add app members

Open **Administration → Members** in the app menu, or **Access & sharing** from app options. Add an
existing Keeper user or enter an invited email, choose an app role, and save. Keeper aligns the
required workspace access automatically when your workspace role permits it. Workspace owners and
managers are app admins automatically.

Use:

- **Editor** for anyone who reports, discusses or works on issues.
- **Viewer** for people who only follow along.

Removing a member blocks app access but preserves issues, comments, grants, profiles and historical
assignments.

## 2. Add optional assignment profiles

App members are immediately available for project and group grants. If you also want a friendly
issue-tracker label such as “Frontend” or want to control whether someone appears in new assignee
choices, open **Setup → Access → People** and select **Add issue-tracker profile**.

The profile's **Available for assignment** flag is issue-tracker metadata only. It never grants or
revokes app access.

## 3. Create a project

Open **Setup → Projects** and select **New project**.

- **Key** is the prefix of every reference in the project, such as `WEB` in **WEB#12**. Use 2 to 8
  capital letters or digits, starting with a letter. Choose it carefully: issues keep the
  reference they were given.
- **Name** is what people pick in the filters.

The app ships with a **Demo project** (key `DEMO`) and one milestone in it. Use it to try things
out, then archive it. Archived projects keep their issues but accept no new ones.

## 4. Grant access

Nobody except admins can see a project until it's granted.

1. Open **Setup → Access → Project access** and select the project.
2. **Grant a person** for individuals, or **Grant a group** for a team.

To use groups, create them under **Groups**, then **Add to group**. Removing someone from a group,
or revoking a grant, takes the project away from them straight away.

## 5. Plan milestones

Anyone with the Editor role can create milestones under **Milestones → New milestone**. Each
milestone belongs to one project.

## 6. Tune the templates

**Setup → Templates** controls the cards in the New issue dialog. For each template you choose
the title start, the type, the labels added automatically and a description outline. Turn off
**Offered** to hide a template without deleting it.

## Changing labels, types or priorities

Open **Setup → Labels & types** to maintain labels, issue types and priorities. These catalogs are
app data and the issue list reads them directly. A catalog item already used by an issue cannot be
deleted; turn off **Offered** instead so existing issues keep their value while new choices omit it.
