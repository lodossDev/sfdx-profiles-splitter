"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const config_1 = require("./config");
function render(m) {
    const msg = m.data.map(a => typeof a === 'string' ? a : util_1.inspect(a)).join(' ');
    return msg + '\n';
}
exports.render = render;
function shouldLog(m) {
    switch (config_1.config.outputLevel) {
        case 'info': return m.severity === 'info';
        case 'debug': return ['info', 'debug'].includes(m.severity);
        case 'trace': return ['info', 'debug', 'trace'].includes(m.severity);
        default: return false;
    }
}
exports.default = (e) => {
    e.on('output', m => {
        if (m.type !== 'output')
            return;
        if (!shouldLog(m))
            return;
        process.stdout.write(render(m));
    });
    return (severity) => (...data) => {
        const msg = { type: 'output', severity, data };
        e.emit('output', msg);
    };
};
