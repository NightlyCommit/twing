import {TwingSandboxSecurityError} from "./security-error";

/**
 * Exception thrown when a not allowed class property is used in a template.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingSandboxSecurityNotAllowedPropertyError extends TwingSandboxSecurityError {
    private className: string;
    private propertyName: string

    constructor(message: string, className: string, propertyName: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.className = className;
        this.propertyName = propertyName;
    }

    getClassName() {
        return this.className;
    }

    getPropertyName() {
        return this.propertyName;
    }
}
