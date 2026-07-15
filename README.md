# jira2md

## JIRA to MarkDown text format converter
Convert from JIRA text formatting to GitHub Flavored MarkDown and back again. Also allows for both to be converted to HTML.

## Credits
This module was heavily inspired by the J2M project by Fokke Zandbergen (http://j2m.fokkezb.nl/). Major credit to Fokke (and other contributors) for establishing a lot of the fundamental RexExp patterns for this module to work.

## Installation
```
npm install jira2md
```

## Supported Conversions
NOTE: All conversion work bi-directionally (from jira to markdown and back again).

* Headers (H1-H6)
* Bold
* Italic
* Bold + Italic
* Un-ordered lists
* Ordered lists (with help from [aarbanas](https://github.com/aarbanas))
* Programming Language-specific code blocks (with help from herbert-venancio)
* Inline preformatted text spans
* Un-named links
* Named links
* Monospaced Text
* ~~Citations~~ (Removed in 2.0.0)
* Strikethroughs
* Inserts
* Superscripts
* Subscripts
* Single-paragraph blockquotes
* Tables (thanks to erykwarren)
* Panels (thanks to erykwarren)


## CLI

Installing the package globally (`npm install -g jira2md`) provides two commands:

* `md2jira` — Markdown → JIRA wiki markup
* `jira2md` — JIRA wiki markup → Markdown

Both follow the same usage conventions:

```
# Convert a file, printing the result to stdout
md2jira input.md

# Convert a file, writing the result to a file
md2jira input.md output.jira

# Read from stdin, write to stdout
cat input.md | md2jira

# Show usage
md2jira --help
```

`jira2md` works identically in the reverse direction:

```
jira2md input.jira
jira2md input.jira output.md
cat input.jira | jira2md
```

An explicit input file that doesn't exist causes the command to exit non-zero
with an error message on stderr.

## How to Use

### Markdown String

We'll refer to this as the `md` variable in the examples below.

```
**Some bold things**
*Some italic stuff*
## H2
<http://google.com>
```

### Atlassian Wiki Syntax

We'll refer to this as the `jira` variable in the examples below.

```
*Some bold things**
_Some italic stuff_
h2. H2
[http://google.com]
```

### Examples

```javascript
// Include the module
const j2m = require('jira2md');

// If converting from Mardown to Jira Wiki Syntax:
const jira = j2m.to_jira(md);

// If converting from Jira Wiki Syntax to Markdown:
const md = j2m.to_markdown(jira);

// If converting from Markdown to HTML:
const html = j2m.md_to_html(md);

// If converting from JIRA Wiki Syntax to HTML:
const html = j2m.jira_to_html(jira);
```
