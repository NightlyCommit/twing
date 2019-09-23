import {TwingSandboxSecurityError} from "./security-error";

/**
 * Exception thrown when a not allowed class property is used in a template.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingSandboxSecurityNotAllowedPropertyError extends TwingSandboxSecurityError {
    constructor(message: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.name = 'TwingSandboxSecurityNotAllowedPropertyError';
    }
}
