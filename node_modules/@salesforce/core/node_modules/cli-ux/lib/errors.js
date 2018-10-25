"use strict";
// tslint:disable no-console
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const clean = require("clean-stack");
const extract = require("extract-stack");
const indent = require("indent-string");
const _ = require("lodash");
const stripAnsi = require("strip-ansi");
const util_1 = require("util");
const config_1 = require("./config");
const deps_1 = require("./deps");
const object_1 = require("./styled/object");
const arrow = process.platform === 'win32' ? ' ×' : ' ✖';
function bangify(msg, c) {
    const lines = msg.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        lines[i] = c + line.substr(2, line.length);
        lines[i] = lines[i].trimRight();
    }
    return lines.join('\n');
}
function getErrorMessage(err, opts = {}) {
    const severity = (err['cli-ux'] && err['cli-ux'].severity) || 'error';
    const context = err['cli-ux'] && err['cli-ux'].context;
    function wrap(msg) {
        const linewrap = require('@heroku/linewrap');
        return linewrap(6, deps_1.default.screen.errtermwidth, {
            skip: /^\$ .*$/,
            skipScheme: 'ansi-color',
        })(msg);
    }
    let message;
    if (err.body) {
        // API error
        if (err.body.message) {
            message = util_1.inspect(err.body.message);
        }
        else if (err.body.error) {
            message = util_1.inspect(err.body.error);
        }
    }
    // Unhandled error
    if (err.message)
        message = err.message;
    if (context && !_.isEmpty(context)) {
        message += '\n\n' + stripAnsi(indent(object_1.default(err['cli-ux'].context), 4));
    }
    message = message || util_1.inspect(err);
    message = [
        _.upperFirst(severity === 'warn' ? 'warning' : severity),
        ': ',
        message,
    ].join('');
    if (config_1.config.showStackTrace || opts.stack || process.env.CI || severity === 'fatal' || config_1.config.debug) {
        if (severity === 'warn') {
            process.emitWarning(err);
        }
        else {
            // show stack trace
            let stack = err.stack || util_1.inspect(err);
            stack = clean(stack, { pretty: true });
            stack = extract(stack);
            message = [message, '', stack].join('\n');
        }
    }
    else {
        let bang = severity === 'warn' ? chalk_1.default.yellow(arrow) : chalk_1.default.red(arrow);
        if (severity === 'warn')
            bang = chalk_1.default.yellow(arrow);
        message = bangify(wrap(message), bang);
    }
    return message;
}
exports.getErrorMessage = getErrorMessage;
function displayError(err) {
    const severity = (err['cli-ux'] && err['cli-ux'].severity) || 'error';
    function getBang() {
        if (severity === 'warn')
            return chalk_1.default.yellowBright('!');
        if (severity === 'fatal')
            return chalk_1.default.bold.bgRedBright('!!!');
        return chalk_1.default.bold.redBright('!');
    }
    config_1.config.action.pause(() => {
        console.error(getErrorMessage(err));
    }, getBang());
}
class CLIError extends Error {
    constructor(input, severity, opts) {
        function getExitCode(options) {
            let exit = options.exit === undefined ? options.exitCode : options.exit;
            if (exit === false)
                return false;
            if (exit === undefined)
                return 1;
            return exit;
        }
        const err = typeof input === 'string' ? super(input) && this : input;
        err['cli-ux'] = err['cli-ux'] || {
            severity,
            exit: severity === 'warn' ? false : getExitCode(opts),
            context: Object.assign({}, config_1.config.context, opts.context),
        };
        return err;
    }
}
exports.CLIError = CLIError;
exports.default = (e) => {
    e.on('output', m => {
        if (m.type !== 'error')
            return;
        try {
            if (m.error['cli-ux'].exit === false)
                displayError(m.error);
        }
        catch (newErr) {
            console.error(newErr);
            console.error(m.error);
            process.exit(1);
        }
    });
    function handleUnhandleds() {
        if (config_1.config.errorsHandled)
            return;
        const handleError = (_) => async (err) => {
            // ignore EPIPE errors
            // these come from using | head and | tail
            // and can be ignored
            try {
                const cli = require('.').cli;
                if (err.code === 'EPIPE')
                    return;
                let exit = 1;
                if (err['cli-ux'] && typeof err['cli-ux'].exit === 'number') {
                    if (err.code === 'ESIGINT')
                        cli.action.stop(chalk_1.default.yellowBright('!'));
                    else if (err.code !== 'EEXIT')
                        displayError(err);
                    const c = err['cli-ux'].exit;
                    if (typeof c === 'number')
                        exit = c;
                }
                else {
                    cli.fatal(err, { exit: false });
                }
                await cli.done().catch(cli.debug);
                process.exit(exit);
            }
            catch (newError) {
                console.error(err);
                console.error(newError);
                process.exit(101);
            }
        };
        config_1.config.errorsHandled = true;
        process.once('SIGINT', () => {
            const cli = require('.').cli;
            const err = new Error();
            err.code = 'ESIGINT';
            cli.error(err);
        });
        process.on('unhandledRejection', handleError('unhandledRejection'));
        process.on('uncaughtException', handleError('uncaughtException'));
        process.stdout.on('error', handleError('stdout'));
        process.stderr.on('error', handleError('stdout'));
        e.on('error', handleError('cli-ux'));
    }
    handleUnhandleds();
    return (severity) => (input, opts = {}) => {
        if (!input)
            return;
        if (isCLIError(input))
            throw input;
        const error = new CLIError(input, severity, opts);
        const msg = { type: 'error', severity, error };
        e.emit('output', msg);
        if (error['cli-ux'].exit !== false)
            throw error;
    };
};
function isCLIError(input) {
    return input['cli-ux'];
}
