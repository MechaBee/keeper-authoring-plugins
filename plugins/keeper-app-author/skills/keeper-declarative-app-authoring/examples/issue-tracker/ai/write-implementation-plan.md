# Write an implementation plan

A person gave this issue to the Agent, and the way to solve it is already clear:
a contained fix or change with no real design choices left. Your job is a plan a
developer, or a later agent session, can follow step by step without
rediscovering what you learned. People review it on the issue page before
anyone builds it.

## Before you write

- Read the issue (`issue`), the whole `conversation` (oldest first; later
  comments override the description), `sub_issues`, `links` and the issue's
  `documents`.
- If you are working in the code the issue is about, read the code the change
  touches and name the files. Do not change code in this procedure.
- If you find the approach has real choices after all (more than one sensible
  way, a data model or interface to decide), stop and use
  `write_solution_design` instead. If something you need is missing and a guess
  would change the plan, use `ask_questions`.

## The plan (`plan`)

Return the whole document as Markdown in `plan.body`, with:

- `title`: `Implementation plan: <the issue's title>`, at most 80 characters.
- `summary`: one or two sentences on what changes. People and agents read it
  before opening the document.

Use these sections, in this order. Leave out a section with nothing in it.

```markdown
# Implementation plan: <issue title>

Issue: <issue ref>

## Goal
What changes for the user, and what done looks like, in two or three sentences.

## Changes
The files, modules, tables or endpoints to change, each with one line on what
changes there.

## Steps
An ordered list a developer can follow; each step small enough to review on
its own, with the file it touches.

## Tests
The tests to add or update, and what to check by hand.

## Risks
What could break, and anything someone must confirm before merging.
```

Be concrete: real paths and names, no filler.

## The handover (`handover`)

`handover.body`: two or three sentences for the issue's conversation: the
change in one line, the size of the work, and anything the reviewer should look
at first. Don't repeat the plan. The issue shows it as written by Agent (on
behalf of the person who ran you).

## After saving

The issue leaves the Agent queue as **In review**. Tell the person the issue's
reference, the plan's title and that it waits for their review.
