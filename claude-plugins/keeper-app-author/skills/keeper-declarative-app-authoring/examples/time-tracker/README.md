# Time Tracker — Flagship Example

This example shows an app organized around everyday work: capture time quickly, correct it in
context, review a week, and query reports. It is adapted from the repository's
`documentation/examples/keeper/apps/time-tracker-v3` with empty JSONL files for initial setup. The manifest
omits `storage`, so it uses the default JSONL engine. It is not a DynamoDB conversion.

## UX patterns to study

Read the path for the interaction you are building. A focused edit does not require reading this
whole app. When adapting the complete app, inspect all descriptors and their dependencies.

| User task | Start with | What the composition teaches |
| --- | --- | --- |
| Log time quickly | [My entries](views/my_entries.yaml), [quick-add workflow](workflows/quick_add_time_entry.yaml) | Compact action dialog, favourite-project chips, date shortcuts, remembered context, optional project-dependent task |
| Correct an entry | [My entries](views/my_entries.yaml) | Selection-bound detail beside a browse table, explicit save, duration computation, duplicate action |
| Fill or inspect a week | [My week](views/my_week.yaml), [entry workflow](workflows/create_time_entry.yaml) | Direct grid editing, hours presentation, daily/weekly totals, multi-entry cell drilldown |
| Find frequently used work | [Projects](views/projects.yaml) | Project/task browsing and personal favourites |
| Query and export personal time | [My reports](views/reports.yaml) | Clearable filters, date presets, explicit Query action, complete bounded reads and CSV export |
| Review team time | [Team reports](views/admin_reports.yaml), [admin entry workflow](workflows/create_admin_time_entry.yaml) | Member filtering, contextual correction, entry on another member's behalf |
| Maintain reference records | [Setup](views/administration.yaml) | Related maintenance surfaces grouped into tabs rather than separate create/read/update screens |
| Manage project scope | [Access control](views/access_control.yaml) | Admin-only optional reporting profiles, groups, and project-grant surfaces; platform membership remains host-owned |

Use the selected [component references](../../reference/views/components/index.md),
[workflow syntax](../../reference/automation/workflow.md), and
[bindings](../../reference/views/bindings/index.md) before adapting unfamiliar properties.
These are reusable patterns; the time domain, seven screens, and complete security graph are not
requirements for every app.

## Security and data integrity

[Time entries](schemas/time_entries.yaml) combine project resource grants with a stamped owner:
ordinary members see their own entries on assigned projects. App admins can review team rows.
Grant and group-membership tables are admin-only. App admission is host-owned; `member_profiles`
only enriches active `keeper_app_members` with reporting metadata. See
[app membership](../../reference/security/membership.md) for the distinction between control-plane
membership, optional profiles, and in-app resource assignments.

The same schema constrains write channels and the accounting-period lifecycle, validates times
and project/task relationships, and declares a per-member daily aggregate bound. A locked period
prevents changes, including administrator corrections, until it is reopened. Grid editing and
dialogs use the same underlying record policies; a UI control does not establish authority.

[Timesheets](schemas/timesheets.yaml) and [periods](schemas/periods.yaml) define weekly and monthly
context. Creation workflows find or create the appropriate weekly sheet and require a configured
accounting period. This example has month locking, not a submit-and-approve cycle.

## Sample data and first use

The eight `data/*.jsonl` files are empty in this draft. Follow the
[getting-started guide](docs/getting-started.md) to configure members, project access, catalogs,
and accounting periods. The [user guide](docs/guide.md) describes everyday use. Do not infer that
an empty data file grants access or supplies the prerequisites for creating a time entry.

## Boundaries when adapting

- The list and grid sources have explicit result limits. Treat them as bounded operational
  surfaces; verify their limits fit the workload before relying on totals for larger datasets.
- Reports use complete reads and an explicit bound; preserve completeness when adapting report
  totals and exports. A single cursor page is not a complete report.
- Logical `queryPaths` and indexed-query intent are retained from the source. They do not change
  this app's JSONL storage engine or authorize a storage conversion.
- Clearing a grid cell may delete its underlying entry. Preserve or deliberately change that
  interaction according to the brief, and keep multi-entry cell drilldown coherent.
- Setup uses small record collections for catalog maintenance. That does not make a collection
  the default component for the main operational workflow.

The manifest ID/title are normalized to `time-tracker` / `Time Tracker`; Setup guidance clarifies membership and admin visibility. Schema, view, workflow,
files are retained from the source; the JSONL paths are retained with empty content. Validate the
complete adapted candidate, including its declared guide documents.
