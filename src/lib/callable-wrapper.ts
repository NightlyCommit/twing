import {TwingError} from "./error";
import {TwingSource} from "./source";
import {TwingNode} from "./node";

export type TwingCallable<T> = (...args: any[]) => Promise<T>;

export type TwingCallableArgument = {
    name: string,
    defaultValue?: any
};

export type TwingCallableWrapperOptions = {
    needs_template?: boolean;
    needs_context?: boolean;
    needs_output_buffer?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<any>;
    is_safe_callback?: Function;
    deprecated?: boolean | string;
    alternative?: string;
    expression_factory?: Function;
}

export abstract class TwingCallableWrapper<T> {
    readonly name: string;
    readonly callable: TwingCallable<T>;
    readonly acceptedArguments: TwingCallableArgument[];
    readonly options: TwingCallableWrapperOptions;

    private arguments: Array<any> = [];

    protected constructor(name: string, callable: TwingCallable<any>, acceptedArguments: TwingCallableArgument[], options: TwingCallableWrapperOptions = {}) {
        this.name = name;
        this.callable = callable;
        this.acceptedArguments = acceptedArguments;

        this.options = Object.assign({}, {
            needs_template: false,
            needs_context: false,
            needs_output_buffer: false,
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
     * @return TwingCallableArgument[]
     */
    getAcceptedArgments(): TwingCallableArgument[] {
        return this.acceptedArguments;
    }

    /**
     * Returns the traceable callable.
     *
     * @param {number} lineno
     * @param {TwingSource} source
     *
     * @return {TwingCallable<T>}
     */
    traceableCallable(lineno: number, source: TwingSource): TwingCallable<T> {
        let callable = this.callable;

        return function () {
            return (callable.apply(null, arguments) as Promise<T>).catch((e: TwingError) => {
                if (e.getTemplateLine() === -1) {
                    e.setTemplateLine(lineno);
                    e.setSourceContext(source);
                }

                throw e;
            });
        }
    }

    isVariadic(): boolean {
        return this.options.is_variadic;
    }

    isDeprecated(): boolean {
        return this.options.deprecated ? true : false;
    }

    needsTemplate(): boolean {
        return this.options.needs_template;
    }

    needsContext(): boolean {
        return this.options.needs_context;
    }

    needsOutputBuffer(): boolean {
        return this.options.needs_output_buffer;
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
