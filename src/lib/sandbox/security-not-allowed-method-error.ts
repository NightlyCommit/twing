import {TwingSandboxSecurityError} from "./security-error";

export class TwingSandboxSecurityNotAllowedMethodError extends TwingSandboxSecurityError {
    constructor(message: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.name = 'TwingSandboxSecurityNotAllowedMethodError';
    }
}
