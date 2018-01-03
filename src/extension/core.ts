import TwingExtension from "../extension";
import TwingTokenParserFor from "../token-parser/for";
import TwingExpressionParser from "../expression-parser";
import TwingNodeExpressionBinaryAnd from "../node/expression/binary/and";
import TwingTokenParserExtends from "../token-parser/extends";
import TwingTokenParserFrom from "../token-parser/from";
import TwingTokenParserMacro from "../token-parser/macro";
import TwingNode from "../node";
import TwingNodeExpressionBinaryIn = require("../node/expression/binary/in");
import TwingOperatorDefinitionInterface = require("../operator-definition-interface");
import TwingTokenParserIf = require("../token-parser/if");
import TwingTokenParserSet from "../token-parser/set";
import TwingEnvironment = require("../environment");
import TwingFilterEscape = require("../filter/escape");
import TwingTestDefined = require("../test/defined");
import TwingNodeExpressionBinaryIs = require("../node/expression/binary/is");
import TwingNodeExpressionBinaryIsNot = require("../node/expression/binary/is-not");
import TwingTestConstant = require("../test/constant");
import TwingTokenParserBlock = require("../token-parser/block");
import TwingFilterLower = require("../filter/lower");
import TwingNodeExpressionBinaryGreater = require("../node/expression/binary/greater");
import TwingNodeExpressionBinaryLess from "../node/expression/binary/less";
import TwingTokenParserInclude = require("../token-parser/include");
import TwingTokenParserWith = require("../token-parser/with");
import TwingNodeExpressionUnaryNot = require("../node/expression/unary/not");
import TwingNodeExpressionUnaryNeg = require("../node/expression/unary/neg");
import TwingNodeExpressionUnaryPos = require("../node/expression/unary/pos");
import TwingFunction from "../function";
import TwingTokenParserSpaceless = require("../token-parser/spaceless");
import TwingMap from "../map";
import TwingFunctionInclude = require("../function/include");
import TwingNodeExpressionBinaryConcat from "../node/expression/binary/concat";
import TwingNodeExpressionBinaryMul from "../node/expression/binary/mul";
import TwingNodeExpressionBinaryDiv from "../node/expression/binary/div";
import TwingNodeExpressionBinaryFloorDiv from "../node/expression/binary/floor-div";
import TwingNodeExpressionBinaryMod from "../node/expression/binary/mod";
import TwingNodeExpressionBinarySub from "../node/expression/binary/sub";
import TwingNodeExpressionBinaryAdd from "../node/expression/binary/add";
import TwingTokenParserUse = require("../token-parser/use");
import TwingFilterUpper = require("../filter/upper");
import TwingFilterNl2br = require("../filter/nl2br");
import TwingFilterFormat = require("../filter/format");
import TwingFilterReplace = require("../filter/replace");
import TwingTokenParserEmbed = require("../token-parser/embed");
import TwingTokenParserFilter = require("../token-parser/filter");
import TwingFilterJsonEncode = require("../filter/json-encode");
import TwingFilterTitle = require("../filter/title");
import TwingFilterJoin = require("../filter/join");
import TwingNodeExpressionBinaryRange = require("../node/expression/binary/range");
import TwingTestOdd = require("../test/odd");
import TwingFilterKeys = require("../filter/keys");
import TwingTokenParserImport = require("../token-parser/import");
import TwingFilterDefault = require("../filter/default");
import TwingTokenParserDo = require("../token-parser/do");

class TwingExtensionCore extends TwingExtension {
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
            // new TwingTokenParserFlush(),
            new TwingTokenParserDo(),
            new TwingTokenParserEmbed(),
            new TwingTokenParserWith()
        ];
    }

    getFilters() {
        return [
            // formatting filters
            //     new TwingFilter('date', 'twig_date_format_filter', array('needs_environment' => true)),
            // new TwingFilter('date_modify', 'twig_date_modify_filter', array('needs_environment' => true)),
            new TwingFilterFormat('format'),
            new TwingFilterReplace('replace'),
            //     new TwingFilter('number_format', 'twig_number_format_filter', array('needs_environment' => true)),
            // new TwingFilter('abs', 'abs'),
            //     new TwingFilter('round', 'twig_round'),
            //
            // encoding
            //     new TwingFilter('url_encode', 'twig_urlencode_filter'),
            new TwingFilterJsonEncode('json_encode'),
            //     new TwingFilter('convert_encoding', 'twig_convert_encoding'),
            //
            // string filters
            new TwingFilterTitle('title'),
            // new TwingFilter('capitalize', 'twig_capitalize_string_filter', array('needs_environment' => true)),
            new TwingFilterUpper('upper'),
            new TwingFilterLower('lower'),
            // new TwingFilter('striptags', 'strip_tags'),
            //     new TwingFilter('trim', 'twig_trim_filter'),
            new TwingFilterNl2br('nl2br'),
            //
            // array helpers
            new TwingFilterJoin('join'),
            //     new TwingFilter('split', 'twig_split_filter', array('needs_environment' => true)),
            // new TwingFilter('sort', 'twig_sort_filter'),
            //     new TwingFilter('merge', 'twig_array_merge'),
            //     new TwingFilter('batch', 'twig_array_batch'),
            //
            //     // string/array filters
            //     new TwingFilter('reverse', 'twig_reverse_filter', array('needs_environment' => true)),
            // new TwingFilter('length', 'twig_length_filter', array('needs_environment' => true)),
            // new TwingFilter('slice', 'twig_slice', array('needs_environment' => true)),
            // new TwingFilter('first', 'twig_first', array('needs_environment' => true)),
            // new TwingFilter('last', 'twig_last', array('needs_environment' => true)),
            //
            // iteration and runtime
            new TwingFilterDefault('default'),
            new TwingFilterKeys('keys'),

            // escaping
            new TwingFilterEscape('escape'),
            new TwingFilterEscape('e')
        ];
    }

    getFunctions(): Array<TwingFunction> {
        return [
            // new Twig_Function('max', 'max'),
            // new Twig_Function('min', 'min'),
            // new Twig_Function('range', 'range'),
            // new Twig_Function('constant', 'twig_constant'),
            // new Twig_Function('cycle', 'twig_cycle'),
            // new Twig_Function('random', 'twig_random', array('needs_environment' => true)),
            // new Twig_Function('date', 'twig_date_converter', array('needs_environment' => true)),
            new TwingFunctionInclude('include'),
            // new Twig_Function('source', 'twig_source', array('needs_environment' => true, 'is_safe' => array('all'))),
        ];
    }

    getTests() {
        return new Map([
            // new TwingTest('even', null, {'node_class': 'Twig_Node_Expression_Test_Even'}),
            ['odd', new TwingTestOdd()],
            ['defined', new TwingTestDefined()],
            // new TwingTest('same as', null, {'node_class': 'Twig_Node_Expression_Test_Sameas'}),
            // new TwingTest('none', null, {'node_class': 'Twig_Node_Expression_Test_Null'}),
            // new TwingTest('null', null, {
            //     'node_factory': function (node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode = null, lineno: number) {
            //         return new TwingNodeExpressionTestNull(node, name, nodeArguments, lineno);
            //     }
            // }),
            // new TwingTest('divisible by', null, {'node_class': 'Twig_Node_Expression_Test_Divisibleby'}),
            ['constant', new TwingTestConstant()],
            // new TwingTest('empty', 'twig_test_empty'),
            // new TwingTest('iterable', 'twig_test_iterable')
        ]);
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
                // 'or' => array('precedence' => 10, 'class' => 'Twig_Node_Expression_Binary_Or', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                ['and', {
                    precedence: 15,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryAnd(left, right, lineno);
                    }
                }],
                // 'b-or' => array('precedence' => 16, 'class' => 'Twig_Node_Expression_Binary_BitwiseOr', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // 'b-xor' => array('precedence' => 17, 'class' => 'Twig_Node_Expression_Binary_BitwiseXor', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // 'b-and' => array('precedence' => 18, 'class' => 'Twig_Node_Expression_Binary_BitwiseAnd', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // '==' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_Equal', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // '!=' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_NotEqual', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
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
                // '>=' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_GreaterEqual', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // '<=' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_LessEqual', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // 'not in' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_NotIn', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                ['in', {
                    precedence: 20,
                    associativity: TwingExpressionParser.OPERATOR_LEFT,
                    factory: function (left: TwingNode, right: TwingNode, lineno: number) {
                        return new TwingNodeExpressionBinaryIn(left, right, lineno);
                    }
                }],
                // 'matches' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_Matches', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // 'starts with' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_StartsWith', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
                // 'ends with' => array('precedence' => 20, 'class' => 'Twig_Node_Expression_Binary_EndsWith', 'associativity' => Twig_ExpressionParser::OPERATOR_LEFT),
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
                // '**' => array('precedence' => 200, 'class' => 'Twig_Node_Expression_Binary_Power', 'associativity' => Twig_ExpressionParser::OPERATOR_RIGHT),
                // '??' => array('precedence' => 300, 'class' => 'Twig_Node_Expression_NullCoalesce', 'associativity' => Twig_ExpressionParser::OPERATOR_RIGHT),
            ])
        };
    }
}

export default TwingExtensionCore;