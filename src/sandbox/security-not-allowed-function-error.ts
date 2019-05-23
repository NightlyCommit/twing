import {TwingSandboxSecurityError} from "./security-error";

export class TwingSandboxSecurityNotAllowedFunctionError extends TwingSandboxSecurityError {
    private functionName: string;

    constructor(message: string, functionName: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.functionName = functionName;
    }

    getFunctionName() {
        return this.functionName;
    }
}
