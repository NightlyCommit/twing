import TwingExtension from "../extension";
import TwingTokenParserFor from "../token-parser/for";
import TwingExpressionParser from "../expression-parser";
import TwingNodeExpressionBinaryAnd from "../node/expression/binary/and";
import TwingTokenParserExtends from "../token-parser/extends";
import TwingTokenParserFrom from "../token-parser/from";
import TwingTokenParserMacro from "../token-parser/macro";
import TwingNode from "../node";
import TwingNodeExpressionBinaryIn from "../node/expression/binary/in";
import TwingOperatorDefinitionInterface from "../operator-definition-interface";
import TwingTokenParserIf from "../token-parser/if";
import TwingTokenParserSet from "../token-parser/set";
import TwingTokenParserBlock from "../token-parser/block";
import TwingNodeExpressionBinaryGreater from "../node/expression/binary/greater";
import TwingNodeExpressionBinaryLess from "../node/expression/binary/less";
import TwingTokenParserInclude from "../token-parser/include";
import TwingTokenParserWith from "../token-parser/with";
import TwingNodeExpressionUnaryNot from "../node/expression/unary/not";
import TwingNodeExpressionUnaryNeg from "../node/expression/unary/neg";
import TwingNodeExpressionUnaryPos from "../node/expression/unary/pos";
import TwingFunction from "../function";
import TwingTokenParserSpaceless from "../token-parser/spaceless";
import TwingMap from "../map";
import TwingNodeExpressionBinaryConcat from "../node/expression/binary/concat";
import TwingNodeExpressionBinaryMul from "../node/expression/binary/mul";
import TwingNodeExpressionBinaryDiv from "../node/expression/binary/div";
import TwingNodeExpressionBinaryFloorDiv from "../node/expression/binary/floor-div";
import TwingNodeExpressionBinaryMod from "../node/expression/binary/mod";
import TwingNodeExpressionBinarySub from "../node/expression/binary/sub";
import TwingNodeExpressionBinaryAdd from "../node/expression/binary/add";
import TwingTokenParserUse from "../token-parser/use";
import TwingTokenParserEmbed from "../token-parser/embed";
import TwingTokenParserFilter from "../token-parser/filter";
import TwingNodeExpressionBinaryRange from "../node/expression/binary/range";
import TwingTokenParserImport from "../token-parser/import";
import TwingTokenParserDo from "../token-parser/do";
import TwingTokenParserFlush from "../token-parser/flush";
import TwingNodeExpressionBinaryEqual from "../node/expression/binary/equal";
import TwingNodeExpressionBinaryNotEqual from "../node/expression/binary/not-equal";
import TwingNodeExpressionBinaryOr from "../node/expression/binary/or";
import TwingNodeExpressionBinaryBitwiseOr from "../node/expression/binary/bitwise-or";
import TwingNodeExpressionBinaryBitwiseXor from "../node/expression/binary/bitwise-xor";
import TwingNodeExpressionBinaryBitwiseAnd from "../node/expression/binary/bitwise-and";
import TwingNodeExpressionBinaryGreaterEqual from "../node/expression/binary/greater-equal";
import TwingNodeExpressionBinaryLessEqual from "../node/expression/binary/less-equal";
import TwingNodeExpressionBinaryNotIn from "../node/expression/binary/not-in";
import TwingNodeExpressionNullCoalesce from "../node/expression/null-coalesce";
import TwingNodeExpression from "../node/expression";
import TwingNodeExpressionBinaryPower from "../node/expression/binary/power";
import TwingNodeExpressionTestSameAs from "../node/expression/test/same-as";
import TwingNodeExpressionTestDefined from "../node/expression/test/defined";
import TwingNodeExpressionTestOdd from "../node/expression/test/odd";
import TwingNodeExpressionTestConstant from "../node/expression/test/constant";
import TwingTest from "../test";
import TwingNodeExpressionTestDivisibleBy from "../node/expression/test/divisible-by";
import TwingNodeExpressionBinaryMatches from "../node/expression/binary/matches";
import TwingNodeExpressionBinaryStartsWith from "../node/expression/binary/starts-with";
import TwingNodeExpressionBinaryEndsWith from "../node/expression/binary/ends-with";
import TwingFilter from "../filter";

import {DateTime, Interval, Settings as DateTimeSettings} from 'luxon';
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeExpressionFilterDefault from "../node/expression/filter/default";
import TwingNodeExpressionTestNull from "../node/expression/test/null";
import TwingNodeExpressionTestEven from "../node/expression/test/even";

const sprintf = require('locutus/php/strings/sprintf');
const nl2br = require('locutus/php/strings/nl2br');
const strip_tags = require('locutus/php/strings/strip_tags');
const mt_rand = require('locutus/php/math/mt_rand');
const array_rand = require('locutus/php/array/array_rand');

import twingMin from '../helper/min';
import twingMax from '../helper/max';
import isTraversable from '../helper/is-traversable';
import twingAbs from "../helper/abs";
import twingJsonEncode from "../helper/json-encode";
import TwingEnvironment from "../environment";
import iconv from "../helper/iconv";
import TwingErrorRuntime from "../error/runtime";
import iteratorToArray from "../helper/iterator-to-array";
import * as moment from "moment";
import formatDateTime from "../helper/format-date-time";
import formatDateInterval from "../helper/format-date-interval";
import iteratorToHash from "../helper/iterator-to-hash";
import {isNullOrUndefined} from "util";
import iteratorToMap from "../helper/iterator-to-map";
import twingCompare from "../helper/compare";
import TwingExtensionSandbox from "./sandbox";
import TwingErrorLoader from "../error/loader";
import defined from "../helper/defined";
import TwingSource from "../source";
import TwingTemplate from "../template";
import escape from "../helper/escape";
import twingRange from "../helper/range";
import relativeDate from "../helper/relative-date";

class TwingExtensionCore extends TwingExtension {
    private dateFormats: Array<string> = ['F j, Y H:i', '%d days'];
    private numberFormat: Array<number | string> = [0, '.', ','];
    private timezone: string = null;
    private escapers: TwingMap<string, Function> = new TwingMap();

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
     * @returns {TwingMap<string, Function>}
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
            new TwingTokenParserWith()
        ];
    }

    getFilters() {
        return [
            // formatting filters
            new TwingFilter('date', twingDateFormatFilter, {needs_environment: true}),
            new TwingFilter('date_modify', twingDateModifyFilter, {needs_environment: true}),
            new TwingFilter('format', sprintf),
            new TwingFilter('replace', twingReplaceFilter),
            new TwingFilter('number_format', twingNumberFormatFilter, {
                needs_environment: true
            }),
            new TwingFilter('abs', twingAbs), // we can'u use Math.abs here since native functions are not reflectable
            new TwingFilter('round', twingRound),

            // encoding
            new TwingFilter('url_encode', twingUrlencodeFilter),
            new TwingFilter('json_encode', twingJsonEncode), // we can'u use JSON.stringify here since native functions are not reflectable
            new TwingFilter('convert_encoding', twingConvertEncoding, {
                pre_escape: 'html',
                is_safe: ['html']
            }),

            // string filters
            new TwingFilter('title', twingTitleStringFilter, {needs_environment: true}),
            new TwingFilter('capitalize', twingCapitalizeStringFilter, {needs_environment: true}),
            new TwingFilter('upper', twingUpperFilter, {needs_environment: true}),
            new TwingFilter('lower', twingLowerFilter, {needs_environment: true}),
            new TwingFilter('striptags', strip_tags),
            new TwingFilter('trim', twingTrimFilter),
            new TwingFilter('nl2br', nl2br, {
                pre_escape: 'html',
                is_safe: ['html']
            }),

            // array helpers
            new TwingFilter('join', twingJoinFilter),
            new TwingFilter('split', twingSplitFilter, {needs_environment: true}),
            new TwingFilter('sort', twingSortFilter),
            new TwingFilter('merge', twingArrayMerge),
            new TwingFilter('batch', twingArrayBatch),

            // string/array filters
            new TwingFilter('reverse', twingReverseFilter, {needs_environment: true}),
            new TwingFilter('length', twingLengthFilter, {needs_environment: true}),
            new TwingFilter('slice', twingSlice, {needs_environment: true}),
            new TwingFilter('first', twingFirst, {needs_environment: true}),
            new TwingFilter('last', twingLast, {needs_environment: true}),

            // iteration and runtime
            new TwingFilter('default', twingDefaultFilter, {
                expression_factory: function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag: string = null) {
                    return new TwingNodeExpressionFilterDefault(node, filterName, methodArguments, lineno, tag);
                }
            }),
            new TwingFilter('keys', twingGetArrayKeysFilter),

            // escaping
            new TwingFilter('escape', twingEscapeFilter, {
                needs_environment: true,
                is_safe_callback: twingEscapeFilterIsSafe
            }),
            new TwingFilter('e', twingEscapeFilter, {
                needs_environment: true,
                is_safe_callback: twingEscapeFilterIsSafe
            })
        ];
    }

    getFunctions(): Array<TwingFunction> {
        return [
            new TwingFunction('max', twingMax),
            new TwingFunction('min', twingMin),
            new TwingFunction('range', twingRange),
            new TwingFunction('constant', twingConstant, {needs_environment: true}),
            new TwingFunction('cycle', twingCycle),
            new TwingFunction('random', twingRandom, {needs_environment: true}),
            new TwingFunction('date', twingDateConverter, {needs_environment: true}),
            new TwingFunction('include', twingInclude, {
                needs_context: true,
                needs_environment: true,
                is_safe: ['all']
            }),
            new TwingFunction('source', twingSource, {needs_environment: true, is_safe: ['all']}),
        ];
    }

    getTests(): Array<TwingTest> {
        return [
            new TwingTest('even', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                    return new TwingNodeExpressionTestEven(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('odd', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                    return new TwingNodeExpressionTestOdd(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('defined', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                    return new TwingNodeExpressionTestDefined(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('same as', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                    return new TwingNodeExpressionTestSameAs(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('none', null, {
                'node_factory': function (node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode = null, lineno: number) {
                    return new TwingNodeExpressionTestNull(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('null', null, {
                'node_factory': function (node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode = null, lineno: number) {
                    return new TwingNodeExpressionTestNull(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('divisible by', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                    return new TwingNodeExpressionTestDivisibleBy(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('constant', null, {
                node_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number) {
                    return new TwingNodeExpressionTestConstant(node, name, nodeArguments, lineno);
                }
            }),
            new TwingTest('empty', twingTestEmpty),
            new TwingTest('iterable', twingTestIterable)
        ];
    }

    getOperators(): { unary: Map<string, TwingOperatorDefinitionInterface>, binary: Map<string, TwingOperatorDefinitionInterface> } {
        return {
            unary: new Map([
                ['not', {
                    precedence: 50,
                    factory: function (expr: TwingNode, lineno: number) {
                        return new TwingNodeExpressionUnaryNot(expr, lineno) as any;
                    }
                }],
                ['-', {
                    precedence: 500,
                    factory: function (expr: TwingNode, lineno: number) {
                        return new TwingNodeExpressionUnaryNeg(expr, lineno) as any;
                    }
                }],
                ['+', {
                    precedence: 500,
                    factory: function (expr: TwingNode, lineno: number) {
                        return new TwingNodeExpressionUnaryPos(expr, lineno) as any;
                    }
                }]
            ]),
            binary: new Map([
                ['or', {
                    precedence: 10,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryOr(left, right, lineno) as any;
                    }
                }],
                ['and', {
                    precedence: 15,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryAnd(left, right, lineno) as any;
                    }
                }],
                ['b-or', {
                    precedence: 16,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryBitwiseOr(left, right, lineno) as any;
                    }
                }],
                ['b-xor', {
                    precedence: 17,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryBitwiseXor(left, right, lineno) as any;
                    }
                }],
                ['b-and', {
                    precedence: 18,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryBitwiseAnd(left, right, lineno) as any;
                    }
                }],
                ['==', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryEqual(left, right, lineno) as any;
                    }
                }],
                ['!=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryNotEqual(left, right, lineno) as any;
                    }
                }],
                ['<', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryLess(left, right, lineno) as any;
                    }
                }],
                ['>', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryGreater(left, right, lineno) as any;
                    }
                }],
                ['>=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryGreaterEqual(left, right, lineno) as any;
                    }
                }],
                ['<=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryLessEqual(left, right, lineno) as any;
                    }
                }],
                ['not in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryNotIn(left, right, lineno) as any;
                    }
                }],
                ['in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryIn(left, right, lineno) as any;
                    }
                }],
                ['matches', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryMatches(left, right, lineno) as any;
                    }
                }],
                ['starts with', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryStartsWith(left, right, lineno) as any;
                    }
                }],
                ['ends with', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryEndsWith(left, right, lineno) as any;
                    }
                }],
                ['..', {
                    precedence: 25,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryRange(left, right, lineno) as any;
                    }
                }],
                ['+', {
                    precedence: 30,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryAdd(left, right, lineno) as any;
                    }
                }],
                ['-', {
                    precedence: 30,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinarySub(left, right, lineno) as any;
                    }
                }],
                ['~', {
                    precedence: 40,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryConcat(left, right, lineno) as any;
                    }
                }],
                ['*', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryMul(left, right, lineno) as any;
                    }
                }],
                ['/', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryDiv(left, right, lineno) as any;
                    }
                }],
                ['//', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryFloorDiv(left, right, lineno) as any;
                    }
                }],
                ['%', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryMod(left, right, lineno) as any;
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
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryPower(left, right, lineno) as any;
                    }
                }],
                ['??', {
                    precedence: 300,
                    associativity: TwingExpressionParser.OPERATOR_RIGHT,
                    factory: function (left: TwingNodeExpression, right: TwingNodeExpression, lineno: number) {
                        return new TwingNodeExpressionNullCoalesce(left, right, lineno) as any;
                    }
                }]
            ])
        };
    }
}

/**
 * Cycles over a value.
 *
 * @param {Array} values
 * @param {number} position The cycle position
 *
 * @returns {string} The next value in the cycle
 */
export function twingCycle(values: Array<any>, position: number) {
    if (!Array.isArray(values)) {
        return values;
    }

    return values[position % values.length];
}

/**
 * Returns a random value depending on the supplied parameter type:
 * - a random item from a Traversable or array
 * - a random character from a string
 * - a random integer between 0 and the integer parameter.
 *
 * @param {TwingEnvironment} env
 * @param {*} values The values to pick a random item from
 *
 * @throws TwingErrorRuntime when values is an empty array (does not apply to an empty string which is returned as is)
 *
 * @returns {*} A random value from the given sequence
 */
export function twingRandom(env: TwingEnvironment, values: any = null): any {
    if (values === null) {
        return mt_rand();
    }

    if (typeof values === 'number') {
        return values < 0 ? mt_rand(values, 0) : mt_rand(0, values);
    }

    if (isTraversable(values)) {
        values = iteratorToArray(values);
    }
    else if (typeof values === 'string') {
        if (values === '') {
            return '';
        }

        let charset = env.getCharset();

        if (charset !== 'UTF-8') {
            values = iconv(charset, 'UTF-8', values);
        }

        values = values.split('');

        if ('UTF-8' !== charset) {
            values = values.map(function (value: string) {
                return iconv('UTF-8', charset, value);
            });
        }
    }

    if (!Array.isArray(values)) {
        return values;
    }

    if (values.length < 1) {
        throw new TwingErrorRuntime('The random function cannot pick from an empty array.');
    }

    return values[array_rand(values, 1)];
}

/**
 * Converts a date to the given format.
 *
 * <pre>
 *   {{ post.published_at|date("m/d/Y") }}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {DateTime|Interval|string} date A date
 * @param {string|null} format The target format, null to use the default
 * @param {string|null|false} timezone The target timezone, null to use the default, false to leave unchanged
 *
 * @return string The formatted date
 */
export function twingDateFormatFilter(env: TwingEnvironment, date: DateTime | Interval | string, format: string = null, timezone: string | null | false = null) {
    if (format === null) {
        let coreExtension = env.getCoreExtension();

        let formats = coreExtension.getDateFormat();

        format = date instanceof Interval ? formats[1] : formats[0];
    }

    date = twingDateConverter(env, date, timezone);

    if (date instanceof Interval) {
        return formatDateInterval(date, format);
    }

    return formatDateTime(date, format);
}

/**
 * Returns a new date object modified.
 *
 * <pre>
 *   {{ post.published_at|date_modify("-1day")|date("m/d/Y") }}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {DateTime|DateTimeInterval|string} date A date
 * @param {string} modifier A modifier string
 *
 * @returns {DateTime} A new date object
 */
export function twingDateModifyFilter(env: TwingEnvironment, date: Date | DateTime | Interval | string, modifier: string = null) {
    let dateTime: DateTime = twingDateConverter(env, date) as DateTime;

    let regExp = new RegExp(/(\+|-)([0-9])(.*)/);
    let parts = regExp.exec(modifier);

    let operator: string = parts[1];
    let operand: number = Number.parseInt(parts[2]);
    let unit: string = parts[3].trim();

    let duration: any = {};

    duration[unit] = operator === '-' ? -operand : operand;

    dateTime = dateTime.plus(duration);

    return dateTime;
}

/**
 * Converts an input to a DateTime instance.
 *
 * <pre>
 *    {% if date(user.created_at) < date('+2days') %}
 *      {# do something #}
 *    {% endif %}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {Date | DateTime | Interval | number | string} date A date or null to use the current time
 * @param {string | null | false} timezone The target timezone, null to use the default, false to leave unchanged
 *
 * @returns {DateTime} A DateTime instance
 */
export function twingDateConverter(env: TwingEnvironment, date: Date | DateTime | Interval | number | string, timezone: string | null | false = null): DateTime | Interval {
    let result: DateTime;
    let coreExtension = env.getCoreExtension();

    // determine the timezone
    if (timezone !== false) {
        if (timezone === null) {
            timezone = coreExtension.getTimezone();
        }
    }

    if (date instanceof DateTime) {
        if (timezone !== false) {
            date = date.setZone(timezone);
        }

        return date;
    }

    if (date instanceof Interval) {
        return date;
    }

    let parsedUtcOffset = 0;

    if (!date) {
        result = DateTime.local();
    }
    else if (date instanceof Date) {
        result = DateTime.fromJSDate(date);
    }
    else if (typeof date === 'string') {
        if (date === 'now') {
            result = DateTime.local();
        }
        else {
            result = DateTime.fromISO(date);

            if (!result.isValid) {
                result = DateTime.fromRFC2822(date);
            }

            if (!result.isValid) {
                result = DateTime.fromSQL(date);
            }

            if (result.isValid) {
                parsedUtcOffset = moment.parseZone(date as string).utcOffset();
            }
            else {
                result = relativeDate(date);
            }
        }
    }
    else if (typeof date === 'number') {
        // date is PHP timestamp - i.e. in seconds
        let ts = date as number * 1000;

        // timestamp are UTC by definition
        result = DateTime.fromMillis(ts, {
            setZone: false
        });
    }

    if (!result.isValid) {
        throw new TwingErrorRuntime(`Failed to parse date "${date}".`);
    }

    if (timezone !== false) {
        result = result.setZone(timezone);
    }
    else {
        if (parsedUtcOffset) {
            // explicit UTC offset
            result = result.setZone(`UTC+${parsedUtcOffset / 60}`);
        }
    }

    Reflect.set(result, 'format', function (format: string) {
        return formatDateTime(this, format);
    });

    return result;
}

/**
 * Replaces strings within a string.
 *
 * @param {string} str  String to replace in
 * @param {Array<string>|Map<string, string>} from Replace values
 *
 * @returns {string}
 */
export function twingReplaceFilter(str: string, from: any) {
    const strtr = require('locutus/php/strings/strtr');

    if (isTraversable(from)) {
        from = iteratorToHash(from);
    }
    else if (typeof from !== 'object') {
        throw new TwingErrorRuntime(`The "replace" filter expects an hash or "Iterable" as replace values, got "${typeof from === 'object' ? from.constructor.name : typeof from}".`);
    }

    return strtr(str, from);
}

/**
 * Rounds a number.
 *
 * @param value The value to round
 * @param {number} precision The rounding precision
 * @param {string} method The method to use for rounding
 *
 * @returns int|float The rounded number
 */
export function twingRound(value: any, precision = 0, method = 'common') {
    const round = require('locutus/php/math/round');
    const ceil = require('locutus/php/math/ceil');
    const floor = require('locutus/php/math/floor');

    if (method === 'common') {
        return round(value, precision);
    }

    if (method !== 'ceil' && method !== 'floor') {
        throw new TwingErrorRuntime('The round filter only supports the "common", "ceil", and "floor" methods.');
    }

    let intermediateValue = value * Math.pow(10, precision);
    let intermediateDivider = Math.pow(10, precision);

    switch (method) {
        case 'ceil':
            return ceil(intermediateValue) / intermediateDivider;
        default:
            return floor(intermediateValue) / intermediateDivider;
    }
}

/**
 * Number format filter.
 *
 * All of the formatting options can be left null, in that case the defaults will
 * be used.  Supplying any of the parameters will override the defaults set in the
 * environment object.
 *
 * @param {TwingEnvironment} env
 * @param {*} number A float/int/string of the number to format
 * @param {number} decimal the number of decimal points to display
 * @param {string} decimalPoint the character(s) to use for the decimal point
 * @param {string} thousandSep the character(s) to use for the thousands separator
 *
 * @returns string The formatted number
 */
export function twingNumberFormatFilter(env: TwingEnvironment, number: any, decimal: number, decimalPoint: string, thousandSep: string) {
    const number_format = require('locutus/php/strings/number_format');

    let defaults = env.getCoreExtension().getNumberFormat();

    if (isNullOrUndefined(decimal)) {
        decimal = defaults[0] as number;
    }

    if (isNullOrUndefined(decimalPoint)) {
        decimalPoint = defaults[1] as string;
    }

    if (isNullOrUndefined(thousandSep)) {
        thousandSep = defaults[2] as string;
    }

    return number_format(number, decimal, decimalPoint, thousandSep);
}

/**
 * URL encodes (RFC 3986) a string as a path segment or a hash as a query string.
 *
 * @param {string|{}} url A URL or a hash of query parameters
 *
 * @returns {string} The URL encoded value
 */
export function twingUrlencodeFilter(url: string | {}): string {
    const http_build_query = require('locutus/php/url/http_build_query');

    if (typeof url !== 'string') {
        if (isTraversable(url)) {
            url = iteratorToHash(url);
        }

        let builtUrl: string = http_build_query(url, '', '&');

        return builtUrl.replace(/\+/g, '%20');
    }

    return encodeURIComponent(url);
}

/**
 * Merges an array with another one.
 *
 * <pre>
 *  {% set items = { 'apple': 'fruit', 'orange': 'fruit' } %}
 *
 *  {% set items = items|merge({ 'peugeot': 'car' }) %}
 *
 *  {# items now contains { 'apple': 'fruit', 'orange': 'fruit', 'peugeot': 'car' } #}
 * </pre>
 *
 * @param {*} arr1 An array
 * @param {*} arr2 An array
 *
 * @return array The merged array
 */
export function twingArrayMerge(arr1: any, arr2: any) {
    if (isTraversable(arr1)) {
        arr1 = iteratorToMap(arr1);
    }
    else {
        throw new TwingErrorRuntime(`The merge filter only works with arrays or "Traversable", got "${!isNullOrUndefined(arr1) ? typeof arr1 : arr1}" as first argument.`);
    }

    if (isTraversable(arr2)) {
        arr2 = iteratorToMap(arr2);
    }
    else {
        throw new TwingErrorRuntime(`The merge filter only works with arrays or "Traversable", got "${!isNullOrUndefined(arr2) ? typeof arr2 : arr2}" as second argument.`);
    }

    return arr1.merge(arr2);
}

/**
 * Slices a variable.
 *
 * @param {TwingEnvironment} env
 * @param item A variable
 * @param {number} start Start of the slice
 * @param {number} length Size of the slice
 * @param {boolean} preserveKeys Whether to preserve key or not (when the input is an object)
 *
 * @returns The sliced variable
 */
export function twingSlice(env: TwingEnvironment, item: any, start: number, length: number = null, preserveKeys: boolean = false): string | TwingMap<any, any> {

    if (typeof item === 'string') {
        if (length === null) {
            length = item.length - start;
        }

        return item.substr(start, length);
    }
    else {
        let iterableItem = iteratorToMap(item);

        if (length === null) {
            length = iterableItem.size - start;
        }

        return iterableItem.slice(start, length, Array.isArray(item) ? preserveKeys : true);
    }
}

/**
 * Returns the first element of the item.
 *
 * @param {TwingEnvironment} env
 * @param {*} item A variable
 *
 * @returns {*} The first element of the item
 */
export function twingFirst(env: TwingEnvironment, item: any) {
    let elements = twingSlice(env, item, 0, 1, false);

    return typeof elements === 'string' ? elements : elements.first();
}

/**
 * Returns the last element of the item.
 *
 * @param {TwingEnvironment} env
 * @param item A variable
 *
 * @returns The last element of the item
 */
export function twingLast(env: TwingEnvironment, item: any) {
    let elements = twingSlice(env, item, -1, 1, false);

    return typeof elements === 'string' ? elements : elements.first();
}

/**
 * Joins the values to a string.
 *
 * The separator between elements is an empty string per default, you can define it with the optional parameter.
 *
 * <pre>
 *  {{ [1, 2, 3]|join('|') }}
 *  {# returns 1|2|3 #}
 *
 *  {{ [1, 2, 3]|join }}
 *  {# returns 123 #}
 * </pre>
 *
 * @param {Array<*>} value An array
 * @param {string} glue The separator
 *
 * @returns {string} The concatenated string
 */
export function twingJoinFilter(value: Array<any>, glue: string = '') {
    if (isTraversable(value)) {
        value = iteratorToArray(value, false);
    }

    // this is ugly but we have to ensure that each element of the array is rendered as PHP would render it
    // this is mainly useful for booleans that are not rendered the same way in PHP and JavaScript
    let safeValue = value.map(function (item) {
        if (typeof item === 'boolean') {
            return (item === true) ? '1' : ''
        }

        return item;
    });

    return safeValue.join(glue);
}

/**
 * Splits the string into an array.
 *
 * <pre>
 *  {{ "one,two,three"|split(',') }}
 *  {# returns [one, two, three] #}
 *
 *  {{ "one,two,three,four,five"|split(',', 3) }}
 *  {# returns [one, two, "three,four,five"] #}
 *
 *  {{ "123"|split('') }}
 *  {# returns [1, 2, 3] #}
 *
 *  {{ "aabbcc"|split('', 2) }}
 *  {# returns [aa, bb, cc] #}
 * </pre>
 *
 * @param {TwingEnvironment} env
 * @param {string} value A string
 * @param {string} delimiter The delimiter
 * @param {number} limit The limit
 *
 * @returns {Array<string>} The split string as an array
 */
export function twingSplitFilter(env: TwingEnvironment, value: string, delimiter: string, limit: number) {
    const explode = require('locutus/php/strings/explode');

    if (delimiter) {
        return !limit ? explode(delimiter, value) : explode(delimiter, value, limit);
    }

    if (!limit || limit <= 1) {
        return value.match(/.{1,1}/ug)
    }

    let length = value.length;

    if (length < limit) {
        return [value];
    }

    let r = [];

    for (let i = 0; i < length; i += limit) {
        r.push(value.substr(i, limit));
    }

    return r;
}

// The '_default' filter is used internally to avoid using the ternary operator
// which costs a lot for big contexts (before PHP 5.4). So, on average,
// a function call is cheaper.
/**
 * @internal
 */
export function twingDefaultFilter(value: any, defaultValue: any = '') {
    if (twingTestEmpty(value)) {
        return defaultValue;
    }

    return value;
}

/**
 * Returns the keys for the given array.
 *
 * It is useful when you want to iterate over the keys of an array:
 *
 * <pre>
 *  {% for key in array|keys %}
 *      {# ... #}
 *  {% endfor %}
 * </pre>
 *
 * @param {Array<*>} array An array
 *
 * @returns {Array<*>} The keys
 */
function twingGetArrayKeysFilter(array: Array<any>) {
    let traversable = iteratorToMap(array);

    return [...traversable.keys()];
}

/**
 * Reverses a variable.
 *
 * @param {TwingEnvironment} env
 * @param item An array, a Traversable instance, or a string
 * @param {boolean} preserveKeys Whether to preserve key or not
 *
 * @returns The reversed input
 */
export function twingReverseFilter(env: TwingEnvironment, item: any, preserveKeys: boolean = false): string | TwingMap<any, any> {
    if (typeof item === 'string') {
        let string = '' + item;

        let charset = env.getCharset();

        if (charset !== 'UTF-8') {
            item = iconv('UTF-8', charset, string);
        }

        let regExp = /./ug;
        let match: RegExpExecArray;

        string = '';

        while ((match = regExp.exec(item)) !== null) {
            string = match[0] + string;
        }

        if (charset !== 'UTF-8') {
            string = iconv(charset, 'UTF-8', string).toString();
        }

        return string;
    }
    else {
        return iteratorToMap(item).reverse(preserveKeys);
    }
}

/**
 * Sorts an array.
 *
 * @param {Array<*>} array
 *
 * @returns {TwingMap<*,*>}
 */
export function twingSortFilter(array: Array<any>) {
    if (!isTraversable(array) && !Array.isArray(array)) {
        throw new TwingErrorRuntime(`The sort filter only works with iterables, got "${typeof array}".`);
    }

    return iteratorToMap(array).sort();
}

/**
 * @internal
 */
export function twingInFilter(value: any, compare: any): boolean {
    let result = false;

    if (Array.isArray(compare)) {
        for (let item of compare) {
            if (twingCompare(item, value)) {
                result = true;
                break;
            }
        }
    }
    else if (typeof compare === 'string' && (typeof value === 'string' || typeof value === 'number')) {
        result = (value === '' || compare.includes('' + value));
    }
    else if (isTraversable(compare)) {
        for (let item of iteratorToArray(compare)) {
            if (twingCompare(item, value)) {
                result = true;
                break;
            }
        }
    }
    else if (typeof compare === 'object') {
        for (let key in compare) {
            if (twingCompare(compare[key], value)) {
                result = true;
                break;
            }
        }
    }

    return result;
}

/**
 * Returns a trimmed string.
 *
 * @returns {string}
 *
 * @throws TwingErrorRuntime When an invalid trimming side is used (not a string or not 'left', 'right', or 'both')
 */
export function twingTrimFilter(string: string, characterMask: string = null, side: string = 'both') {
    const trim = require('locutus/php/strings/trim');
    const ltrim = require('locutus/php/strings/ltrim');
    const rtrim = require('locutus/php/strings/rtrim');

    if (characterMask === null) {
        characterMask = " \t\n\r\0\x0B";
    }

    switch (side) {
        case 'both':
            return trim(string, characterMask);
        case 'left':
            return ltrim(string, characterMask);
        case 'right':
            return rtrim(string, characterMask);
        default:
            throw new TwingErrorRuntime('Trimming side must be "left", "right" or "both".');
    }
}

/**
 * Escapes a string.
 *
 * @param {TwingEnvironment} env
 * @param {*} string The value to be escaped
 * @param {string} strategy The escaping strategy
 * @param {string} charset The charset
 * @param {boolean} autoescape Whether the function is called by the auto-escaping feature (true) or by the developer (false)
 *
 * @returns {string}
 */
export function twingEscapeFilter(env: TwingEnvironment, string: any, strategy: string = 'html', charset: string = null, autoescape: boolean = false) {
    return escape(env, string, strategy, charset, autoescape)
}

/**
 * @internal
 */
export function twingEscapeFilterIsSafe(filterArgs: TwingNode) {
    if (filterArgs.getNodes().size > 0) {
        let result: Array<string> = [];

        filterArgs.getNodes().forEach(function (arg) {
            if (arg instanceof TwingNodeExpressionConstant) {
                result = [arg.getAttribute('value')];
            }
        });

        return result;
    }
    else {
        return ['html'];
    }
}

export function twingConvertEncoding(string: string, to: string, from: string) {
    return iconv(from, to, string);
}

/**
 * Returns the length of a variable.
 *
 * @param {TwingEnvironment} env A TwingEnvironment instance
 * @param thing A variable
 *
 * @returns {number} The length of the value
 */
export function twingLengthFilter(env: TwingEnvironment, thing: any) {
    if (isNullOrUndefined(thing)) {
        return 0;
    }

    if (thing.length) {
        return thing.length;
    }

    if (thing.size) {
        return thing.size;
    }

    if (thing.toString && (typeof thing.toString === 'function')) {
        return thing.toString().length;
    }

    return 1;
}

/**
 * Converts a string to uppercase.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The uppercased string
 */
export function twingUpperFilter(env: TwingEnvironment, string: string) {
    // todo: use charset
    return (typeof string === 'string') ? string.toUpperCase() : string;
}

/**
 * Converts a string to lowercase.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The lowercased string
 */
export function twingLowerFilter(env: TwingEnvironment, string: string) {
    // todo: use charset
    return (typeof string === 'string') ? string.toLowerCase() : string;
}

/**
 * Returns a titlecased string.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The titlecased string
 */
export function twingTitleStringFilter(env: TwingEnvironment, string: string) {
    const ucwords = require('locutus/php/strings/ucwords');

    return ucwords(string.toLowerCase());
}

/**
 * Returns a capitalized string.
 *
 * @param {TwingEnvironment} env
 * @param {string} string A string
 *
 * @returns {string} The capitalized string
 */
export function twingCapitalizeStringFilter(env: TwingEnvironment, string: string) {
    const capitalize = require('capitalize');

    return capitalize(string);
}

/**
 * @internal
 */
export function twingEnsureTraversable(seq: any): TwingMap<any, any> {
    if (isTraversable(seq)) {
        return iteratorToMap(seq);
    }

    return new TwingMap();
}

/**
 * Checks if a variable is empty.
 *
 * <pre>
 * {# evaluates to true if the foo variable is null, false, or the empty string #}
 * {% if foo is empty %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 *
 * @param value A variable
 *
 * @returns {boolean} true if the value is empty, false otherwise
 */
export function twingTestEmpty(value: any): boolean {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value[Symbol.iterator] === 'function') {
        return value[Symbol.iterator]().next().done === true;
    }

    if (typeof value === 'object' && value.toString && typeof value.toString === 'function') {
        return value.toString().length < 1;
    }

    return value === false;
}

/**
 * Checks if a variable is traversable.
 *
 * <pre>
 * {# evaluates to true if the foo variable is an array or a traversable object #}
 * {% if foo is iterable %}
 *     {# ... #}
 * {% endif %}
 * </pre>
 *
 * @param value A variable
 *
 * @return {boolean} true if the value is traversable
 */
export function twingTestIterable(value: any) {
    // in PHP a string is not traversable
    if (typeof value === 'string') {
        return false;
    }

    if (typeof value[Symbol.iterator] === 'function') {
        return true;
    }

    // in PHP objects are not iterable so we have to ensure that the test reflects that
    return false;
}

/**
 * Renders a template.
 *
 * @param {TwingEnvironment} env
 * @param {TwingMap<*,*>} context
 * @param {string|Array<string>} template The template to render or an array of templates to try consecutively
 * @param variables The variables to pass to the template
 * @param {boolean} withContext
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 * @param {boolean} sandboxed Whether to sandbox the template or not
 *
 * @returns {string} The rendered template
 */
function twingInclude(env: TwingEnvironment, context: TwingMap<any, any>, template: string | Array<string>, variables: any = {}, withContext: boolean = true, ignoreMissing: boolean = false, sandboxed: boolean = false) {
    let alreadySandboxed = false;
    let sandbox: TwingExtensionSandbox = null;

    variables = iteratorToMap(variables);

    if (withContext) {
        variables = context.merge(variables);
    }

    let isSandboxed = sandboxed && env.hasExtension('TwingExtensionSandbox');

    if (isSandboxed) {
        sandbox = env.getExtension('TwingExtensionSandbox') as TwingExtensionSandbox;

        if (!(alreadySandboxed = sandbox.isSandboxed())) {
            sandbox.enableSandbox();
        }
    }

    let result = null;

    try {
        result = env.resolveTemplate(template).render(variables);
    }
    catch (e) {
        if (e instanceof TwingErrorLoader) {
            if (!ignoreMissing) {
                if (isSandboxed && !alreadySandboxed) {
                    sandbox.disableSandbox();
                }

                throw e;
            }
        }
        else {
            if (isSandboxed && !alreadySandboxed) {
                sandbox.disableSandbox();
            }

            throw e;
        }
    }

    if (isSandboxed && !alreadySandboxed) {
        sandbox.disableSandbox();
    }

    return result;
}

/**
 * Returns a template content without rendering it.
 *
 * @param {TwingEnvironment} env
 * @param {string} name The template name
 * @param {boolean} ignoreMissing Whether to ignore missing templates or not
 *
 * @return string The template source
 */
export function twingSource(env: TwingEnvironment, name: string, ignoreMissing: boolean = false) {
    let loader = env.getLoader();

    try {
        return loader.getSourceContext(name).getCode();
    }
    catch (e) {
        if (e instanceof TwingErrorLoader && !ignoreMissing) {
            throw e;
        }

        throw e;
    }
}

/**
 * Provides the ability to get constants from instances as well as class/global constants.
 *
 * Global or class constants make no sense in JavaScript. To emulate the expected behavior, it is assumed that
 * so-called constants are keys of the TwingEnvironment::globals property.
 *
 * @param {TwingEnvironment} env The environment
 * @param {string} constant The name of the constant
 * @param object The object to get the constant from
 *
 * @returns {string}
 */
export function twingConstant(env: TwingEnvironment, constant: string, object: any) {
    let globals: any = env.getGlobals();
    let bucket: any;

    if (object && typeof object === 'object') {
        let className = object.constructor.name;

        bucket = globals[className];
    }
    else {
        bucket = globals;
    }

    if (bucket) {
        return bucket[constant];
    }

    return null;
}

/**
 * Checks if a constant exists.
 *
 * @param {string} constant The name of the constant
 * @param {null | *} object   The object to get the constant from
 *
 * @returns {boolean}
 */
function twingConstantIsDefined(constant: string, object: any = null) {
    if (null !== object) {
        constant = object.constructor.name + '::' + constant;
    }

    return defined(constant);
}

/**
 * Batches item.
 *
 * @param {Array} items An array of items
 * @param {number} size  The size of the batch
 * @param fill A value used to fill missing items
 *
 * @returns Array<any>
 */
export function twingArrayBatch(items: Array<any>, size: number, fill: any = null): Array<TwingMap<any, any>> {
    let map = iteratorToMap(items);
    let chunks: Array<TwingMap<any, any>> = map.chunk(size, true);

    if (fill !== null && chunks.length) {
        let last = chunks.length - 1;
        let fillCount = size - chunks[last].size;

        if (fillCount) {
            chunks[last].fill(0, fillCount, fill);
        }
    }

    return chunks;
}

/**
 * Returns the attribute value for a given array/object.
 *
 * @param {TwingEnvironment} env
 * @param {*} object The object or array from where to get the item
 * @param {*} item The item to get from the array or object
 * @param array  arguments         An array of arguments to pass if the item is an object method
 * @param string type              The type of attribute (@see Twig_Template constants)
 * @param bool   isDefinedTest     Whether this is only a defined check
 * @param bool   ignoreStrictCheck Whether to ignore the strict attribute check or not
 *
 * @returns mixed The attribute value, or a Boolean when $isDefinedTest is true, or null when the attribute is not set and $ignoreStrictCheck is true
 *
 * @throws TwingErrorRuntime if the attribute does not exist and Twig is running in strict mode and $isDefinedTest is false
 *
 * @internal
 */
export function twingGetAttribute(env: TwingEnvironment, source: TwingSource, object: any, item: any, _arguments: Array<any> = [], type: string = TwingTemplate.ANY_CALL, isDefinedTest: boolean = false, ignoreStrictCheck: boolean = false) {
    const capitalize = require('capitalize');

    let message: string;

    let isFloat = function (data: any) {
        return !isNaN(data) && !Number.isInteger(data);
    };

    // ANY_CALL or ARRAY_CALL
    if (type !== TwingTemplate.METHOD_CALL) {
        let arrayItem;

        if (typeof item === 'boolean') {
            arrayItem = item ? 1 : 0;
        }
        else if (isFloat(item)) {
            arrayItem = parseInt(item);
        }
        else {
            arrayItem = item;
        }

        if (object) {
            if (Array.isArray(object) && object[arrayItem]) {
                if (isDefinedTest) {
                    return true;
                }

                return object[arrayItem];
            }
            else if (object instanceof Map && object.has(item)) {
                if (isDefinedTest) {
                    return true;
                }

                return object.get(item);
            }
            else if (typeof object === 'object' && Reflect.has(object, item) && (typeof Reflect.get(object, item) !== 'function')) {
                if (isDefinedTest) {
                    return true;
                }

                return Reflect.get(object, item);
            }
        }

        if ((type === TwingTemplate.ARRAY_CALL) || (Array.isArray(object)) || (object instanceof Map) || (object === null) || (typeof object !== 'object')) {
            if (isDefinedTest) {
                return false;
            }

            if (ignoreStrictCheck || !env.isStrictVariables()) {
                return;
            }

            if (Array.isArray(object)) {
                // object is an array
                if (object.length < 1) {
                    message = `Index "${arrayItem}" is out of bounds as the array is empty.`;
                }
                else {
                    message = `Index "${arrayItem}" is out of bounds for array [${object}].`;

                }
            }
            else if (object instanceof Map) {
                // object is a map
                if (object === null) {
                    message = `Impossible to access a key ("${item}") on a null variable.`;
                }
                else {
                    message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                }
            }
            else if (type === TwingTemplate.ARRAY_CALL) {
                // object is another kind of object
                if (object === null) {
                    message = `Impossible to access a key ("${item}") on a null variable.`;
                }
                else {
                    message = `Impossible to access a key ("${item}") on a ${typeof object} variable ("${object.toString()}").`;
                }
            }
            else if (object === null) {
                // object is null
                message = `Impossible to access an attribute ("${item}") on a null variable.`;
            }
            else {
                // object is a primitive
                message = `Impossible to access an attribute ("${item}") on a ${typeof object} variable ("${object}").`;
            }

            throw new TwingErrorRuntime(message, -1, source);
        }
    }

    // ANY_CALL or METHOD_CALL
    if ((object === null) || (typeof object !== 'object')) {
        // object is a primitive
        if (isDefinedTest) {
            return false;
        }

        if (ignoreStrictCheck || !env.isStrictVariables()) {
            return;
        }

        if (object === null) {
            message = `Impossible to invoke a method ("${item}") on a null variable.`;
        }
        else {
            message = `Impossible to invoke a method ("${item}") on a ${typeof object} variable ("${object}").`;
        }

        throw new TwingErrorRuntime(message, -1, source);
    }

    // object method
    // precedence: getXxx() > isXxx() > hasXxx()
    let functionName;
    let getFallback = `get${capitalize(item)}`;
    let isFallback = `is${capitalize(item)}`;
    let hasFallback = `has${capitalize(item)}`;

    if (Reflect.has(object, item)) {
        functionName = item;
    }
    else if (Reflect.has(object, getFallback)) {
        functionName = getFallback;
    }
    else if (Reflect.has(object, isFallback)) {
        functionName = isFallback;
    }
    else if (Reflect.has(object, hasFallback)) {
        functionName = hasFallback;
    }
    else if (Reflect.has(object, '__call')) {
        functionName = '__call';

        _arguments.unshift(item);
    }
    else {
        if (isDefinedTest) {
            return false;
        }

        if (ignoreStrictCheck || !env.isStrictVariables()) {
            return;
        }

        throw new TwingErrorRuntime(`Neither the property "${item}" nor one of the methods ${item}()", "${getFallback}()", "${isFallback}()" or "${hasFallback}()" or "__call()" exist in class "${object.constructor.name}".`, -1, source);
    }

    if (isDefinedTest) {
        return true;
    }

    return Reflect.get(object, functionName).apply(object, _arguments);
}

export default TwingExtensionCore;