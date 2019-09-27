import {TwingSandboxSecurityError} from "./security-error";
import {TwingSource} from "../source";

export class TwingSandboxSecurityNotAllowedTagError extends TwingSandboxSecurityError {
    private readonly tagName: string;

    constructor(message: string, tagName: string, lineno: number = -1, source: TwingSource = null) {
        super(message, lineno, source);
        this.tagName = tagName;
        this.name = 'TwingSandboxSecurityNotAllowedTagError';
    }

    getTagName() {
        return this.tagName;
    }
}
