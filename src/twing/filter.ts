import {TwingNodeExpressionFilter} from "./node/expression/filter";
import {TwingNode} from "./node";
import {TwingNodeExpressionConstant} from "./node/expression/constant";
import {TwingEnvironment} from "./environment";

let merge = require('merge');

export type TwingFilterOptions = {
    needs_environment?: boolean;
    needs_context?: boolean;
    is_variadic?: boolean;
    is_safe?: Array<any>;
    is_safe_callback?: Function;
    pre_escape?: string;
    preserves_safety?: Array<string>;
    expression_factory?: Function;
    deprecated?: string;
    alternative?: TwingFilter;
}

export class TwingFilter {
    private name: string;
    private callable: Function;
    private options: TwingFilterOptions;
    private methodArguments: Array<any> = [];

    constructor(name: string, callable: Function, options: TwingFilterOptions = {}) {
        this.name = name;
        this.callable = callable;
        this.options = merge({
            'needs_environment': false,
            'needs_context': false,
            'is_variadic': false,
            'is_safe': null,
            'is_safe_callback': null,
            'pre_escape': null,
            'preserves_safety': null,
            'expression_factory': function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag: string = null) {
                return new TwingNodeExpressionFilter(node, filterName, methodArguments, lineno, tag);
            },
            'deprecated': false,
            'alternative': null,
        }, options);
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
     *
     * @returns {Function}
     */
    getExpressionFactory() {
        return this.options.expression_factory;
    }

    setArguments(someArguments: Array<any>) {
        this.methodArguments = someArguments;
    }

    getArguments() {
        return this.methodArguments;
    }

    needsEnvironment() {
        return this.options.needs_environment;
    }

    needsContext() {
        return this.options.needs_context;
    }

    /**
     *
     * @param {TwingNode} filterArgs
     * @returns boolean
     */
    getSafe(filterArgs: TwingNode) {
        if (this.options.is_safe) {
            return this.options.is_safe;
        }

        if (this.options.is_safe_callback) {
            return this.options.is_safe_callback.call(this, filterArgs);
        }
    }

    getPreservesSafety() {
        return this.options.preserves_safety;
    }

    getPreEscape() {
        return this.options.pre_escape;
    }

    isVariadic() {
        return this.options.is_variadic;
    }

    isDeprecated() {
        return this.options.deprecated;
    }

    /**
     *
     * @returns {string}
     */
    getDeprecatedVersion() {
        return this.options.deprecated;
    }

    /**
     *
     * @returns {TwingFilter}
     */
    getAlternative() {
        return this.options.alternative;
    }
}
