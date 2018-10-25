"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
const config_1 = require("./config");
const deps_1 = require("./deps");
const Errors = require("./errors");
const Output = require("./output");
const timestamp = () => new Date().toISOString();
const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));
function chomp(s) {
    if (s.endsWith('\n'))
        return s.replace(/\n$/, '');
    return s;
}
function canWrite(severity) {
    switch (config_1.config.logLevel) {
        case 'error': return ['fatal', 'error'].includes(severity);
        case 'warn': return ['fatal', 'error', 'warn'].includes(severity);
        case 'info': return ['fatal', 'error', 'warn', 'info'].includes(severity);
        case 'debug': return ['fatal', 'error', 'warn', 'info', 'debug'].includes(severity);
        case 'trace': return ['fatal', 'error', 'warn', 'info', 'debug', 'trace'].includes(severity);
        default: return false;
    }
}
exports.default = (e) => {
    let flushing = Promise.resolve();
    let buffer = [];
    // it would be preferable to use createWriteStream
    // but it gives out EPERM issues on windows for some reason
    //
    // let stream: Promise<fs.WriteStream> | undefined
    // function getStream() {
    //   return stream = stream || (async () => {
    //     await fs.mkdirp(path.dirname(file))
    //     return fs.createWriteStream(file, {flags: 'a+', encoding: 'utf8'})
    //   })()
    // }
    const handleOutput = (m) => {
        if (!canWrite(m.severity))
            return;
        let msg = m.type === 'error' ? Errors.getErrorMessage(m.error, { stack: true }) : Output.render(m);
        msg = deps_1.default.stripAnsi(chomp(msg));
        let lines = msg.split('\n').map(l => `${timestamp()} ${l}`.trimRight());
        buffer.push(...lines);
        flush(50).catch(console.error);
    };
    e.on('output', handleOutput);
    async function flush(waitForMs = 0) {
        await wait(waitForMs);
        flushing = flushing.then(async () => {
            if (!config_1.config.errlog || buffer.length === 0)
                return;
            const file = config_1.config.errlog;
            const mylines = buffer;
            buffer = [];
            await fs.mkdirp(path.dirname(file));
            await fs.appendFile(file, mylines.join('\n') + '\n');
        });
        await flushing;
    }
    return { flush };
};
