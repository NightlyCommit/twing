import {TwingSandboxSecurityError} from "./security-error";

/**
 * Exception thrown when a not allowed filter is used in a template.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingSandboxSecurityNotAllowedFilterError extends TwingSandboxSecurityError {
    private readonly filterName: string;

    constructor(message: string, filterName: string, lineno: number = -1, filename: string = null) {
        super(message, lineno, filename);
        this.filterName = filterName;
        this.name = 'TwingSandboxSecurityNotAllowedFilterError';
    }

    getFilterName() {
        return this.filterName;
    }
}
