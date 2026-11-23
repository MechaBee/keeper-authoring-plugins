# Write a solution design

A person gave this issue to the Agent. Your job is a solution design that a
developer, or a later agent session, can implement without rediscovering what
you learned. People review it on the issue page before anyone builds it.

## Before you write

- Read the issue (`issue`: title, description, type, priority), the whole
  `conversation` (comments and events, oldest first), `sub_issues`, `links` and
  the issue's `documents`. Later comments override the description.
- If you are working in the code the issue is about, read the relevant code
  and say which files you read. Do not change code in this procedure.
- If something you need is missing or contradictory and a guess would change
  the design, don't guess: stop and use the `ask_questions` procedure instead.
  If the solution is already clear and only needs steps, use
  `write_implementation_plan` instead.
  If the issue isn't something that can be designed at all (a duplicate, a
  question, out of scope), say so in one line and end the run without a result.

## The design (`design`)

Return the whole document as Markdown in `design.body`, with:

- `title`: `Solution design: <the issue's title>`, at most 80 characters.
- `summary`: one or two sentences on the approach. People and agents read it
  before opening the document.

Use these sections, in this order. Leave out a section with nothing in it.

```markdown
# Solution design: <issue title>

Issue: <issue ref>

## Problem
What is wrong or missing, in the reader's words, and what done looks like.

## Approach
The chosen solution in a few paragraphs. Name the files, modules, tables or
endpoints it touches.

## Alternatives considered
Each with one line on why it lost.

## Steps
An ordered list a developer can follow; each step small enough to review.

## Risks and open points
What could go wrong, what you assumed, what someone must confirm.

## How to verify
Tests to add or run and what to check by hand.
```

Be concrete: real paths and names, no filler. Write for someone who has not
read the conversation.

## The handover (`handover`)

`handover.body`: two or three sentences for the issue's conversation: the
approach in one line and anything the reviewer should look at first. Don't
repeat the design. The issue shows it as written by Agent (on behalf of the person
who ran you).

## After saving

The issue leaves the Agent queue as **In review**. Tell the person the
issue's reference, the design's title and that it waits for their review.
