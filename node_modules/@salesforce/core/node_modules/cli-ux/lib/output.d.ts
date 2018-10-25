import { IEventEmitter } from './events';
export interface Message {
    type: 'output';
    severity: 'trace' | 'debug' | 'info';
    data: any[];
}
export declare function render(m: Message): string;
declare const _default: (e: IEventEmitter) => (severity: "debug" | "info" | "trace") => (...data: any[]) => void;
export default _default;
