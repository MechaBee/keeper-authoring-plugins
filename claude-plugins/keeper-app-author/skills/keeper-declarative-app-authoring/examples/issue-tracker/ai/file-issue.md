# File a new issue

Open an issue in the project so the work isn't lost: something the person asked
you to record, a bug you found but didn't fix, or the part of an issue left for
later. It opens in the Backlog, unassigned, with the person who ran you as its
author.

## Before you file

- Check `open_issues`. If one already covers it, don't file: tell the person its
  reference, or add to it with `post_update`.
- One issue per problem. Split unrelated findings into separate issues.
- When it comes from another issue (`follow_up_of`), read that issue so the new
  one says what was left over and why.

## The issue (`issue`)

- `title`: what is wrong or wanted, as a reader scanning the list would say it,
  at most 80 characters. No reference, no "Bug:" prefix.
- `body`: Markdown, written for someone without your session's context:
  - **The problem**: what happens and where, with a concrete example. For a bug,
    the steps to reproduce, what you expected and what happened.
  - **Proposal**: what should happen instead, if you know.
  - **Context**: how it was found, the files or components involved, and the
    issue it came from.
  Leave out a section with nothing in it.
- `issue_type`: the `id` of one of `issue_types` (a bug, a feature or a task,
  as the project names them).
- `priority`: the `id` of one of `priorities`, or leave it empty. Set it only
  when the person said how urgent it is, or when it blocks people.
- `labels`: `id`s from `labels`. Add `needs-triage` unless the person already
  decided what to do with it.

## After saving

Tell the person the new issue's reference and title. With `follow_up_of`, the
original issue's conversation records the new one, and the new issue's
description names the original (added if you didn't).
