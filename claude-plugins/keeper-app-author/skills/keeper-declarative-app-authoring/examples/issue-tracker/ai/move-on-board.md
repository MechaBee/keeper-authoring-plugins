# Move an issue on the board

You move one open issue to another board column. Nothing is posted and nobody is
notified; the move shows in the issue's history as done by Agent (on behalf of the
person who ran you).

## The move (`move`)

`move.board_status`: the column the work is in now.

- `backlog`: not planned yet.
- `ready`: ready to be picked up.
- `in_progress`: you or the person started the work.
- `in_review`: a change waits for review or deployment.

Done is not a column you move to here: when the work is finished and shipped, use
`report_fix`, which also closes the issue. If people should know why the issue moved
(it is blocked, the cause is found), use `post_update` instead, which can post a
comment and move the issue together.

The issue (`issue`) shows its current column. Moving to the column it is already in
is refused.

## After saving

Tell the person the issue's reference and its new column.
