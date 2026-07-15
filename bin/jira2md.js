#!/usr/bin/env node

const j2m = require('../index');
const { run } = require('./lib/cli');

run({
    command: 'jira2md',
    description: 'Convert JIRA wiki markup to Markdown.',
    convert: (input) => j2m.to_markdown(input),
}).catch((err) => {
    process.stderr.write(`jira2md: ${err.message}\n`);
    process.exitCode = 1;
});
