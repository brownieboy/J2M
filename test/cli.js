const should = require('chai').should();
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const md2jira = path.resolve(__dirname, '..', 'bin', 'md2jira.js');
const jira2md = path.resolve(__dirname, '..', 'bin', 'jira2md.js');

const testMd = path.resolve(__dirname, 'test.md');
const testJira = path.resolve(__dirname, 'test.jira');
const testToJira = path.resolve(__dirname, 'test-to-jira.jira');

/**
 * Runs a bin script, returning its stdout as a string.
 *
 * @param {string} script - Absolute path to the script to run
 * @param {string[]} args - Positional args / options for the script
 * @param {string} [input] - Optional string piped to the script's stdin
 * @returns {string} The captured stdout
 */
function runCli(script, args, input) {
    return execFileSync('node', [script, ...args], {
        encoding: 'utf8',
        input,
    });
}

describe('CLI', () => {
    let tmpDir;

    before(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'j2m-cli-'));
    });

    after(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    describe('md2jira', () => {
        it('converts a file to stdout', () => {
            const expected = fs.readFileSync(testToJira, 'utf8');
            const output = runCli(md2jira, [testMd]);
            output.should.eql(expected);
        });

        it('converts a file to an output file', () => {
            const expected = fs.readFileSync(testToJira, 'utf8');
            const outPath = path.join(tmpDir, 'out.jira');
            runCli(md2jira, [testMd, outPath]);
            fs.readFileSync(outPath, 'utf8').should.eql(expected);
        });

        it('converts stdin to stdout', () => {
            const output = runCli(md2jira, [], '**bold**');
            output.should.eql('*bold*');
        });

        it('passes fenced code blocks containing JSX through untouched', () => {
            const input = '```jsx\n<Foo />\n<>fragment</>\n```';
            const output = runCli(md2jira, [], input);
            output.should.eql('{code:jsx}\n<Foo />\n<>fragment</>\n{code}');
        });

        it('exits non-zero with an error for a missing input file', () => {
            const missing = path.join(tmpDir, 'does-not-exist.md');
            let err;
            try {
                runCli(md2jira, [missing]);
            } catch (e) {
                err = e;
            }
            should.exist(err);
            err.status.should.eql(1);
            err.stderr.should.match(/input file not found/);
        });

        it('prints help with --help', () => {
            const output = runCli(md2jira, ['--help']);
            output.should.match(/Usage:/);
            output.should.match(/md2jira/);
        });
    });

    describe('jira2md', () => {
        it('converts a file to stdout', () => {
            const expected = fs.readFileSync(testMd, 'utf8');
            const output = runCli(jira2md, [testJira]);
            output.should.eql(expected);
        });

        it('converts a file to an output file', () => {
            const expected = fs.readFileSync(testMd, 'utf8');
            const outPath = path.join(tmpDir, 'out.md');
            runCli(jira2md, [testJira, outPath]);
            fs.readFileSync(outPath, 'utf8').should.eql(expected);
        });

        it('converts stdin to stdout', () => {
            const output = runCli(jira2md, [], '*bold*');
            output.should.eql('**bold**');
        });

        it('exits non-zero with an error for a missing input file', () => {
            const missing = path.join(tmpDir, 'does-not-exist.jira');
            let err;
            try {
                runCli(jira2md, [missing]);
            } catch (e) {
                err = e;
            }
            should.exist(err);
            err.status.should.eql(1);
            err.stderr.should.match(/input file not found/);
        });

        it('prints help with --help', () => {
            const output = runCli(jira2md, ['--help']);
            output.should.match(/Usage:/);
            output.should.match(/jira2md/);
        });
    });
});
