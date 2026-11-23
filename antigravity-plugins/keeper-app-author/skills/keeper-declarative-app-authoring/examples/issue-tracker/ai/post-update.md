# Post a progress update on an issue

You are working on this issue and the people on it should know where it stands.
Your update is posted as a comment. If the work moved, the issue can move on the
board at the same time. The issue stays open.

## Before you post

- Read the issue (`issue`) and the whole `conversation`, oldest first, so you
  don't repeat what is already said.
- Post when something changed that people would act on: you started, the cause
  is found, a fix is in review, the work is blocked or needs a decision. Don't
  post a running log.
- Pick `board_status` from where the work is now: `in_progress` when you
  started, `in_review` when a fix waits for review or deployment. Leave it empty
  when the column is still right. Done is set by `report_fix`, not here.
- When the work is finished and shipped, use `report_fix` instead.

## The update (`update`)

`update.body`: Markdown, short enough to read in a notification.

- First line: where it stands now ("Fix is in review: <link or name>").
- Then at most a few points: what you found or changed, and what happens next.
- If you need something from people, end with the question, addressed to whom.

No headings and no "I". The issue shows it under an **Update** heading, written
by Agent (on behalf of the person who ran you).

## After saving

Tell the person the issue's reference, and the column if it moved. The issue's
author and assignee are notified.
