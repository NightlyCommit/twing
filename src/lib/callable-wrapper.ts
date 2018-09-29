import {TwingError} from "./error";
import {TwingSource} from "./source";

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
     * Returns the callable to execute for this filter.
     *
     * @returns {Function}
     */
    getCallable() {
        return this.callable;
    }

    /**
     * Returns the callable to execute for this function.
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
