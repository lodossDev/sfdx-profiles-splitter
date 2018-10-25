/// <reference types="strip-ansi" />
import screen = require('@oclif/screen');
import ansiStyles = require('ansi-styles');
import stripAnsi = require('strip-ansi');
import prompt = require('./prompt');
import styledHeader = require('./styled/header');
import styledJSON = require('./styled/json');
import styledObject = require('./styled/object');
import table = require('./styled/table');
export declare const deps: {
    readonly stripAnsi: typeof stripAnsi;
    readonly ansiStyles: typeof ansiStyles;
    readonly ansiEscapes: any;
    readonly passwordPrompt: any;
    readonly screen: typeof screen;
    readonly prompt: {
        prompt(name: string, options?: prompt.IPromptOptions): Promise<any>;
        confirm(message: string): Promise<boolean>;
    };
    readonly styledObject: typeof styledObject.default;
    readonly styledHeader: typeof styledHeader.default;
    readonly styledJSON: typeof styledJSON.default;
    readonly table: typeof table.default;
};
export default deps;
