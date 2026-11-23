# User Guides

Add an end-user guide when an app includes tasks a new reader could misunderstand: an approval
cycle, meaningful status transitions, different role responsibilities, or a maintained catalog.
A simple personal list generally needs no guide. Respect the requested scope; one useful entry
document is enough when the app does not need separate topics.

Write for the person doing the work, using the labels and status names on screen. Explain:

- What the app is for and how to begin.
- The real everyday tasks, with numbered steps where order matters.
- Status meanings, editability, and who can perform each transition.
- Likely failures and their actual user-facing messages.

Exclude schema dumps, YAML, implementation details, and invented contacts or failure messages.
Roles in the guide should describe actual effective behavior, not assume every app uses every role.
Split topics when readers will return to a task independently; avoid repeating the entry page.

Declare documents using the [app guide reference](../reference/application/user-guide.md). Everyone
who can open the app, including share-link recipients, can read the guide; do not include private
operational information. Update relevant passages when a changed view, status, workflow, or access
rule makes them inaccurate. Candidate preservation and deletion rules belong to
[Author and update](../workflows/author-and-update.md) and [Apply](../workflows/apply.md).
