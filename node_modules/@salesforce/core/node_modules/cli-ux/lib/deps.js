"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deps = {
    get stripAnsi() { return fetch('strip-ansi'); },
    get ansiStyles() { return fetch('ansi-styles'); },
    get ansiEscapes() { return fetch('ansi-escapes'); },
    get passwordPrompt() { return fetch('password-prompt'); },
    get screen() { return fetch('@oclif/screen'); },
    get prompt() { return fetch('./prompt').default; },
    get styledObject() { return fetch('./styled/object').default; },
    get styledHeader() { return fetch('./styled/header').default; },
    get styledJSON() { return fetch('./styled/json').default; },
    get table() { return fetch('./styled/table').default; },
};
const cache = {};
function fetch(s) {
    if (!cache[s]) {
        cache[s] = require(s);
    }
    return cache[s];
}
exports.default = exports.deps;
