---
icon: "@spmpst::icon::file-pen-line"
title: "Writing Published Feluqa Documentation"
sidebarTitle: "Writing Docs"
description: "A workflow for writing accurate Feluqa docs that preserve product intent, use canonical terms, and stand on their own on the documentation site."
summary: "Provides a workflow for researching, drafting, and reviewing published Feluqa documentation. It covers preserving product intent and canonical terminology, site independence, honest implementation status, licensing and agent distinctions, global and accessible writing, file structure, and final review."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, agents, skills, documentation, writing]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Writing Published Feluqa Documentation

Use this workflow when creating or revising documentation intended for the
Feluqa documentation site. The site is independent of Feluqa's private source
tree. Write for
the people who will read the published page, and preserve the product owner's
meaning rather than turning it into a simpler but different idea.

## Read the source material first

1. Read the whole source document when the user names it as the basis for a
   page. Do not infer its thesis from one section or a search excerpt.
2. Read Feluqa's canonical taxonomy and product intent. Check the relevant
   architecture and implementation-status documents before making claims about
   terms or capabilities. Consult local planning notes when available, but do
   not treat them as published product guarantees.
3. Inspect the current documentation tree and nearby pages. Paths and
   numbering can change; do not assume a path from earlier conversation is
   still current.
4. Keep a short map of which ideas belong in which pages before drafting. Use
   a concept page for one idea, a product page for a product proposal, and a
   reference page for detailed behavior. Do not compress several distinct
   ideas into a generic summary.

## Preserve the owner's intent

- Keep the owner's actual thesis and distinctions. Do not reduce an idea about
  extensible Modules, Features, hooks, agents, local execution, privacy,
  compilation, and distribution to a generic statement about small teams or
  automation.
- When asked to remove one reference or phrase, make that narrow change and
  preserve the surrounding wording unless the user asks for a rewrite.
- Do not introduce analogies, competitors, authors, or claims the user has
  rejected. In particular, do not add a monopoly framing or a reference to
  Peter Thiel or *Zero to One* when writing Feluqa's own strategy.
- Retain the reader's agency. Prefer "your Product" or "your Application"
  when the reader may be a founder, company, CTO, developer, contractor,
  student, operator, or customer. Do not assume every reader personally wrote
  the software.
- If a commercial, licensing, or ownership promise is ambiguous, clarify it
  before publishing a commitment. Distinguish "free of charge" from freedom
  to use, modify, contribute, or distribute.

## Use the canonical taxonomy

Read Feluqa's [Taxonomy](/get-started/introduction/taxonomy)
before introducing or changing a domain term. In particular, keep these
boundaries clear:

- A **Product** is the business solution offered to an organisation or user.
- An **Application** is a deployable program for an execution role.
- A **Module** is a reusable unit of business capability included in an
  Application; a **Feature** is an optional capability within a Module or
  Application.
- The **Feluqa SDK** is the development API and tooling. The **Feluqa
  Platform** is the runtime and control plane. Do not use either term as a
  synonym for a customer Product.
- A **crate** is a Rust compilation unit; a **package** is a Cargo package;
  a **workspace** contains related packages and projects.

Avoid vague references such as "the repository" when they could mean the
private Feluqa source tree, a product workspace, a Cargo package, a crate, a
source distribution, or a customer's code. Name the exact thing.

## Keep site documentation independent of private source files

Published docs must make sense to someone who has never seen Feluqa's private
source tree. Do not link to local files such as `LICENSE.md`, `README.md`, or
`README_Product_Document_Intent.en.md` with relative filesystem paths. Summarise
the relevant content in the guide and link to another published guide page,
the public website, or a file distributed with the relevant source code.

Do not make an unavailable UI or CLI resource sound live. If a future System
Control Panel resource, public issue tracker, agent companion, or workflow is
planned, say it is planned and explain the current path only if one exists.

## Separate beliefs, targets, and delivered behavior

Use repository status documents and code to label claims accurately:

- **Delivered** means implemented and supported in the current repository.
- **Target** means an explicit product direction that is not yet a delivered
  guarantee.
- **Exploring** means a hypothesis under evaluation.

The product intent document is normative for product direction, but it does
not make a Target feature current. Do not present future dynamic Modules,
agent identities, local-agent orchestration, model-provider choice, hooks,
compile/package/distribute flows, or a companion project as implemented unless
the current status documentation confirms it. Use "is intended to", "is a
target", or "is planned" where appropriate.

Avoid unsupported percentages, performance claims, security guarantees, or
claims that proprietary or open-source licensing by itself makes software
secure. For technical security claims, use accurate wording and link to
authoritative references.

## Explain licensing and AI choices without conflating them

- Proprietary describes ownership and distribution; it does not by itself
  mean no participation, no contributions, or no right to create Products.
- State the owner's explicit guarantee about free Application creation and
  Product use before explaining framework ownership or optional services.
- Keep the rights to the Feluqa SDK and Platform distinct from rights to a
  customer Product, its Applications and Modules, and customer-specific source.
- If selective open-source releases are part of the stated direction, say
  which parts are confirmed and which crate-level decisions remain open. Do
  not imply every crate will be published.
- Feluqa is intended to support local agents and agents selected by the user.
  Explain that the local path can keep business-specific context in the
  organisation's controlled environment; do not promise that a remote agent
  will keep data private. Describe the complementary agent project as separate
  and planned until it exists.
- Do not imply agents can inject uncompiled code into a live application.
  Describe the intended workflow through explicit hooks/contracts, CLI
  inspection, generation, compilation, validation, testing, packaging, and
  controlled distribution; state which steps are not implemented yet.

When the content is a service offer, keep it in a clearly labelled section
after the reader-facing product and licensing explanation. Do not turn a
licensing introduction into an unexpected sales pitch.

## Voice, tone, and reader fit

Write for people first. Keep paragraphs short and focused, use headings and
lists to make long pages easy to scan, and add a diagram when it explains a
relationship more clearly than prose. Use a conversational, friendly, and
respectful voice: knowledgeable and natural, without slang, forced humor,
overfamiliarity, or a formal legalistic tone. Make the information useful to a
reader who may be in a hurry.

### Write clearly for readers across languages and experience levels

- Prefer familiar, precise words, active voice, and present tense. Put the
  person or thing doing the action near the beginning of the sentence. Address
  the reader directly as "you" when they perform the task; do not call them
  "the user" in instructions.
- Keep one main idea in each sentence. Prefer short sentences; fewer than 26
  words is a useful target, not a rigid limit. Avoid double negatives,
  exceptions to exceptions, unnecessary negative instructions, and unnecessary
  background that obscures what the reader needs to do.
- Use standard English word order, clear conditional clauses, and parallel
  structure in lists. Keep technical terms, names, capitalization, dates,
  units, formatting, and repeated phrases consistent throughout the page and
  across related pages. Repeat a word when that removes ambiguity.
- Choose simple verbs over formal or multiword phrases when their meaning is
  the same. Avoid phrasal verbs when a clear single verb works. Avoid vague
  modifiers such as "simply," "easy," "quickly," "properly," and
  "carefully"; state the actual result or action. Place modifiers such as
  "only" next to the words they qualify, and avoid long strings of noun
  modifiers.
- Keep the main subject and verb close to the beginning. Avoid ambiguous use
  of participles such as "using" when a reader could mistake which action or
  noun they describe. Use words in their primary sense, and avoid directional
  references such as "above," "below," or "on the right" when a section name,
  label, or sequence number is clearer.
- Write with translation and localization in mind. Localization can require
  adapting examples, units, dates, times, currencies, and interface language
  for a place; translation changes language; internationalization reduces
  the work needed to localize a product. Use unambiguous dates and measurements
  and avoid culturally specific jokes, holidays, sports, seasons, idioms,
  slang, and humor that may not travel well.

### Use terminology readers can understand

- Prefer plain, specific words to group-specific jargon, vague labels, or
  overloaded words such as "solution," "support," or "workload." Keep
  established technical terms when readers need them to find or understand a
  feature. Define an unfamiliar term at first use, or link to a trusted
  definition, and keep its meaning consistent.
- If a term is used once, explain it in plain language and include the
  specialist term in parentheses only when readers benefit from knowing it.
  If it recurs, define it on first use. For command names and code identifiers,
  use code formatting and make clear which literal item you mean.
- Use an abbreviation only when it helps the intended reader. Spell out an
  unfamiliar abbreviation at first use and add the abbreviation in
  parentheses. Avoid abbreviations unrelated to the page's subject and those
  used only once without benefit. Do not use "e.g.," "i.e.," internet shorthand
  such as "tl;dr" or "ymmv," or shortened forms when the full word is clearer.
  Follow standard spellings for technical names and file formats; don't alter
  code or interface labels to fit prose style.

### Write inclusively and describe people respectfully

- Use gender-neutral language when gender is irrelevant. Choose a diverse set
  of names, places, ages, and backgrounds in examples, and avoid assuming that
  every reader shares one culture, language, or experience.
- Avoid wording that divides or stereotypes people, including unnecessary
  references to "native" and "non-native" language ability. Avoid ableist,
  violent, graphic, or demeaning expressions when a precise alternative works.
  Do not describe nondisabled people as "normal" or define a person only by a
  disability. Follow the terminology preferred by the community being
  discussed; preferences differ, so check rather than assume.
- When an existing product identifier or code keyword uses a term that should
  not be repeated in prose, mention it only when necessary, format it as code,
  explain the preferred term, and use that term afterward. Preserve literal
  identifiers when documenting the code accurately.
- Avoid metaphors and figures of speech, including familiar engineering
  metaphors. They can distract, obscure technical meaning, exclude readers, or
  translate unpredictably. Use the precise technical name; if an established
  term has no accurate substitute, define it once and minimize repetition.

### Make documents accessible and easy to navigate

- Break up dense text with focused paragraphs, descriptive headings, and lists.
  Use a logical heading hierarchy without skipped levels. Put the key point
  near the start of a paragraph, use consistent list grammar, and avoid hard
  line breaks inside prose paragraphs.
- Write link text that explains the destination when read on its own. Avoid
  "click here" and "read this." Introduce interactive elements before the
  instructions for using them. Refer to controls by their visible labels, not
  by color, shape, position, or an icon alone; explain unexpected link actions.
- Prefer prose or a list to a table when that is clearer. Introduce a table
  before it appears, use clear headings, and do not merge cells. Do not put
  essential information only in an image, color, position, or formatting.
  Provide equivalent text for diagrams and screenshots; give informative
  images useful alternative text and decorative images empty alternative text.
  Use actual text for code, terminal output, and text that readers must search
  or copy.
- For web documentation, prefer semantic HTML and native controls. Make every
  control keyboard reachable and labelled. Keep DOM and visual reading order
  aligned, ensure adequate color contrast, do not hide content from assistive
  technology, and do not depend on hover alone. Provide captions, transcripts,
  or descriptions for audio and video, and avoid flashing content.
- Check whether the page still communicates without color, images, sound,
  punctuation, or a mouse, and with magnified text. When practical, inspect
  rendered pages with keyboard navigation and a screen reader. Document
  product accessibility features and explain how to use them.

### Use punctuation with restraint

- End complete sentences with periods; do not put periods at the end of
  headings. Avoid exclamation points in reference and concept pages and
  usually in procedures. Tutorials may use one sparingly to mark a genuine
  milestone. System messages and code examples can retain punctuation required
  by their exact literal text or syntax.
- Keep punctuation from carrying meaning that disappears for screen-reader
  users. Avoid unnecessary question marks, semicolons, ampersands in prose or
  headings, and punctuation inside acronyms. Keep one space between sentences.
  When a URL appears in prose, make it clear that a following period is not part
  of the address.

These are Feluqa's writing defaults. They do not override the canonical
taxonomy, accurate technical names, the owner's meaning, or a specific user
instruction. Follow narrow edits narrowly. If a general style rule conflicts
with clarity for a particular audience, choose the clearer wording and keep
the terminology consistent.

## Structure and file naming

- Keep one concept per Markdown file in the relevant concepts section; keep
  agent extensibility in `020-agentic-development/`.
  Use a descriptive, topic-specific filename such as
  `010-agent-ready-extensible-modules.en.md`.
- Choose filenames and page titles that remain distinct across the whole
  future site. Avoid generic repeated names such as `overview`, `concepts`, or
  `getting-started` when a more specific slug is available.
- The `.en.md` suffix identifies English. Do not repeat it with `lang: en` in
  front matter.
- Include the required `icon` field and follow nearby front-matter structure.
- Use an ordered folder structure consistently; add an Upgrade Guide only
  when a prior major version exists to upgrade from.

## Use the built-in Markdown features

The documentation site uses VitePress's Markdown renderer. Prefer its native
features over hand-written HTML: heading anchors, internal links without file
extensions, tables, task lists, footnotes, emoji, `[[toc]]`, callout
containers, GitHub-style alerts, syntax highlighting, line highlighting,
snippets, and lazy-loaded images are available.

Use a code group when readers need to compare valid alternatives for the same
task. Give every tab a short, meaningful label and keep the examples focused
on the difference being explained:

::: code-group

```rust [Derived resource]
#[derive(feluqa::Model, feluqa::Resource)]
pub struct Customer {
    #[field(text, required)]
    pub name: String,
}
```

```rust [Custom resource]
pub struct CustomerResource;

impl Resource for CustomerResource {
    type Model = Customer;
}
```

:::

Use `::: tip`, `::: info`, `::: warning`, `::: danger`, and `::: details`
for short, relevant asides. Keep ordinary explanation in the page body, and
use fenced code blocks with a language identifier so VitePress can highlight
them. Use line highlighting only when it helps readers focus on specific
changes.

## Final review

Before finishing:

1. Compare the page against the owner's source text and confirm the core idea
   has not been flattened, contradicted, or expanded into an unapproved
   promise.
2. Check Product, Application, Module, Feature, SDK, Platform, and CLI usage
   against the Taxonomy.
3. Verify implementation-status statements against the current repository
   guidance. Treat unknown or incomplete behavior as unknown or incomplete.
4. Check every local link from the page's actual location. Do not rely on
   local source-tree links for a published site.
5. Run `git diff --check`. For documentation-only changes, review links,
   terminology, front matter, and rendering structure; do not run a runtime
   test suite unless requested or required by repository guidance.

6. Apply the Feluqa voice and tone and the global-writing guidance above.
   Check that the prose stays concise, approachable, inclusive, and precise
   without changing the author's intended point.
