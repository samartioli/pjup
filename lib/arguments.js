module.exports = function() {

    var argv = require('yargs')
        .usage('Usage: $0 [options]')
        .describe('p', 'new version prefix. only ~ or ^ supported')
        .help('h')
        .alias('h', 'help')
        .alias('p', 'prefix')
        .default('p', '')
        .example('$0', '')
        .example('$0 -p ^', 'use caret before new versions')
        .example('$0 -p \\~', 'be sure to escape tilde')
        .showHelpOnFail(true, "Specify --help for available options")
        .check(function(argv, options) {
            if (!argv.p) {
                argv.p
              return true;
            }
            if (argv.p === '~' || argv.p === '^') return true;
        })
        .argv;

    return argv;

}
