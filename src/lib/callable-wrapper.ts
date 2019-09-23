import {TwingError} from "./error";
import {TwingSource} from "./source";
import {TwingNode} from "./node";

const merge = require('merge');

export type TwingCallableWrapperOptions = {
    needs_environment?: boolean;
    needs_context?: boolean;
    needs_source?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<any>;
    is_safe_callback?: Function;
    deprecated?: string;
    alternative?: TwingCallableWrapper;
    expression_factory?: Function;
}

export abstract class TwingCallableWrapper {
    readonly name: string;
    readonly callable: Function;
    readonly options: TwingCallableWrapperOptions;

    private arguments: Array<any> = [];

    protected constructor(name: string, callable: Function, options: TwingCallableWrapperOptions = {}) {
        this.name = name;
        this.callable = callable;

        this.options = merge({
            needs_environment: false,
            needs_context: false,
            needs_source: false,
            is_variadic: false,
            is_safe: null,
            is_safe_callback: null,
            deprecated: false,
            alternative: null
        }, options);
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
            } catch (e) {
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


    isVariadic(): boolean {
        return this.options.is_variadic;
    }

    isDeprecated(): boolean {
        return this.options.deprecated ? true : false;
    }

    needsEnvironment(): boolean {
        return this.options.needs_environment;
    }

    needsContext(): boolean {
        return this.options.needs_context;
    }

    needsSource(): boolean {
        return this.options.needs_source;
    }

    getSafe(functionArgs: TwingNode): any[] {
        if (this.options.is_safe !== null) {
            return this.options.is_safe;
        }

        if (this.options.is_safe_callback) {
            return this.options.is_safe_callback(functionArgs);
        }

        return [];
    }

    getDeprecatedVersion() {
        return this.options.deprecated;
    }

    getAlternative() {
        return this.options.alternative;
    }

    setArguments(arguments_: Array<any>) {
        this.arguments = arguments_;
    }

    getArguments() {
        return this.arguments;
    }

    getExpressionFactory(): Function {
        return this.options.expression_factory;
    }
}
