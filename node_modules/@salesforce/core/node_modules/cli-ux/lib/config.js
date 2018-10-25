"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
const version = semver.parse(require('../package.json').version);
const globals = global['cli-ux'] || (global['cli-ux'] = {});
const actionType = (!!process.stdin.isTTY &&
    !!process.stderr.isTTY &&
    !process.env.CI &&
    process.env.TERM !== 'dumb' &&
    'spinner') || 'simple';
const Action = actionType === 'spinner' ? require('./action/spinner').default : require('./action/simple').default;
class Config {
    constructor() {
        this.logLevel = 'warn';
        this.outputLevel = 'info';
        this.action = new Action();
        this.errorsHandled = false;
        this.showStackTrace = true;
    }
    get debug() { return globals.debug || process.env.DEBUG === '*'; }
    set debug(v) { globals.debug = v; }
    get context() { return globals.context || {}; }
    set context(v) { globals.context = v; }
    get errlog() { return globals.errlog || {}; }
    set errlog(v) { globals.errlog = v; }
}
exports.Config = Config;
function fetch() {
    if (globals[version.major])
        return globals[version.major];
    return globals[version.major] = new Config();
}
exports.config = fetch();
exports.default = exports.config;
