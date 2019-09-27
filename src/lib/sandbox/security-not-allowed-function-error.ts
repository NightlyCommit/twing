import {TwingSandboxSecurityError} from "./security-error";
import {TwingSource} from "../source";

export class TwingSandboxSecurityNotAllowedFunctionError extends TwingSandboxSecurityError {
    private readonly functionName: string;

    constructor(message: string, functionName: string, lineno: number = -1, source: TwingSource = null) {
        super(message, lineno, source);
        this.functionName = functionName;
        this.name = 'TwingSandboxSecurityNotAllowedFunctionError';
    }

    getFunctionName() {
        return this.functionName;
    }
}
