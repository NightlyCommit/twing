import {TwingNodeExpressionFilter} from "./node/expression/filter";
import {TwingNode} from "./node";
import {TwingNodeExpressionConstant} from "./node/expression/constant";
import {TwingCallableWrapperOptions, TwingCallableWrapper} from "./callable-wrapper";

let merge = require('merge');

export type TwingFilterOptions = TwingCallableWrapperOptions & {
    expression_factory?: Function;
    alternative?: TwingFilter;
    pre_escape?: string;
    preserves_safety?: Array<string>;
}

export class TwingFilter extends TwingCallableWrapper {
    private options: TwingFilterOptions;
    private methodArguments: Array<any> = [];

    constructor(name: string, callable: Function, options: TwingFilterOptions = {}) {
        super(name, callable);

        this.options = merge({
            'needs_environment': false,
            'needs_context': false,
            'needs_source': false,
            'is_variadic': false,
            'is_safe': null,
            'is_safe_callback': null,
            'pre_escape': null,
            'preserves_safety': null,
            'expression_factory': function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, columnno: number, tag: string = null) {
                return new TwingNodeExpressionFilter(node, filterName, methodArguments, lineno, columnno, tag);
            },
            'deprecated': false,
            'alternative': null,
        }, options);
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

    needsSource() {
        return this.options.needs_source;
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
