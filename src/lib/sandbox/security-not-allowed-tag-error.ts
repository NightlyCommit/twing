import {TwingSandboxSecurityError} from "./security-error";

export class TwingSandboxSecurityNotAllowedTagError extends TwingSandboxSecurityError {
    private readonly tagName: string;

    constructor(message: string, tagName: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.tagName = tagName;
        this.name = 'TwingSandboxSecurityNotAllowedTagError';
    }

    getTagName() {
        return this.tagName;
    }
}
