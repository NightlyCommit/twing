import {TwingExtension, TwingOperator} from "../extension";
import {TwingTokenParserFor} from "../token-parser/for";
import {TwingExpressionParser} from "../expression-parser";
import {TwingNodeExpressionBinaryAnd} from "../node/expression/binary/and";
import {TwingTokenParserExtends} from "../token-parser/extends";
import {TwingTokenParserFrom} from "../token-parser/from";
import {TwingTokenParserMacro} from "../token-parser/macro";
import {TwingNode, TwingNodeType} from "../node";
import {TwingNodeExpressionBinaryIn} from "../node/expression/binary/in";
import {TwingTokenParserIf} from "../token-parser/if";
import {TwingTokenParserSet} from "../token-parser/set";
import {TwingTokenParserBlock} from "../token-parser/block";
import {TwingNodeExpressionBinaryGreater} from "../node/expression/binary/greater";
import {TwingNodeExpressionBinaryLess} from "../node/expression/binary/less";
import {TwingTokenParserInclude} from "../token-parser/include";
import {TwingTokenParserWith} from "../token-parser/with";
import {TwingNodeExpressionUnaryNot} from "../node/expression/unary/not";
import {TwingNodeExpressionUnaryNeg} from "../node/expression/unary/neg";
import {TwingNodeExpressionUnaryPos} from "../node/expression/unary/pos";
import {TwingFunction} from "../function";
import {TwingTokenParserSpaceless} from "../token-parser/spaceless";
import {TwingNodeExpressionBinaryConcat} from "../node/expression/binary/concat";
import {TwingNodeExpressionBinaryMul} from "../node/expression/binary/mul";
import {TwingNodeExpressionBinaryDiv} from "../node/expression/binary/div";
import {TwingNodeExpressionBinaryFloorDiv} from "../node/expression/binary/floor-div";
import {TwingNodeExpressionBinaryMod} from "../node/expression/binary/mod";
import {TwingNodeExpressionBinarySub} from "../node/expression/binary/sub";
import {TwingNodeExpressionBinaryAdd} from "../node/expression/binary/add";
import {TwingTokenParserUse} from "../token-parser/use";
import {TwingTokenParserEmbed} from "../token-parser/embed";
import {TwingTokenParserFilter} from "../token-parser/filter";
import {TwingNodeExpressionBinaryRange} from "../node/expression/binary/range";
import {TwingTokenParserImport} from "../token-parser/import";
import {TwingTokenParserDo} from "../token-parser/do";
import {TwingTokenParserFlush} from "../token-parser/flush";
import {TwingNodeExpressionBinaryEqual} from "../node/expression/binary/equal";
import {TwingNodeExpressionBinaryNotEqual} from "../node/expression/binary/not-equal";
import {TwingNodeExpressionBinaryOr} from "../node/expression/binary/or";
import {TwingNodeExpressionBinaryBitwiseOr} from "../node/expression/binary/bitwise-or";
import {TwingNodeExpressionBinaryBitwiseXor} from "../node/expression/binary/bitwise-xor";
import {TwingNodeExpressionBinaryBitwiseAnd} from "../node/expression/binary/bitwise-and";
import {TwingNodeExpressionBinaryGreaterEqual} from "../node/expression/binary/greater-equal";
import {TwingNodeExpressionBinaryLessEqual} from "../node/expression/binary/less-equal";
import {TwingNodeExpressionBinaryNotIn} from "../node/expression/binary/not-in";
import {TwingNodeExpressionNullCoalesce} from "../node/expression/null-coalesce";
import {TwingNodeExpression} from "../node/expression";
import {TwingNodeExpressionBinaryPower} from "../node/expression/binary/power";
import {TwingNodeExpressionTestSameAs} from "../node/expression/test/same-as";
import {TwingNodeExpressionTestDefined} from "../node/expression/test/defined";
import {TwingNodeExpressionTestOdd} from "../node/expression/test/odd";
import {TwingNodeExpressionTestConstant} from "../node/expression/test/constant";
import {TwingTest} from "../test";
import {TwingNodeExpressionTestDivisibleBy} from "../node/expression/test/divisible-by";
import {TwingNodeExpressionBinaryMatches} from "../node/expression/binary/matches";
import {TwingNodeExpressionBinaryStartsWith} from "../node/expression/binary/starts-with";
import {TwingNodeExpressionBinaryEndsWith} from "../node/expression/binary/ends-with";
import {TwingFilter} from "../filter";
import {Settings as DateTimeSettings} from 'luxon';
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNodeExpressionFilterDefault} from "../node/expression/filter/default";
import {TwingNodeExpressionTestNull} from "../node/expression/test/null";
import {TwingNodeExpressionTestEven} from "../node/expression/test/even";
import {merge} from "../helper/merge";
import {slice} from "../helper/slice";
import {reverse} from "../helper/reverse";
import {first} from "../helper/first";
import {TwingSourceMapNodeSpaceless} from "../source-map/node/spaceless";
import {TwingSourceMapNodeConstructor} from "../source-map/node";
import {TwingTokenParserDeprecated} from "../token-parser/deprecated";
import {TwingTokenParserAutoEscape} from "../token-parser/auto-escape";
import {twingFunctionTemplateFromString} from "../core/functions/template-from-string";
import {twingFunctionDump} from "../core/functions/dump";
import {twingFilterRaw} from "../core/filters/raw";
import {TwingNodeVisitorEscaper} from "../node-visitor/escaper";
import {TwingFileExtensionEscapingStrategy} from "../file-extension-escaping-strategy";
import {TwingTokenParserSandbox} from '../token-parser/sandbox';
import {TwingNodeVisitorSandbox} from "../node-visitor/sandbox";
import {twingFunctionInclude} from "../core/functions/include";
import {twingFunctionCycle} from "../core/functions/cycle";
import {twingFunctionRandom} from "../core/functions/random";
import {twingFilterDate} from "../core/filters/date";
import {twingFilterDateModify} from "../core/filters/date-modify";
import {twingFilterReplace} from "../core/filters/replace";
import {twingFilterNumberFormat} from "../core/filters/number-format";
import {twingFilterRound} from "../core/filters/round";
import {twingFilterUrlEncode} from "../core/filters/url-encode";
import {twingFilterMerge} from "../core/filters/merge";
import {twingFilterSlice} from "../core/filters/slice";
import {twingFilterFirst} from "../core/filters/first";
import {twingFilterJoin} from "../core/filters/join";
import {twingFunctionDate} from "../core/functions/date";
import {twingFilterLast} from "../core/filters/last";
import {twingFilterFormat} from "../core/filters/format";
import {twingFilterAbs} from "../core/filters/abs";
import {twingFilterJsonEncode} from "../core/filters/json-encode";
import {twingFilterConvertEncoding} from "../core/filters/convert-encoding";
import {twingFilterTitle} from "../core/filters/title";
import {twingFilterCapitalize} from "../core/filters/capitalize";
import {twingFilterUpper} from "../core/filters/upper";
import {twingFilterLower} from "../core/filters/lower";
import {twingFilterStriptags} from "../core/filters/striptags";
import {twingFilterTrim} from "../core/filters/trim";
import {twingFilterNl2br} from "../core/filters/nl2br";
import {twingFilterSplit} from "../core/filters/split";
import {twingFilterSort} from "../core/filters/sort";
import {twingFilterBatch} from "../core/filters/batch";
import {twingFilterReverse} from "../core/filters/reverse";
import {twingFilterLength} from "../core/filters/length";
import {twingFilterDefault} from "../core/filters/default";
import {twingFilterKeys} from "../core/filters/keys";
import {twingFilterEscape} from "../core/filters/escape";
import {twingTestEmpty} from "../core/tests/empty";
import {twingTestIterable} from "../core/tests/iterable";
import {twingFunctionSource} from "../core/functions/source";
import {twingFunctionMax} from "../core/functions/max";
import {twingFunctionMin} from "../core/functions/min";
import {twingFunctionRange} from "../core/functions/range";
import {twingFunctionConstant} from "../core/functions/constant";
import {TwingTokenParserVerbatim} from "../token-parser/verbatim";

export class TwingExtensionCore extends TwingExtension {
    private dateFormats: Array<string> = ['F j, Y H:i', '%d days'];
    private numberFormat: Array<number | string> = [0, '.', ','];
    private timezone: string = null;
    private escapers: Map<string, Function> = new Map();
    private defaultStrategy: string | boolean | Function;

    /**
     * @param {string} defaultStrategy An escaping strategy
     */
    constructor(defaultStrategy: string | boolean | Function = 'html') {
        super();

        this.setDefaultStrategy(defaultStrategy);
    }

    /**
     * Sets the default strategy to use when not defined by the user.
     *
     * The strategy can be a valid PHP callback that takes the template
     * name as an argument and returns the strategy to use.
     *
     * @param {string|boolean|Function} defaultStrategy An escaping strategy
     */
    setDefaultStrategy(defaultStrategy: string | boolean | Function) {
        if (defaultStrategy === 'name') {
            defaultStrategy = TwingFileExtensionEscapingStrategy.guess;
        }

        this.defaultStrategy = defaultStrategy;
    }

    /**
     * Gets the default strategy to use when not defined by the user.
     *
     * @param {string|boolean} name The template name
     *
     * @returns {string|boolean} The default strategy to use for the template
     */
    getDefaultStrategy(name: string | boolean): string {
        let result: string;

        // disable string callables to avoid calling a function named html or js, or any other upcoming escaping strategy
        if (typeof this.defaultStrategy === 'function') {
            return this.defaultStrategy(name);
        }

        result = this.defaultStrategy as string;

        return result;
    }

    /**
     * Defines a new escaper to be used via the escape filter.
     *
     * @param {string} strategy     The strategy name that should be used as a strategy in the escape call
     * @param {Function} callable   A valid PHP callable
     */
    setEscaper(strategy: string, callable: Function) {
        this.escapers.set(strategy, callable);
    }

    /**
     * Gets all defined escapers.
     *
     * @returns {Map<string, Function>}
     */
    getEscapers() {
        return this.escapers;
    }

    /**
     * Sets the default format to be used by the date filter.
     *
     * @param {string} format The default date format string
     * @param {string} dateIntervalFormat The default date interval format string
     */
    setDateFormat(format: string = null, dateIntervalFormat: string = null) {
        if (format !== null) {
            this.dateFormats[0] = format;
        }

        if (dateIntervalFormat !== null) {
            this.dateFormats[1] = dateIntervalFormat;
        }
    }

    /**
     * Gets the default format to be used by the date filter.
     *
     * @return array The default date format string and the default date interval format string
     */
    getDateFormat() {
        return this.dateFormats;
    }

    /**
     * Sets the default timezone to be used by the date filter.
     *
     * @param {string} timezone The default timezone string or a TwingDateTimeZone object
     */
    setTimezone(timezone: string) {
        this.timezone = timezone;
    }

    /**
     * Gets the default timezone to be used by the date filter.
     *
     * @returns {string} The default timezone currently in use
     */
    getTimezone(): string {
        if (this.timezone === null) {
            this.timezone = DateTimeSettings.defaultZoneName;
        }

        return this.timezone;
    }

    /**
     * Sets the default format to be used by the number_format filter.
     *
     * @param {number} decimal the number of decimal places to use
     * @param {string} decimalPoint the character(s) to use for the decimal point
     * @param {string} thousandSep  the character(s) to use for the thousands separator
     */
    setNumberFormat(decimal: number, decimalPoint: string, thousandSep: string) {
        this.numberFormat = [decimal, decimalPoint, thousandSep];
    }

    /**
     * Get the default format used by the number_format filter.
     *
     * @return array The arguments for number_format()
     */
    getNumberFormat() {
        return this.numberFormat;
    }

    getTokenParsers() {
        return [
            new TwingTokenParserFor(),
            new TwingTokenParserIf(),
            new TwingTokenParserExtends(),
            new TwingTokenParserInclude(),
            new TwingTokenParserBlock(),
            new TwingTokenParserUse(),
            new TwingTokenParserFilter(),
            new TwingTokenParserMacro(),
            new TwingTokenParserImport(),
            new TwingTokenParserFrom(),
            new TwingTokenParserSet(),
            new TwingTokenParserSpaceless(),
            new TwingTokenParserFlush(),
            new TwingTokenParserDo(),
            new TwingTokenParserEmbed(),
            new TwingTokenParserWith(),
            new TwingTokenParserDeprecated(),
            new TwingTokenParserAutoEscape(),
            new TwingTokenParserSandbox(),
            new TwingTokenParserVerbatim()
        ];
    }

    getNodeVisitors() {
        return [
            new TwingNodeVisitorEscaper(),
            new TwingNodeVisitorSandbox()
        ];
    }

    getFilters() {
        return [
            // formatting filters
            new TwingFilter('date', twingFilterDate, {
                needs_environment: true
            }),
            new TwingFilter('date_modify', twingFilterDateModify, {
                needs_environment: true
            }),
            new TwingFilter('format', twingFilterFormat),
            new TwingFilter('replace', twingFilterReplace),
            new TwingFilter('number_format', twingFilterNumberFormat, {
                needs_environment: true
            }),
            new TwingFilter('abs', twingFilterAbs),
            new TwingFilter('round', twingFilterRound),

            // encoding
            new TwingFilter('url_encode', twingFilterUrlEncode),
            new TwingFilter('json_encode', twingFilterJsonEncode),
            new TwingFilter('convert_encoding', twingFilterConvertEncoding, {
                pre_escape: 'html',
                is_safe: ['html']
            }),

            // string filters
            new TwingFilter('title', twingFilterTitle, {
                needs_environment: true
            }),
            new TwingFilter('capitalize', twingFilterCapitalize, {
                needs_environment: true
            }),
            new TwingFilter('upper', twingFilterUpper, {
                needs_environment: true
            }),
            new TwingFilter('lower', twingFilterLower, {
                needs_environment: true
            }),
            new TwingFilter('striptags', twingFilterStriptags),
            new TwingFilter('trim', twingFilterTrim),
            new TwingFilter('nl2br', twingFilterNl2br, {
                pre_escape: 'html',
                is_safe: ['html']
            }),
            new TwingFilter('raw', twingFilterRaw, {
                is_safe: ['all']
            }),

            // array helpers
            new TwingFilter('join', twingFilterJoin),
            new TwingFilter('split', twingFilterSplit, {
                needs_environment: true
            }),
            new TwingFilter('sort', twingFilterSort),
            new TwingFilter('merge', twingFilterMerge),
            new TwingFilter('batch', twingFilterBatch),

            // string/array filters
            new TwingFilter('reverse', twingFilterReverse, {
                needs_environment: true
            }),
            new TwingFilter('length', twingFilterLength, {
                needs_environment: true
            }),
            new TwingFilter('slice', twingFilterSlice, {
                needs_environment: true
            }),
            new TwingFilter('first', twingFilterFirst, {
                needs_environment: true
            }),
            new TwingFilter('last', twingFilterLast, {
                needs_environment: true
            }),

            // iteration and runtime
            new TwingFilter('default', twingFilterDefault, {
                expression_factory: function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, columnno: number, tag: string) {
                    return new TwingNodeExpressionFilterDefault(node, filterName, methodArguments, lineno, columnno, tag);
                }
            }),
            new TwingFilter('keys', twingFilterKeys),

            // escaping
            new TwingFilter('escape', twingFilterEscape, {
                needs_environment: true,
                is_safe_callback: this.escapeFilterIsSafe
            }),
            new TwingFilter('e', twingFilterEscape, {
                needs_environment: true,
                is_safe_callback: this.escapeFilterIsSafe
            })
        ];
    }

    getFunctions() {
        return [
            new TwingFunction('max', twingFunctionMax),
            new TwingFunction('min', twingFunctionMin),
            new TwingFunction('range', twingFunctionRange),
            new TwingFunction('constant', twingFunctionConstant, {
                needs_environment: true
            }),
            new TwingFunction('cycle', twingFunctionCycle),
            new TwingFunction('random', twingFunctionRandom, {
                needs_environment: true
            }),
            new TwingFunction('date', twingFunctionDate, {
                needs_environment: true
            }),
            new TwingFunction('include', twingFunctionInclude, {
                needs_context: true,
                needs_environment: true,
                needs_source: true,
                is_safe: ['all']
            }),
            new TwingFunction('source', twingFunctionSource, {
                needs_environment: true,
                needs_source: true,
                is_safe: ['all']
            }),
            new TwingFunction('dump', twingFunctionDump, {
                is_safe: ['html'],
                needs_context: true,
                needs_environment: true
            }),
            new TwingFunction('template_from_string', twingFunctionTemplateFromString, {
                needs_environment: true
            })
        ];
    }

    getTests(): Array<TwingTest> {
        return [
            new TwingTest('even', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestEven(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('odd', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestOdd(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('defined', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestDefined(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('same as', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestSameAs(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('none', null, {
                node_factory: function (node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestNull(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('null', null, {
                node_factory: function (node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestNull(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('divisible by', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestDivisibleBy(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('constant', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestConstant(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('empty', twingTestEmpty),
            new TwingTest('iterable', twingTestIterable)
        ];
    }

    getOperators(): [Map<string, TwingOperator>, Map<string, TwingOperator>] {
        return [
            new Map([
                ['not', {
                    precedence: 50,
                    factory: function (expr: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionUnaryNot(expr, lineno, columnno) as any;
                    }
                }],
                ['-', {
                    precedence: 500,
                    factory: function (expr: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionUnaryNeg(expr, lineno, columnno) as any;
                    }
                }],
                ['+', {
                    precedence: 500,
                    factory: function (expr: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionUnaryPos(expr, lineno, columnno) as any;
                    }
                }]
            ]),
            new Map([
                ['or', {
                    precedence: 10,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryOr(left, right, lineno, columnno) as any;
                    }
                }],
                ['and', {
                    precedence: 15,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryAnd(left, right, lineno, columnno) as any;
                    }
                }],
                ['b-or', {
                    precedence: 16,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryBitwiseOr(left, right, lineno, columnno) as any;
                    }
                }],
                ['b-xor', {
                    precedence: 17,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryBitwiseXor(left, right, lineno, columnno) as any;
                    }
                }],
                ['b-and', {
                    precedence: 18,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryBitwiseAnd(left, right, lineno, columnno) as any;
                    }
                }],
                ['==', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryEqual(left, right, lineno, columnno) as any;
                    }
                }],
                ['!=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryNotEqual(left, right, lineno, columnno) as any;
                    }
                }],
                ['<', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryLess(left, right, lineno, columnno) as any;
                    }
                }],
                ['>', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryGreater(left, right, lineno, columnno) as any;
                    }
                }],
                ['>=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryGreaterEqual(left, right, lineno, columnno) as any;
                    }
                }],
                ['<=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryLessEqual(left, right, lineno, columnno) as any;
                    }
                }],
                ['not in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryNotIn(left, right, lineno, columnno) as any;
                    }
                }],
                ['in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryIn(left, right, lineno, columnno) as any;
                    }
                }],
                ['matches', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryMatches(left, right, lineno, columnno) as any;
                    }
                }],
                ['starts with', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryStartsWith(left, right, lineno, columnno) as any;
                    }
                }],
                ['ends with', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryEndsWith(left, right, lineno, columnno) as any;
                    }
                }],
                ['..', {
                    precedence: 25,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryRange(left, right, lineno, columnno) as any;
                    }
                }],
                ['+', {
                    precedence: 30,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryAdd(left, right, lineno, columnno) as any;
                    }
                }],
                ['-', {
                    precedence: 30,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinarySub(left, right, lineno, columnno) as any;
                    }
                }],
                ['~', {
                    precedence: 40,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryConcat(left, right, lineno, columnno) as any;
                    }
                }],
                ['*', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryMul(left, right, lineno, columnno) as any;
                    }
                }],
                ['/', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryDiv(left, right, lineno, columnno) as any;
                    }
                }],
                ['//', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryFloorDiv(left, right, lineno, columnno) as any;
                    }
                }],
                ['%', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryMod(left, right, lineno, columnno) as any;
                    }
                }],
                ['is', {
                    precedence: 100,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: null
                }],
                ['is not', {
                    precedence: 100,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: null
                }],
                ['**', {
                    precedence: 200,
                    associativity: TwingExpressionParser.OPERATOR_RIGHT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number, columnno: number) {
                        return new TwingNodeExpressionBinaryPower(left, right, lineno, columnno) as any;
                    }
                }],
                ['??', {
                    precedence: 300,
                    associativity: TwingExpressionParser.OPERATOR_RIGHT,
                    factory: function (left: TwingNodeExpression, right: TwingNodeExpression, lineno: number, columnno: number) {
                        return new TwingNodeExpressionNullCoalesce(left, right, lineno, columnno) as any;
                    }
                }]
            ])
        ];
    }

    getSourceMapNodeConstructors(): Map<TwingNodeType, TwingSourceMapNodeConstructor> {
        return new Map([
            [TwingNodeType.SPACELESS, TwingSourceMapNodeSpaceless]
        ]);
    }

    /**
     * @internal
     */
    escapeFilterIsSafe(filterArgs: TwingNode) {
        if (filterArgs.getNodes().size > 0) {
            let result: Array<string> = [];

            filterArgs.getNodes().forEach(function (arg) {
                if (arg instanceof TwingNodeExpressionConstant) {
                    result = [arg.getAttribute('value')];
                }
            });

            return result;
        } else {
            return ['html'];
        }
    }
}
