import {TwingExtension} from "../extension";
import {TwingTokenParserFor} from "../token-parser/for";
import {TwingNodeExpressionBinaryAnd} from "../node/expression/binary/and";
import {TwingTokenParserExtends} from "../token-parser/extends";
import {TwingTokenParserFrom} from "../token-parser/from";
import {TwingTokenParserMacro} from "../token-parser/macro";
import {TwingNode} from "../node";
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
import {TwingNodeExpressionTestDefined} from "../node/expression/test/defined";
import {TwingTest} from "../test";
import {TwingNodeExpressionBinaryMatches} from "../node/expression/binary/matches";
import {TwingNodeExpressionBinaryStartsWith} from "../node/expression/binary/starts-with";
import {TwingNodeExpressionBinaryEndsWith} from "../node/expression/binary/ends-with";
import {TwingFilter} from "../filter";
import {Settings as DateTimeSettings} from 'luxon';
import {TwingNodeExpressionConstant} from "../node/expression/constant";
import {TwingNodeExpressionFilterDefault} from "../node/expression/filter/default";
import {merge} from "../helpers/merge";
import {slice} from "../helpers/slice";
import {reverse} from "../helpers/reverse";
import {first} from "../helpers/first";
import {TwingTokenParserDeprecated} from "../token-parser/deprecated";
import {TwingTokenParserApply} from "../token-parser/apply";
import {TwingOperator, TwingOperatorAssociativity, TwingOperatorType} from "../operator";
import {even} from "./core/tests/even";
import {odd} from "./core/tests/odd";
import {sameAs} from "./core/tests/same-as";
import {nullTest} from "./core/tests/null";
import {divisibleBy} from "./core/tests/divisible-by";
import {min} from "./core/functions/min";
import {max} from "./core/functions/max";
import {TwingTokenParserVerbatim} from "../token-parser/verbatim";
import {date} from "./core/filters/date";
import {dateModify} from "./core/filters/date-modify";
import {format} from "./core/filters/format";
import {replace} from "./core/filters/replace";
import {numberFormat} from "./core/filters/number-format";
import {abs} from "./core/filters/abs";
import {urlEncode} from "./core/filters/url-encode";
import {jsonEncode} from "./core/filters/json-encode";
import {convertEncoding} from "./core/filters/convert-encoding";
import {title} from "./core/filters/title";
import {capitalize} from "./core/filters/capitalize";
import {upper} from "./core/filters/upper";
import {lower} from "./core/filters/lower";
import {striptags} from "./core/filters/striptags";
import {trim} from "./core/filters/trim";
import {nl2br} from "./core/filters/nl2br";
import {raw} from "./core/filters/raw";
import {join} from "./core/filters/join";
import {split} from "./core/filters/split";
import {sort} from "./core/filters/sort";
import {merge as mergeFilter} from "./core/filters/merge";
import {batch} from "./core/filters/batch";
import {reverse as reverseFilter} from "./core/filters/reverse";
import {length} from "./core/filters/length";
import {slice as sliceFilter} from "./core/filters/slice";
import {first as firstFilter} from "./core/filters/first";
import {last} from "./core/filters/last";
import {defaultFilter} from "./core/filters/default";
import {escape} from "./core/filters/escape";
import {round} from "./core/filters/round";
import {include} from "./core/functions/include";
import {arrayKeys} from "./core/filters/array-keys";
import {spaceless} from "./core/filters/spaceless";
import {column} from "./core/filters/column";
import {filter} from "./core/filters/filter";
import {map} from "./core/filters/map";
import {reduce} from "./core/filters/reduce";
import {TwingFileExtensionEscapingStrategy} from "../file-extension-escaping-strategy";
import {TwingTokenParserAutoEscape} from "../token-parser/auto-escape";
import {TwingTokenParserSandbox} from "../token-parser/sandbox";
import {TwingBaseNodeVisitor} from "../base-node-visitor";
import {TwingNodeVisitorEscaper} from "../node-visitor/escaper";
import {TwingNodeVisitorSandbox} from "../node-visitor/sandbox";
import {TwingNodeVisitorOptimizer} from "../node-visitor/optimizer";
import {range} from "./core/functions/range";
import {constant} from "./core/functions/constant";
import {cycle} from "./core/functions/cycle";
import {random} from "./core/functions/random";
import {source} from "./core/functions/source";
import {templateFromString} from "./core/functions/template-from-string";
import {dump} from "./core/functions/dump";
import {empty} from "./core/tests/empty";
import {iterable} from "./core/tests/iterable";
import {date as dateFunction} from "./core/functions/date";
import {TwingSourceMapNodeFactorySpaceless} from "../source-map/node-factory/spaceless";
import {TwingSourceMapNodeFactory} from "../source-map/node-factory";
import {TwingNodeExpressionTestConstant} from "../node/expression/test/constant";
import {TwingNodeVisitorMacroAutoImport} from "../node-visitor/macro-auto-import";
import {TwingTokenParserLine} from "../token-parser/line";

export class TwingExtensionCore extends TwingExtension {
    private dateFormats: Array<string> = ['F j, Y H:i', '%d days'];
    private numberFormat: Array<number | string> = [0, '.', ','];
    private timezone: string = null;
    private escapers: Map<string, Function> = new Map();
    private defaultStrategy: string | boolean | Function;

    /**
     * @param {string | boolean | Function} defaultStrategy An escaping strategy
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
            new TwingTokenParserApply(),
            new TwingTokenParserAutoEscape(),
            new TwingTokenParserBlock(),
            new TwingTokenParserDeprecated(),
            new TwingTokenParserDo(),
            new TwingTokenParserEmbed(),
            new TwingTokenParserExtends(),
            new TwingTokenParserFilter(),
            new TwingTokenParserFlush(),
            new TwingTokenParserFor(),
            new TwingTokenParserFrom(),
            new TwingTokenParserIf(),
            new TwingTokenParserImport(),
            new TwingTokenParserInclude(),
            new TwingTokenParserLine(),
            new TwingTokenParserMacro(),
            new TwingTokenParserSandbox(),
            new TwingTokenParserSet(),
            new TwingTokenParserSpaceless(),
            new TwingTokenParserUse(),
            new TwingTokenParserVerbatim(),
            new TwingTokenParserWith(),
        ];
    }

    getSourceMapNodeFactories(): TwingSourceMapNodeFactory[] {
        return [
            new TwingSourceMapNodeFactorySpaceless()
        ];
    }

    getNodeVisitors(): TwingBaseNodeVisitor[] {
        return [
            new TwingNodeVisitorEscaper(),
            new TwingNodeVisitorMacroAutoImport(),
            new TwingNodeVisitorOptimizer(),
            new TwingNodeVisitorSandbox()
        ];
    }

    getFilters() {
        return [
            new TwingFilter('abs', abs, []),
            new TwingFilter('batch', batch, [
                {name: 'size'},
                {name: 'fill', defaultValue: null},
                {name: 'preserve_keys', defaultValue: true}
            ]),
            new TwingFilter('capitalize', capitalize, [], {
                needs_environment: true
            }),
            new TwingFilter('column', column, [
                {name: 'name'}
            ]),
            new TwingFilter('convert_encoding', convertEncoding, [
                {name: 'to'},
                {name: 'from'}
            ], {
                pre_escape: 'html',
                is_safe: ['html']
            }),
            new TwingFilter('date', date, [
                {name: 'format', defaultValue: null},
                {name: 'timezone', defaultValue: null}
            ], {
                needs_environment: true
            }),
            new TwingFilter('date_modify', dateModify, [
                {name: 'modifier'}
            ], {
                needs_environment: true
            }),
            new TwingFilter('default', defaultFilter, [
                {name: 'default'}
            ], {
                expression_factory: function (node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, columnno: number, tag: string) {
                    return new TwingNodeExpressionFilterDefault(node, filterName, methodArguments, lineno, columnno, tag);
                }
            }),
            new TwingFilter('e', escape, [
                {name: 'strategy'},
                {name: 'charset'}
            ], {
                needs_environment: true,
                is_safe_callback: this.escapeFilterIsSafe
            }),
            new TwingFilter('escape', escape, [
                {name: 'strategy'},
                {name: 'charset'}
            ], {
                needs_environment: true,
                is_safe_callback: this.escapeFilterIsSafe
            }),
            new TwingFilter('filter', filter, [
                {name: 'array'},
                {name: 'arrow'}
            ]),
            new TwingFilter('first', firstFilter, [], {
                needs_environment: true
            }),
            new TwingFilter('format', format, []),
            new TwingFilter('join', join, [
                {name: 'glue', defaultValue: ''},
                {name: 'and', defaultValue: null}
            ]),
            new TwingFilter('json_encode', jsonEncode, [
                {name: 'options', defaultValue: null}
            ]),
            new TwingFilter('keys', arrayKeys, []),
            new TwingFilter('last', last, [], {
                needs_environment: true
            }),
            new TwingFilter('length', length, [], {
                needs_environment: true
            }),
            new TwingFilter('lower', lower, [], {
                needs_environment: true
            }),
            new TwingFilter('map', map, [
                {name: 'arrow'}
            ]),
            new TwingFilter('merge', mergeFilter, []),
            new TwingFilter('nl2br', nl2br, [], {
                pre_escape: 'html',
                is_safe: ['html']
            }),
            new TwingFilter('number_format', numberFormat, [
                {name: 'decimal'},
                {name: 'decimal_point'},
                {name: 'thousand_sep'}
            ], {
                needs_environment: true
            }),
            new TwingFilter('raw', raw, [], {
                is_safe: ['all']
            }),
            new TwingFilter('reduce', reduce, [
                {name: 'arrow'},
                {name: 'initial', defaultValue: null}
            ]),
            new TwingFilter('replace', replace, [
                {name: 'from'}
            ]),
            new TwingFilter('reverse', reverseFilter, [
                {name: 'preserve_keys', defaultValue: false}
            ], {
                needs_environment: true
            }),
            new TwingFilter('round', round, [
                {name: 'precision', defaultValue: 0},
                {name: 'method', defaultValue: 'common'}
            ]),
            new TwingFilter('slice', sliceFilter, [
                {name: 'start'},
                {name: 'length', defaultValue: null},
                {name: 'preserve_keys', defaultValue: false}
            ], {
                needs_environment: true
            }),
            new TwingFilter('sort', sort, []),
            new TwingFilter('spaceless', spaceless, [], {
                is_safe: ['html']
            }),
            new TwingFilter('split', split, [
                {name: 'delimiter'},
                {name: 'limit'}
            ], {
                needs_environment: true
            }),
            new TwingFilter('striptags', striptags, [
                {name: 'allowable_tags'}
            ]),
            new TwingFilter('title', title, [], {
                needs_environment: true
            }),
            new TwingFilter('trim', trim, [
                {name: 'character_mask', defaultValue: null},
                {name: 'side', defaultValue: 'both'}
            ]),
            new TwingFilter('upper', upper, [], {
                needs_environment: true
            }),
            new TwingFilter('url_encode', urlEncode, []),
        ];
    }

    getFunctions() {
        return [
            new TwingFunction('constant', constant, [
                {name: 'name'},
                {name: 'object', defaultValue: null}
            ], {
                needs_environment: true
            }),
            new TwingFunction('cycle', cycle, [
                {name: 'values'},
                {name: 'position'}
            ]),
            new TwingFunction('date', dateFunction, [
                {name: 'date'},
                {name: 'timezone'}
            ], {
                needs_environment: true
            }),
            new TwingFunction('dump', dump, [], {
                is_safe: ['html'],
                needs_context: true
            }),
            new TwingFunction('include', include, [
                {name: 'template'},
                {name: 'variables', defaultValue: {}},
                {name: 'with_context', defaultValue: true},
                {name: 'ignore_missing', defaultValue: false},
                {name: 'sandboxed', defaultValue: false}
            ], {
                needs_context: true,
                needs_environment: true,
                needs_source: true,
                is_safe: ['all']
            }),
            new TwingFunction('max', max, []),
            new TwingFunction('min', min, []),
            new TwingFunction('random', random, [
                {name: 'values', defaultValue: null},
                {name: 'max', defaultValue: null}
            ], {
                needs_environment: true
            }),
            new TwingFunction('range', range, [
                {name: 'low'},
                {name: 'high'},
                {name: 'step'}
            ]),
            new TwingFunction('source', source, [
                {name: 'name'},
                {name: 'ignore_missing', defaultValue: false}
            ], {
                needs_environment: true,
                needs_source: true,
                is_safe: ['all']
            }),
            new TwingFunction('template_from_string', templateFromString, [
                {name: 'template'},
                {name: 'name', defaultValue: null}
            ], {
                needs_environment: true
            })
        ];
    }

    getTests(): Array<TwingTest> {
        return [
            new TwingTest('constant', null, [], {
                expression_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestConstant(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('divisible by', divisibleBy, []),
            new TwingTest('defined', null, [], {
                expression_factory: function (node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number, columnno: number) {
                    return new TwingNodeExpressionTestDefined(node, name, nodeArguments, lineno, columnno);
                }
            }),
            new TwingTest('empty', empty, []),
            new TwingTest('even', even, []),
            new TwingTest('iterable', iterable, []),
            new TwingTest('none', nullTest, []),
            new TwingTest('null', nullTest, []),
            new TwingTest('odd', odd, []),
            new TwingTest('same as', sameAs, []),
        ];
    }

    getOperators(): TwingOperator[] {
        return [
            new TwingOperator('not', TwingOperatorType.UNARY, 50, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionUnaryNot(operands[0], lineno, columnno);
            }),
            new TwingOperator('-', TwingOperatorType.UNARY, 500, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionUnaryNeg(operands[0], lineno, columnno);
            }),
            new TwingOperator('+', TwingOperatorType.UNARY, 500, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionUnaryPos(operands[0], lineno, columnno);
            }),
            new TwingOperator('or', TwingOperatorType.BINARY, 10, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryOr(operands, lineno, columnno);
            }),
            new TwingOperator('and', TwingOperatorType.BINARY, 15, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryAnd(operands, lineno, columnno);
            }),
            new TwingOperator('b-or', TwingOperatorType.BINARY, 16, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryBitwiseOr(operands, lineno, columnno);
            }),
            new TwingOperator('b-xor', TwingOperatorType.BINARY, 17, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryBitwiseXor(operands, lineno, columnno);
            }),
            new TwingOperator('b-and', TwingOperatorType.BINARY, 18, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryBitwiseAnd(operands, lineno, columnno);
            }),
            new TwingOperator('==', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryEqual(operands, lineno, columnno);
            }),
            new TwingOperator('!=', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryNotEqual(operands, lineno, columnno);
            }),
            new TwingOperator('<', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryLess(operands, lineno, columnno);
            }),
            new TwingOperator('<=', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryLessEqual(operands, lineno, columnno);
            }),
            new TwingOperator('>', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryGreater(operands, lineno, columnno);
            }),
            new TwingOperator('>=', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryGreaterEqual(operands, lineno, columnno);
            }),
            new TwingOperator('not in', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryNotIn(operands, lineno, columnno);
            }),
            new TwingOperator('in', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryIn(operands, lineno, columnno);
            }),
            new TwingOperator('matches', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryMatches(operands, lineno, columnno);
            }),
            new TwingOperator('starts with', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryStartsWith(operands, lineno, columnno);
            }),
            new TwingOperator('ends with', TwingOperatorType.BINARY, 20, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryEndsWith(operands, lineno, columnno);
            }),
            new TwingOperator('..', TwingOperatorType.BINARY, 25, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryRange(operands, lineno, columnno);
            }),
            new TwingOperator('+', TwingOperatorType.BINARY, 30, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryAdd(operands, lineno, columnno);
            }),
            new TwingOperator('-', TwingOperatorType.BINARY, 30, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinarySub(operands, lineno, columnno);
            }),
            new TwingOperator('~', TwingOperatorType.BINARY, 40, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryConcat(operands, lineno, columnno);
            }),
            new TwingOperator('*', TwingOperatorType.BINARY, 60, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryMul(operands, lineno, columnno);
            }),
            new TwingOperator('/', TwingOperatorType.BINARY, 60, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryDiv(operands, lineno, columnno);
            }),
            new TwingOperator('//', TwingOperatorType.BINARY, 60, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryFloorDiv(operands, lineno, columnno);
            }),
            new TwingOperator('%', TwingOperatorType.BINARY, 60, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryMod(operands, lineno, columnno);
            }),
            new TwingOperator('is', TwingOperatorType.BINARY, 100, null),
            new TwingOperator('is not', TwingOperatorType.BINARY, 100, null),
            new TwingOperator('**', TwingOperatorType.BINARY, 200, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionBinaryPower(operands, lineno, columnno);
            }, TwingOperatorAssociativity.RIGHT),
            new TwingOperator('??', TwingOperatorType.BINARY, 300, function (operands: [TwingNode, TwingNode], lineno: number, columnno: number) {
                return new TwingNodeExpressionNullCoalesce(operands, lineno, columnno);
            }, TwingOperatorAssociativity.RIGHT)
        ];
    }

    /**
     * @internal
     */
    private escapeFilterIsSafe(filterArgs: TwingNode) {
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
