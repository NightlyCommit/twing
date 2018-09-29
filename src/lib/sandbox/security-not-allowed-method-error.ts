import {TwingSandboxSecurityError} from "./security-error";

export class TwingSandboxSecurityNotAllowedMethodError extends TwingSandboxSecurityError {
    private className: string;
    private methodName: string;

    constructor(message: string, className: string, methodName: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.className = className;
        this.methodName = methodName;
    }

    getClassName() {
        return this.className;
    }

    getMethodName() {
        return this.methodName;
    }
}
