#!/usr/bin/env node

const j2m = require('../index');
const { run } = require('./lib/cli');

run({
    command: 'md2jira',
    description: 'Convert Markdown to JIRA wiki markup.',
    convert: (input) => j2m.to_jira(input),
}).catch((err) => {
    process.stderr.write(`md2jira: ${err.message}\n`);
    process.exitCode = 1;
});
