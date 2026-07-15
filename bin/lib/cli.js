const fs = require('fs');

/**
 * Reads the entire standard input stream as a UTF-8 string.
 *
 * @returns {Promise<string>} The full stdin contents
 */
function readStdin() {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
        });
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', reject);
    });
}

/**
 * Builds the usage/help text for a conversion command.
 *
 * @param {string} command - The command name (e.g. "md2jira")
 * @param {string} description - One-line description of what the command does
 * @returns {string} The formatted help text
 */
function usage(command, description) {
    return [
        description,
        '',
        'Usage:',
        `  ${command} [input] [output]`,
        '',
        'Arguments:',
        '  input    Input file to read. If omitted, reads from stdin.',
        '  output   Output file to write. If omitted, writes to stdout.',
        '',
        'Options:',
        '  -h, --help   Show this help text and exit.',
        '',
        'Examples:',
        `  ${command} input.md              Convert file, print result to stdout`,
        `  ${command} input.md output.jira  Convert file, write result to a file`,
        `  cat input.md | ${command}        Convert stdin, print result to stdout`,
    ].join('\n');
}

/**
 * Runs a conversion CLI: parses args, reads input (file arg or stdin),
 * applies the given conversion function, and writes output (file arg or stdout).
 *
 * @param {object} options - CLI options
 * @param {string} options.command - The command name (e.g. "md2jira")
 * @param {string} options.description - One-line description shown in help
 * @param {Function} options.convert - The conversion function (string in, string out)
 * @param {string[]} [options.argv] - Argument list (defaults to process.argv.slice(2))
 * @returns {Promise<void>}
 */
async function run({ command, description, convert, argv = process.argv.slice(2) }) {
    if (argv.includes('-h') || argv.includes('--help')) {
        process.stdout.write(`${usage(command, description)}\n`);
        return;
    }

    const [inputPath, outputPath] = argv;

    let input;
    if (inputPath) {
        if (!fs.existsSync(inputPath)) {
            process.stderr.write(`${command}: input file not found: ${inputPath}\n`);
            process.exitCode = 1;
            return;
        }
        input = fs.readFileSync(inputPath, 'utf8');
    } else {
        input = await readStdin();
    }

    const output = convert(input);

    if (outputPath) {
        fs.writeFileSync(outputPath, output);
    } else {
        process.stdout.write(output);
    }
}

module.exports = { run, usage, readStdin };
