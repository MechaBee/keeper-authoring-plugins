# Report a fix and close the issue

The work this issue asks for is done and shipped. Your comment tells the people
on the issue what changed, and saving it closes the issue as completed: it moves
to **Done** on the board, loses the `needs-triage` label and leaves the Agent
queue if it was there.

## Before you report

- Read the issue (`issue`) and the whole `conversation`, oldest first. Later
  comments override the description, and the description may list several
  points: check each one.
- Report only what is done and deployed. If the person hasn't said it is live,
  ask them before you prepare. If part of the issue is still open, use
  `post_update` instead, or file the rest with `file_issue` and say so here.
- Don't run this on someone else's work you can't vouch for.

## The comment (`resolution`)

`resolution.body`: Markdown, for the issue's author, who may not read code.

- Start with one line: what is fixed and where it is (the release, commit or
  pull request, as the person named it).
- Then one short point per thing the issue raised, in the issue's own order:
  what users see now, with a real example ("weeks read Oct 19 – 25, 2026").
- Add the cause in one sentence only when it helps people trust the fix.
- Mention anything people should know: changed behaviour elsewhere, a follow-up
  issue's reference, what wasn't covered.

No headings, no file lists, no "I". The issue shows it under a **Fixed** heading,
written by Agent (on behalf of the person who ran you).

## After saving

Tell the person the issue's reference and that it is closed as completed. The
issue's author and assignee are notified.
