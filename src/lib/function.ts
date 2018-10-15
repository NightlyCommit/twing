import {TwingNodeExpressionFunction} from "./node/expression/function";
import {TwingNode} from "./node";
import {TwingCallableWrapperOptions, TwingCallableWrapper} from "./callable-wrapper";

const merge = require('merge');

export type TwingFunctionOptions = TwingCallableWrapperOptions & {
    expression_factory?: Function;
    alternative?: TwingFunction;
}

export class TwingFunction extends TwingCallableWrapper {
    private options: TwingFunctionOptions;
    private arguments: Array<any> = [];

    /**
     * Creates a template function.
     *
     * @param {string} name Name of this function
     * @param {Function} callable A callable implementing the function. If null, you need to overwrite the "expression_factory" option to customize compilation.
     * @param {TwingFunctionOptions} options Options
     */
    constructor(name: string, callable: Function = null, options: TwingFunctionOptions = {}) {
        super (name, callable);

        this.options = merge({
            'needs_environment': false,
            'needs_context': false,
            'needs_source': false,
            'is_variadic': false,
            'is_safe': null,
            'is_safe_callback': null,
            'expression_factory': function (name: string, functionArguments: TwingNode, line: number) {
                return new TwingNodeExpressionFunction(name, functionArguments, line);
            },
            'deprecated': false,
            'alternative': null
        }, options);
    }

    getExpressionFactory() {
        return this.options.expression_factory;
    }

    setArguments(arguments_: Array<any>) {
        this.arguments = arguments_;
    }

    getArguments() {
        return this.arguments;
    }

    needsEnvironment() {
        return this.options.needs_environment;
    }

    needsContext() {
        return this.options.needs_context;
    }

    needsSource() {
        return this.options.needs_source;
    }

    getSafe(functionArgs: TwingNode) {
        if (this.options.is_safe !== null) {
            return this.options.is_safe;
        }

        if (this.options.is_safe_callback) {
            return this.options.is_safe_callback(functionArgs);
        }

        return [];
    }

    isVariadic() {
        return this.options.is_variadic;
    }

    isDeprecated() {
        return this.options.deprecated ? true : false;
    }

    getDeprecatedVersion() {
        return this.options.deprecated;
    }

    getAlternative() {
        return this.options.alternative;
    }
}
