import { ActionBase, ActionType } from './base';
export default class SpinnerAction extends ActionBase {
    type: ActionType;
    spinner?: number;
    frames: any;
    frameIndex: number;
    constructor();
    protected _start(): void;
    protected _stop(status: string): void;
    protected _pause(icon?: string): void;
    private _render(icon?);
    private _reset();
    private _frame();
    private _lines(s);
}
