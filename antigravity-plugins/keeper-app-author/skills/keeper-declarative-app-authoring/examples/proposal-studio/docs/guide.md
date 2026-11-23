# How to use Proposal Studio

Proposal Studio keeps everything your agent needs to write a good sales document in one place:
the opportunity's brief, the team's discussion, the files about the deal, and the library
documents you choose. Your agent (for example Claude Code or Codex with the MechaBee Workspace
Content plugin) writes the document; you review it here.

## 1. Fill the library

Open **Library**. Each collection on the left is a folder in your workspace (Company, Product,
Sales, Templates); add one with **New collection**. In a collection, use **New document**, or
**Upload** Markdown files, or drop them on the list. Files anyone puts in the folder with other
tools show up too.

Open a document to read or edit it. Give it a one-line **summary**: it is the first thing an agent
reads.

## 2. Brief the opportunity

On **Opportunities**, choose **New opportunity**. It gets a collection of its own for the deal's
documents. Then on its page:

- Fill in **Needs**, **Requirements** and **Decision criteria**. Agents treat these as the most
  important input.
- Use **Discussion** for decisions and questions. Agents read it, and later comments win.
- Under **Documents**, add the deal's own material, such as RFP extracts or call notes, with
  **New** or **Upload**.
- **Link…** a library document or a whole collection, and say why it matters here. Link a template
  as "Use this structure" to set the document's headings.

## 3. Ask your agent

Connected agents can do two tasks in this app. Try prompts like these:

- "In Proposal Studio, draft a proposal for the Northwind cold-chain opportunity. Lead with the
  monitoring service."
- "In Proposal Studio, draft a one-page executive summary for the Acme dispatch pilot."
- "In Proposal Studio, revise the Northwind security questionnaire answers to address the open
  review comments."

**Draft a document** saves a new document in the opportunity's documents as a Draft and posts the
agent's open questions to the opportunity's discussion. **Revise a document** waits for you: open
the document and choose **Review** under **Agent revisions** to see which lines it changes, then
accept or reject it.

## 4. Review

Open a document to read and edit it; **Focus** gives you the whole screen to write. Select a
passage and choose **Comment** to start a review thread on it. Use **Reply** to answer in the
thread, and **Resolve** once it is settled; agents skip resolved threads. Set the **Status** to In
review or Approved as it progresses.

## Good to know

- If someone edits a document after the agent read it, its revision can't be accepted, so a
  person's edit is never lost. Ask the agent to revise again.
- Agents can only write into collections with **Agent tasks** turned on (see **Edit collection**).
  Each opportunity's collection has it on; the library's don't.
- Agents read Markdown and plain text only. Convert PDFs and Word files to Markdown first.
- Documents are ordinary Markdown files under `docs/proposal-studio/` in your workspace. If one is
  renamed outside the app, open its collection and attach the document to the renamed file to keep
  its comments.
