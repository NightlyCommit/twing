import {TwingError} from "./error";
import {TwingSource} from "./source";
import {TwingFilter} from "./filter";

export type TwingCallableWrapperOptions = {
    needs_environment?: boolean;
    needs_context?: boolean;
    needs_source?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<any>;
    is_safe_callback?: Function;
    deprecated?: string;
}

export abstract class TwingCallableWrapper {
    readonly name: string;
    readonly callable: Function;

    protected constructor(name: string, callable: Function) {
        this.name = name;
        this.callable = callable;
    }

    getName() {
        return this.name;
    }

    /**
     * @returns {Function}
     */
    getCallable() {
        return this.callable;
    }

    /**
     * Returns the traceable callable.
     *
     * @param {number} lineno
     * @param {TwingSource} source
     * @return {Function}
     */
    traceableCallable(lineno: number, source: TwingSource) {
        let callable = this.callable;

        return function () {
            try {
                return callable.apply(null, arguments);
            }
            catch (e) {
                if (e instanceof TwingError) {
                    if (e.getTemplateLine() === -1) {
                        e.setTemplateLine(lineno);
                        e.setSourceContext(source);
                    }
                }

                throw e;
            }
        };
    }
}
