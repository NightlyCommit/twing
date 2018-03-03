import {TwingNodeExpressionFunction} from "./node/expression/function";
import {TwingNode} from "./node";

const merge = require('merge');

export type TwingFunctionOptions = {
    needs_environment?: boolean;
    needs_context?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<string>;
    is_safe_callback?: Function;
    expression_factory?: Function;
    deprecated?: string;
    alternative?: string;
}

export class TwingFunction {
    private name: string;
    private callable: Function;
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
        // if (__CLASS__ !== get_class($this)) {
        //     @trigger_error('Overriding '.__CLASS__.' is deprecated since version 2.4.0 and the class will be final in 3.0.', E_USER_DEPRECATED);
        // }

        this.name = name;
        this.callable = callable;
        this.options = merge({
            'needs_environment': false,
            'needs_context': false,
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

    getName() {
        return this.name;
    }

    /**
     * Returns the callable to execute for this function.
     *
     * @return callable|null
     */
    getCallable() {
        return this.callable;
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
