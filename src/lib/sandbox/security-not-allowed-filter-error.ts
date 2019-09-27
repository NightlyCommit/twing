import {TwingSandboxSecurityError} from "./security-error";
import {TwingSource} from "../source";

/**
 * Exception thrown when a not allowed filter is used in a template.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingSandboxSecurityNotAllowedFilterError extends TwingSandboxSecurityError {
    private readonly filterName: string;

    constructor(message: string, filterName: string, lineno: number = -1, source: TwingSource = null) {
        super(message, lineno, source);
        this.filterName = filterName;
        this.name = 'TwingSandboxSecurityNotAllowedFilterError';
    }

    getFilterName() {
        return this.filterName;
    }
}
