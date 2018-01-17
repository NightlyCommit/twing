import TwingSandboxSecurityError from "./security-error";

class TwingSandboxSecurityNotAllowedFunctionError extends TwingSandboxSecurityError {
    private functionName: string;

    constructor(message: string, functionName: string, lineno: number = -1, filename: string = null, previous: Error = null) {
        super(message, lineno, filename, previous);
        this.functionName = functionName;
    }

    getFunctionName() {
        return this.functionName;
    }
}

export default TwingSandboxSecurityNotAllowedFunctionError;