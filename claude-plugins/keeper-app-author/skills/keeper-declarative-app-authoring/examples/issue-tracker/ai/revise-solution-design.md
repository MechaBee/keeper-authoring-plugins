# Revise a design or plan

The issue is back in the Agent queue, so a person wants its solution design or
implementation plan changed. Revise that document in place; don't start a new
one.

## What to read

- `current`: the document as it stands now. Keep everything you aren't asked to
  change, including people's edits.
- `review`: comments on passages of the document (`anchor_quote` is the
  passage). Unresolved threads are what still needs answering.
- `conversation`: everything said on the issue, oldest first. The newest
  comments since the document was written, including a note left with "Hand back
  to the Agent", say what to change.
- `issue`, `sub_issues`, `links` and `documents` for the rest of the context.

If the request is unclear and a guess would change the document, stop and use
`ask_questions` instead.

## The revision (`design`)

Return the whole revised Markdown in `design.body`, keeping the section layout
of the original: a solution design keeps Problem, Approach, Alternatives
considered, Steps, Risks and open points, How to verify; an implementation plan
keeps Goal, Changes, Steps, Tests, Risks. Update `summary` if the approach
changed. The save is refused if someone edited the document after you read it;
then prepare a new run and revise the newer text.

## The handover (`handover`)

`handover.body`: what changed and which comments it answers, as a short list.
Don't paste the document. The issue shows it as written by Agent (on behalf of
the person who ran you).

## After saving

The issue leaves the Agent queue as **In review** again. Tell the person what
changed.
