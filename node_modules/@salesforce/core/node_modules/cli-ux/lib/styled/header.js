"use strict";
// tslint:disable restrict-plus-operands
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
function styledHeader(header) {
    process.stdout.write(chalk_1.default.dim('=== ') + chalk_1.default.bold(header) + '\n');
}
exports.default = styledHeader;
