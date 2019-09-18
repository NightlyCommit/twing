import {TwingSandboxSecurityError} from "./security-error";

export class TwingSandboxSecurityNotAllowedTagError extends TwingSandboxSecurityError {
    private tagName: string;

    constructor(message: string, functionName: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.tagName = functionName;
        this.name = 'TwingSandboxSecurityNotAllowedTagError';
    }

    getTagName() {
        return this.tagName;
    }
}
