"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const base_1 = require("./action/base");
exports.ActionBase = base_1.ActionBase;
const deps_1 = require("./deps");
const errors_1 = require("./errors");
exports.Errors = errors_1.default;
exports.CLIError = errors_1.CLIError;
const exit_1 = require("./exit");
exports.ExitError = exit_1.ExitError;
const Logger = require("./logger");
const output_1 = require("./output");
const Table = require("./styled/table");
exports.Table = Table;
const config_1 = require("./config");
exports.config = config_1.config;
exports.Config = config_1.Config;
const e = new EventEmitter();
const output = output_1.default(e);
const errors = errors_1.default(e);
const logger = Logger.default(e);
exports.cli = {
    config: config_1.config,
    trace: output('trace'),
    debug: output('debug'),
    info: output('info'),
    log: output('info'),
    warn: errors('warn'),
    error: errors('error'),
    fatal: errors('fatal'),
    exit(code = 1, error) { throw new exit_1.ExitError(code, error); },
    get prompt() { return deps_1.default.prompt.prompt; },
    get confirm() { return deps_1.default.prompt.confirm; },
    get action() { return config_1.config.action; },
    styledObject(obj, keys) { exports.cli.info(deps_1.default.styledObject(obj, keys)); },
    get styledHeader() { return deps_1.default.styledHeader; },
    get styledJSON() { return deps_1.default.styledJSON; },
    get table() { return deps_1.default.table; },
    async done() {
        config_1.config.action.stop();
        await logger.flush();
        // await flushStdout()
    }
};
exports.default = exports.cli;
process.once('exit', async () => {
    try {
        await exports.cli.done();
    }
    catch (err) {
        // tslint:disable no-console
        console.error(err);
        process.exitCode = 1;
    }
});
// async function flushStdout() {
//   function timeout(p: Promise<any>, ms: number) {
//     function wait(ms: number, unref: boolean = false) {
//       return new Promise(resolve => {
//         let t: any = setTimeout(resolve, ms)
//         if (unref) t.unref()
//       })
//     }
//     return Promise.race([p, wait(ms, true).then(() => cli.warn('timed out'))])
//   }
//   async function flush() {
//     let p = new Promise(resolve => process.stdout.once('drain', resolve))
//     process.stdout.write('')
//     return p
//   }
//   await timeout(flush(), 10000)
// }
