import { IEventEmitter } from './events';
export interface Message {
    type: 'error';
    severity: 'fatal' | 'error' | 'warn';
    error: CLIError;
}
export interface Options {
    exit?: number | false;
    context?: object;
}
export declare function getErrorMessage(err: any, opts?: {
    stack?: boolean;
}): string;
export declare class CLIError extends Error {
    code?: string;
    'cli-ux': {
        severity: 'fatal' | 'error' | 'warn';
        exit: number | false;
        context: object;
    };
    constructor(input: any, severity: 'fatal' | 'error' | 'warn', opts: Options);
}
declare const _default: (e: IEventEmitter) => (severity: "error" | "fatal" | "warn") => (input: string | Error, opts?: Options) => void;
export default _default;
