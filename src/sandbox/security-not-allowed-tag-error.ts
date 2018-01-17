import TwingSandboxSecurityError from "./security-error";

class TwingSandboxSecurityNotAllowedTagError extends TwingSandboxSecurityError {
    private tagName: string;

    constructor(message: string, functionName: string, lineno: number = -1, filename: string = null, previous: Error = null) {
        super(message, lineno, filename, previous);
        this.tagName = functionName;
    }

    getTagName() {
        return this.tagName;
    }
}

export default TwingSandboxSecurityNotAllowedTagError;