import {TwingSandboxSecurityError} from "./security-error";

export class TwingSandboxSecurityNotAllowedTagError extends TwingSandboxSecurityError {
    private tagName: string;

    constructor(message: string, functionName: string, lineno: number, filename: string = null) {
        super(message, lineno, filename);

        this.name = 'TwingSandboxSecurityNotAllowedTagError';
        this.tagName = functionName;
    }

    getTagName() {
        return this.tagName;
    }
}
