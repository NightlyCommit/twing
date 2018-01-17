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
import TwingNodeExpressionBinaryIs from "../node/expression/binary/is";
import TwingNodeExpressionBinaryIsNot from "../node/expression/binary/is-not";
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

import {DateTime, Settings as DateTimeSettings, Zone as DateTimeZone} from 'luxon';
import TwingNodeExpressionConstant from "../node/expression/constant";
import TwingNodeExpressionFilterDefault from "../node/expression/filter/default";
import TwingNodeExpressionTestNull from "../node/expression/test/null";
import TwingNodeExpressionTestEven from "../node/expression/test/even";

const range = require('locutus/php/array/range');
const sprintf = require('locutus/php/strings/sprintf');
const nl2br = require('locutus/php/strings/nl2br');
const strip_tags = require('locutus/php/strings/strip_tags');

import twingIsEmpty from '../util/is-empty';
import twingEscape from '../util/escape';
import twingEscapeFilterIsSafe from '../util/escape-filter-is-safe';
import twingLength from '../util/length';
import twingMerge from '../util/merge';
import twingFormatDate from '../util/format-date';
import twingSlice from '../util/slice';
import twingFormatNumber from '../util/format-number';
import twingReplace from '../util/replace';
import twingReverse from '../util/reverse';
import twingSort from '../util/sort';
import twingUrlEncode from '../util/url-encode';
import twingConstant from '../util/constant';
import twingInclude from '../util/include';
import twingCycle from '../util/cycle';
import twingEnsureDate from '../util/ensure-date-time';
import twingMin from '../util/min';
import twingMax from '../util/max';
import twingIsIterable from '../util/is-iterable';
import twingSource from '../util/source';
import twingBatch from '../util/batch';
import twingCapitalize from '../util/capitalize';
import twingConvertEncoding from '../util/convert-encoding';
import twingDateModify from '../util/date_modify';
import twingDefault from '../util/default';
import twingFirst from '../util/first';
import twingJoin from '../util/join';
import twingKeys from '../util/keys';
import twingLast from '../util/last';
import twingLower from '../util/lower';
import twingRound from '../util/round';
import twingSplit from '../util/split';
import twingTitle from '../util/title';
import twingTrim from '../util/trim';
import twingUpper from '../util/upper';
import twingRandom from '../util/random';

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
     * @param string $format             The default date format string
     * @param string $dateIntervalFormat The default date interval format string
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
            new TwingFilter('date', twingFormatDate, {needs_environment: true}),
            new TwingFilter('date_modify', twingDateModify, {needs_environment: true}),
            new TwingFilter('format', sprintf),
            new TwingFilter('replace', twingReplace),
            new TwingFilter('number_format', twingFormatNumber, {
                needs_environment: true
            }),
            new TwingFilter('abs', Math.abs),
            new TwingFilter('round', twingRound),

            // encoding
            new TwingFilter('url_encode', twingUrlEncode),
            new TwingFilter('json_encode', JSON.stringify),
            new TwingFilter('convert_encoding', twingConvertEncoding, {
                pre_escape: 'html',
                is_safe: ['html']
            }),

            // string filters
            new TwingFilter('title', twingTitle, {needs_environment: true}),
            new TwingFilter('capitalize', twingCapitalize, {needs_environment: true}),
            new TwingFilter('upper', twingUpper, {needs_environment: true}),
            new TwingFilter('lower', twingLower),
            new TwingFilter('striptags', strip_tags),
            new TwingFilter('trim', twingTrim),
            new TwingFilter('nl2br', nl2br, {
                pre_escape: 'html',
                is_safe: ['html']
            }),

            // array helpers
            new TwingFilter('join', twingJoin),
            new TwingFilter('split', twingSplit, {needs_environment: true}),
            new TwingFilter('sort', twingSort),
            new TwingFilter('merge', twingMerge),
            new TwingFilter('batch', twingBatch),

            // string/array filters
            new TwingFilter('reverse', twingReverse, {needs_environment: true}),
            new TwingFilter('length', twingLength, {needs_environment: true}),
            new TwingFilter('slice', twingSlice, {needs_environment: true}),
            new TwingFilter('first', twingFirst, {needs_environment: true}),
            new TwingFilter('last', twingLast, {needs_environment: true}),

            // iteration and runtime
            new TwingFilter('default', twingDefault, {
                expression_factory: function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag: string = null) {
                    return new TwingNodeExpressionFilterDefault(node, filterName, methodArguments, lineno, tag);
                }
            }),
            new TwingFilter('keys', twingKeys),

            // escaping
            new TwingFilter('escape', twingEscape, {
                needs_environment: true,
                is_safe_callback: twingEscapeFilterIsSafe
            }),
            new TwingFilter('e', twingEscape, {
                needs_environment: true,
                is_safe_callback: twingEscapeFilterIsSafe
            })
        ];
    }

    getFunctions(): Array<TwingFunction> {
        return [
            new TwingFunction('max', twingMax),
            new TwingFunction('min', twingMin),
            new TwingFunction('range', range),
            new TwingFunction('constant', twingConstant, {needs_environment: true}),
            new TwingFunction('cycle', twingCycle),
            new TwingFunction('random', twingRandom, {needs_environment: true}),
            new TwingFunction('date', twingEnsureDate, {needs_environment: true}),
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
            new TwingTest('empty', twingIsEmpty),
            new TwingTest('iterable', twingIsIterable)
        ];
    }

    getOperators(): { unary: Map<string, TwingOperatorDefinitionInterface>, binary: Map<string, TwingOperatorDefinitionInterface> } {
        return {
            unary: new Map([
                ['not', {
                    precedence: 50,
                    factory: function (expr: TwingNode, lineno: number) {
                        return new TwingNodeExpressionUnaryNot(expr, lineno);
                    }
                }],
                ['-', {
                    precedence: 500,
                    factory: function (expr: TwingNode, lineno: number) {
                        return new TwingNodeExpressionUnaryNeg(expr, lineno);
                    }
                }],
                ['+', {
                    precedence: 500,
                    factory: function (expr: TwingNode, lineno: number) {
                        return new TwingNodeExpressionUnaryPos(expr, lineno);
                    }
                }]
            ]),
            binary: new Map([
                ['or', {
                    precedence: 10,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryOr(left, right, lineno);
                    }
                }],
                ['and', {
                    precedence: 15,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryAnd(left, right, lineno);
                    }
                }],
                ['b-or', {
                    precedence: 16,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryBitwiseOr(left, right, lineno);
                    }
                }],
                ['b-xor', {
                    precedence: 17,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryBitwiseXor(left, right, lineno);
                    }
                }],
                ['b-and', {
                    precedence: 18,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryBitwiseAnd(left, right, lineno);
                    }
                }],
                ['==', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryEqual(left, right, lineno);
                    }
                }],
                ['!=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryNotEqual(left, right, lineno);
                    }
                }],
                ['<', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryLess(left, right, lineno);
                    }
                }],
                ['>', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryGreater(left, right, lineno);
                    }
                }],
                ['>=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryGreaterEqual(left, right, lineno);
                    }
                }],
                ['<=', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryLessEqual(left, right, lineno);
                    }
                }],
                ['not in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryNotIn(left, right, lineno);
                    }
                }],
                ['in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryIn(left, right, lineno);
                    }
                }],
                ['matches', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryMatches(left, right, lineno);
                    }
                }],
                ['starts with', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryStartsWith(left, right, lineno);
                    }
                }],
                ['ends with', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryEndsWith(left, right, lineno);
                    }
                }],
                ['..', {
                    precedence: 25,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryRange(left, right, lineno);
                    }
                }],
                ['+', {
                    precedence: 30,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryAdd(left, right, lineno);
                    }
                }],
                ['-', {
                    precedence: 30,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinarySub(left, right, lineno);
                    }
                }],
                ['~', {
                    precedence: 40,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryConcat(left, right, lineno);
                    }
                }],
                ['*', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryMul(left, right, lineno);
                    }
                }],
                ['/', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryDiv(left, right, lineno);
                    }
                }],
                ['//', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryFloorDiv(left, right, lineno);
                    }
                }],
                ['%', {
                    precedence: 60,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryMod(left, right, lineno);
                    }
                }],
                ['is', {
                    precedence: 100,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryIs(left, right, lineno);
                    }
                }],
                ['is not', {
                    precedence: 100,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryIsNot(left, right, lineno);
                    }
                }],
                ['**', {
                    precedence: 200,
                    associativity: TwingExpressionParser.OPERATOR_RIGHT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryPower(left, right, lineno);
                    }
                }],
                ['??', {
                    precedence: 300,
                    associativity: TwingExpressionParser.OPERATOR_RIGHT,
                    factory: function (left: TwingNodeExpression, right: TwingNodeExpression, lineno: number) {
                        return new TwingNodeExpressionNullCoalesce(left, right, lineno);
                    }
                }]
            ])
        };
    }
}

export default TwingExtensionCore;