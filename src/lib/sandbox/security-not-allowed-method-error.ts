import {TwingSandboxSecurityError} from "./security-error";
import {TwingSource} from "../source";

export class TwingSandboxSecurityNotAllowedMethodError extends TwingSandboxSecurityError {
    constructor(message: string, lineno: number = -1, source: TwingSource = null) {
        super(message, lineno, source);
        this.name = 'TwingSandboxSecurityNotAllowedMethodError';
    }
}
