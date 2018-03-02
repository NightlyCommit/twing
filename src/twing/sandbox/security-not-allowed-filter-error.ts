import {TwingSandboxSecurityError} from "./security-error";

/**
 * Exception thrown when a not allowed filter is used in a template.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingSandboxSecurityNotAllowedFilterError extends TwingSandboxSecurityError {
    private filterName: string;

    constructor(message: string, functionName: string, lineno: number = -1, filename: string = null, previous: Error = null) {
        super(message, lineno, filename, previous);
        this.filterName = functionName;
    }

    getFilterName() {
        return this.filterName;
    }
}
