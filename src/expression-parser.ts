import {TwingParser} from "./parser";
import {TwingNodeExpression} from "./node/expression";
import {TwingToken, TwingTokenType} from "./token";
import {TwingNode, TwingNodeType} from "./node";
import {TwingNodeExpressionConstant} from "./node/expression/constant";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingLexer} from "./lexer";
import {TwingNodeExpressionName} from "./node/expression/name";
import {TwingNodeExpressionBinaryConcat} from "./node/expression/binary/concat";
import {TwingNodeExpressionGetAttr} from "./node/expression/get-attr";
import {TwingNodeExpressionMethodCall} from "./node/expression/method-call";
import {TwingNodeExpressionArray} from "./node/expression/array";
import {TwingNodeExpressionConditional} from "./node/expression/conditional";
import {TwingEnvironment} from "./environment";
import {TwingTemplate} from "./template";
import {TwingNodeExpressionAssignName} from "./node/expression/assign-name";
import {TwingTest} from "./test";
import {TwingNodeExpressionParent} from "./node/expression/parent";
import {TwingNodeExpressionBlockReference} from "./node/expression/block-reference";
import {TwingNodeExpressionHash} from "./node/expression/hash";
import {TwingNodeExpressionUnaryNot} from "./node/expression/unary/not";
import {push} from "./helper/push";
import {TwingOperator} from "./extension";

/**
 * Parses expressions.
 *
 * This parser implements a "Precedence climbing" algorithm.
 *
 * @see https://www.engr.mun.ca/~theo/Misc/exp_parsing.htm
 * @see https://en.wikipedia.org/wiki/Operator-precedence_parser
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 *
 * @internal
 */
export class TwingExpressionParser {
    // @todo: should be a separate enum
    static OPERATOR_LEFT = 'OPERATOR_LEFT';
    static OPERATOR_RIGHT = 'OPERATOR_RIGHT';
    private parser: TwingParser;
    private env: TwingEnvironment;
    private unaryOperators: Map<string, TwingOperator>;
    private binaryOperators: Map<string, TwingOperator>;

    constructor(parser: TwingParser, env: TwingEnvironment) {
        this.parser = parser;
        this.env = env;
        this.unaryOperators = env.getUnaryOperators();
        this.binaryOperators = env.getBinaryOperators();
    }

    parseExpression(precedence: number = 0): TwingNodeExpression {
        let expr = this.getPrimary();
        let token = this.parser.getCurrentToken();

        while (this.isBinary(token) && this.binaryOperators.get(token.getContent()).precedence >= precedence) {
            let op = this.binaryOperators.get(token.getContent());

            this.parser.getStream().next();

            if (token.getContent() === 'is not') {
                expr = this.parseNotTestExpression(expr);
            } else if (token.getContent() === 'is') {
                expr = this.parseTestExpression(expr);
            } else if (op.callable) {
                expr = op.callable.call(this.parser, expr);
            } else {
                let expr1 = this.parseExpression(op.associativity === TwingExpressionParser.OPERATOR_LEFT ? op.precedence + 1 : op.precedence);
                let opFactory = op.factory;

                expr = opFactory(expr, expr1, token.getLine());
            }

            token = this.parser.getCurrentToken();
        }

        if (precedence === 0) {
            return this.parseConditionalExpression(expr);
        }

        return expr;
    }

    getPrimary(): TwingNodeExpression {
        let token = this.parser.getCurrentToken();

        if (this.isUnary(token)) {
            let operator = this.unaryOperators.get(token.getContent());
            this.parser.getStream().next();
            let expr = this.parseExpression(operator.precedence);

            return this.parsePostfixExpression(operator.factory(expr, token.getLine()));
        } else if (token.test(TwingTokenType.PUNCTUATION, '(')) {
            this.parser.getStream().next();
            let expr = this.parseExpression();
            this.parser.getStream().expect(TwingTokenType.PUNCTUATION, ')', 'An opened parenthesis is not properly closed');

            return this.parsePostfixExpression(expr);
        }

        return this.parsePrimaryExpression();
    }

    parsePrimaryExpression() {
        let token: TwingToken = this.parser.getCurrentToken();
        let node: TwingNodeExpression;

        switch (token.getType()) {
            case TwingTokenType.WHITESPACE:
                this.parser.getStream().next();
                break;
            case TwingTokenType.NAME:
                this.parser.getStream().next();

                switch (token.getContent()) {
                    case 'true':
                    case 'TRUE':
                        node = new TwingNodeExpressionConstant(true, token.getLine(), token.getColumn());
                        break;

                    case 'false':
                    case 'FALSE':
                        node = new TwingNodeExpressionConstant(false, token.getLine(), token.getColumn());
                        break;

                    case 'none':
                    case 'NONE':
                    case 'null':
                    case 'NULL':
                        node = new TwingNodeExpressionConstant(null, token.getLine(), token.getColumn());
                        break;

                    default:
                        if ('(' === this.parser.getCurrentToken().getContent()) {
                            node = this.getFunctionNode(token.getContent(), token.getLine(), token.getColumn());
                        } else {
                            node = new TwingNodeExpressionName(token.getContent(), token.getLine(), token.getColumn());
                        }
                }
                break;

            case TwingTokenType.NUMBER:
                this.parser.getStream().next();
                node = new TwingNodeExpressionConstant(Number(token.getContent()), token.getLine(), token.getColumn());
                break;

            case TwingTokenType.OPENING_QUOTE:
            case TwingTokenType.INTERPOLATION_START:
                node = this.parseStringExpression();
                break;

            case TwingTokenType.OPERATOR:
                let match = TwingLexer.REGEX_NAME.exec(token.getContent());

                if (match !== null && match[0] === token.getContent()) {
                    // in this context, string operators are variable names
                    this.parser.getStream().next();
                    node = new TwingNodeExpressionName(token.getContent(), token.getLine(), token.getColumn());

                    break;
                } else if (this.unaryOperators.has(token.getContent())) {
                    let op = this.unaryOperators.get(token.getContent());
                    //
                    // ref = new ReflectionClass(class);
                    // negClass = 'Twig_Node_Expression_Unary_Neg';
                    // posClass = 'Twig_Node_Expression_Unary_Pos';
                    //
                    // if (!(in_array(ref.getTemplateName(), array(negClass, posClass)) || ref.isSubclassOf(negClass) || ref.isSubclassOf(posClass))) {
                    //     throw new Twig_Error_Syntax(sprintf('Unexpected unary operator "%s".', token.getContent()), token.getLine(), this.parser.getStream().getSourceContext());
                    // }
                    //
                    this.parser.getStream().next();

                    let expr = this.parsePrimaryExpression();

                    node = op.factory(expr, token.getLine());

                    break;
                }
            default:
                if (token.test(TwingTokenType.PUNCTUATION, '[')) {
                    node = this.parseArrayExpression();
                } else if (token.test(TwingTokenType.PUNCTUATION, '{')) {
                    node = this.parseHashExpression();
                } else if (token.test(TwingTokenType.OPERATOR, '=') && (this.parser.getStream().look(-1).getContent() === '==' || this.parser.getStream().look(-1).getContent() === '!=')) {
                    throw new TwingErrorSyntax(`Unexpected operator of value "${token.getContent()}". Did you try to use "===" or "!==" for strict comparison? Use "is same as(value)" instead.`, token.getLine(), this.parser.getStream().getSourceContext());
                } else {

                    throw new TwingErrorSyntax(`Unexpected token "${TwingToken.typeToEnglish(token.getType())}" of value "${token.getContent()}".`, token.getLine(), this.parser.getStream().getSourceContext());
                }
        }

        return this.parsePostfixExpression(node);
    }

    getFunctionNode(name: string, line: number, column: number): TwingNodeExpression {
        switch (name) {
            case 'parent':
                this.parseArguments();

                if (!this.parser.getBlockStack().length) {
                    throw new TwingErrorSyntax('Calling "parent" outside a block is forbidden.', line, this.parser.getStream().getSourceContext());
                }

                if (!this.parser.getParent() && !this.parser.hasTraits()) {
                    throw new TwingErrorSyntax('Calling "parent" on a template that does not extend nor "use" another template is forbidden.', line, this.parser.getStream().getSourceContext());
                }

                return new TwingNodeExpressionParent(this.parser.peekBlockStack(), line, column);
            case 'block':
                let blockArgs = this.parseArguments();

                if (blockArgs.getNodes().size < 1) {
                    throw new TwingErrorSyntax('The "block" function takes one argument (the block name).', line, this.parser.getStream().getSourceContext());
                }

                return new TwingNodeExpressionBlockReference(blockArgs.getNode(0), blockArgs.getNodes().size > 1 ? blockArgs.getNode(1) : null, line, column);
            case 'attribute':
                let attributeArgs = this.parseArguments();

                if (attributeArgs.getNodes().size < 2) {
                    throw new TwingErrorSyntax('The "attribute" function takes at least two arguments (the variable and the attributes).', line, this.parser.getStream().getSourceContext());
                }

                return new TwingNodeExpressionGetAttr(<TwingNodeExpression>attributeArgs.getNode(0), <TwingNodeExpression>attributeArgs.getNode(1), attributeArgs.getNodes().size > 2 ? <TwingNodeExpression>attributeArgs.getNode(2) : null, TwingTemplate.ANY_CALL, line, column);
            default:
                let alias = this.parser.getImportedSymbol('function', name);

                if (alias) {
                    let functionArguments = new TwingNodeExpressionArray(new Map(), line, column);

                    this.parseArguments().getNodes().forEach(function (n, name) {
                        functionArguments.addElement(n);
                    });

                    let node = new TwingNodeExpressionMethodCall(alias.node, alias.name, functionArguments, line, column);

                    node.setAttribute('safe', true);

                    return node;
                }

                let aliasArguments = this.parseArguments(true);
                let aliasFactory = this.getFunctionExpressionFactory(name, line, column);

                return aliasFactory(name, aliasArguments, line, column);
        }
    }

    parseStringExpression(): TwingNodeExpression {
        let stream = this.parser.getStream();

        let nodes: TwingNode[] = [];

        // a string cannot be followed by another string in a single expression
        let nextCanBeString: boolean = true;
        let token: TwingToken;

        stream.expect(TwingTokenType.OPENING_QUOTE);

        while (true) {
            if (nextCanBeString && (token = stream.nextIf(TwingTokenType.STRING))) {
                nodes.push(new TwingNodeExpressionConstant(token.getContent(), token.getLine(), token.getColumn()));
                nextCanBeString = false;
            } else if (stream.nextIf(TwingTokenType.INTERPOLATION_START)) {
                nodes.push(this.parseExpression());
                stream.expect(TwingTokenType.INTERPOLATION_END);
                nextCanBeString = true;
            } else {
                break;
            }
        }

        let closingQuote = stream.expect(TwingTokenType.CLOSING_QUOTE);

        // empty string - i.e. an OPENING_QUOTE immediately followed by a CLOSING_QUOTE
        if (nodes.length < 1) {
            nodes.push(new TwingNodeExpressionConstant('', closingQuote.getLine(), closingQuote.getColumn()));
        }

        let expr = nodes.shift();

        nodes.forEach(function (node) {
            expr = new TwingNodeExpressionBinaryConcat(expr, node, expr.getTemplateLine(), expr.getTemplateColumn());
        });

        return expr;
    }

    parseArrayExpression(): TwingNodeExpression {
        let stream = this.parser.getStream();

        let punctuation = stream.expect(TwingTokenType.PUNCTUATION, '[', 'An array element was expected');

        let node = new TwingNodeExpressionArray(new Map(), punctuation.getLine(), punctuation.getColumn());
        let first = true;

        while (!stream.test(TwingTokenType.PUNCTUATION, ']')) {
            if (!first) {
                stream.expect(TwingTokenType.PUNCTUATION, ',', 'An array element must be followed by a comma');

                // trailing ,?
                if (stream.test(TwingTokenType.PUNCTUATION, ']')) {
                    break;
                }
            }

            first = false;

            node.addElement(this.parseExpression());
        }

        stream.expect(TwingTokenType.PUNCTUATION, ']', 'An opened array is not properly closed');

        return node;
    }

    parseHashExpression(): TwingNodeExpression {
        let stream = this.parser.getStream();

        let punctuation = stream.expect(TwingTokenType.PUNCTUATION, '{', 'A hash element was expected');

        let node = new TwingNodeExpressionHash(new Map(), punctuation.getLine(), punctuation.getColumn());
        let first = true;

        while (!stream.test(TwingTokenType.PUNCTUATION, '}')) {
            if (!first) {
                stream.expect(TwingTokenType.PUNCTUATION, ',', 'A hash value must be followed by a comma');

                // trailing ,?
                if (stream.test(TwingTokenType.PUNCTUATION, '}')) {
                    break;
                }
            }

            first = false;

            // a hash key can be:
            //
            //  * a number -- 12
            //  * a string -- 'a'
            //  * a name, which is equivalent to a string -- a
            //  * an expression, which must be enclosed in parentheses -- (1 + 2)
            let key;
            let quoted: boolean = false;

            let token = stream.nextIf(TwingTokenType.OPENING_QUOTE);

            if (token) {
                quoted = true;
            }

            if ((token = stream.nextIf(TwingTokenType.STRING)) || (token = stream.nextIf(TwingTokenType.NAME)) || (token = stream.nextIf(TwingTokenType.NUMBER))) {
                key = new TwingNodeExpressionConstant(token.getContent(), token.getLine(), token.getColumn());
            } else if (stream.test(TwingTokenType.PUNCTUATION, '(')) {
                key = this.parseExpression();
            } else {
                let current = stream.getCurrent();

                throw new TwingErrorSyntax(`A hash key must be a quoted string, a number, a name, or an expression enclosed in parentheses (unexpected token "${TwingToken.typeToEnglish(current.getType())}" of value "${current.getContent()}".`, current.getLine(), stream.getSourceContext());
            }

            if (quoted) {
                stream.expect(TwingTokenType.CLOSING_QUOTE);
            }

            stream.expect(TwingTokenType.PUNCTUATION, ':', 'A hash key must be followed by a colon (:)');

            let value = this.parseExpression();

            node.addElement(value, key);
        }

        stream.expect(TwingTokenType.PUNCTUATION, '}', 'An opened hash is not properly closed');

        return node;
    }

    parseSubscriptExpression(node: TwingNodeExpression) {
        let stream = this.parser.getStream();
        let token = stream.next();
        let lineno = token.getLine();
        let columnno = token.getColumn();
        let arguments_ = new TwingNodeExpressionArray(new Map(), lineno, columnno);
        let arg: TwingNodeExpression;

        let type = TwingTemplate.ANY_CALL;

        if (token.getContent() === '.') {
            token = stream.next();

            let match = TwingLexer.REGEX_NAME.exec(token.getContent());

            if ((token.getType() === TwingTokenType.NAME) || (token.getType() === TwingTokenType.NUMBER) || (token.getType() === TwingTokenType.OPERATOR && (match !== null))) {
                arg = new TwingNodeExpressionConstant(token.getContent(), lineno, columnno);

                if (stream.test(TwingTokenType.PUNCTUATION, '(')) {
                    type = TwingTemplate.METHOD_CALL;

                    let node = this.parseArguments();

                    node.getNodes().forEach(function (n, k) {
                        arguments_.addElement(n);
                    });
                }
            } else {
                throw new TwingErrorSyntax('Expected name or number.', lineno, stream.getSourceContext());
            }

            if ((node.getType() === TwingNodeType.EXPRESSION_NAME) && this.parser.getImportedSymbol('template', node.getAttribute('name'))) {
                const varValidator = require('var-validator');

                let name = arg.getAttribute('value');

                if (!varValidator.isValid(name)) {
                    name = Buffer.from(name).toString('hex');
                }

                node = new TwingNodeExpressionConstant(node.getAttribute('name'), node.getTemplateLine(), node.getTemplateColumn());
                node = new TwingNodeExpressionMethodCall(node, 'macro_' + name, arguments_, lineno, columnno);
                node.setAttribute('safe', true);

                return node;
            }
        } else {
            type = TwingTemplate.ARRAY_CALL;

            // slice?
            let slice = false;

            if (stream.test(TwingTokenType.PUNCTUATION, ':')) {
                slice = true;
                arg = new TwingNodeExpressionConstant(0, token.getLine(), token.getColumn());
            } else {
                arg = this.parseExpression();
            }

            if (stream.nextIf(TwingTokenType.PUNCTUATION, ':')) {
                slice = true;
            }

            if (slice) {
                let length: TwingNodeExpression;

                if (stream.test(TwingTokenType.PUNCTUATION, ']')) {
                    length = new TwingNodeExpressionConstant(null, token.getLine(), token.getColumn());
                } else {
                    length = this.parseExpression();
                }

                let factory = this.getFilterExpressionFactory('slice', token.getLine(), token.getColumn());
                let filterArguments = new TwingNode(new Map([[0, arg], [1, length]]));
                let filter = factory.call(this, node, new TwingNodeExpressionConstant('slice', token.getLine(), token.getColumn()), filterArguments, token.getLine(), token.getColumn());

                stream.expect(TwingTokenType.PUNCTUATION, ']');

                return filter;
            }

            stream.expect(TwingTokenType.PUNCTUATION, ']');
        }

        return new TwingNodeExpressionGetAttr(node, arg, arguments_, type, lineno, columnno);
    }

    parsePostfixExpression(node: TwingNodeExpression): TwingNodeExpression {
        while (true) {
            let token = this.parser.getCurrentToken();

            if (token.getType() === TwingTokenType.PUNCTUATION) {
                if ('.' == token.getContent() || '[' == token.getContent()) {
                    node = this.parseSubscriptExpression(node);
                } else if ('|' == token.getContent()) {
                    node = this.parseFilterExpression(node);
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        return node;
    }

    parseTestExpression(node: TwingNodeExpression): TwingNodeExpression {
        let stream = this.parser.getStream();
        let name: string;
        let test: TwingTest;

        [name, test] = this.getTest(node.getTemplateLine());

        let nodeFactory = test.getNodeFactory();

        let testArguments = null;

        if (stream.test(TwingTokenType.PUNCTUATION, '(')) {
            testArguments = this.parser.getExpressionParser().parseArguments(true);
        }

        return nodeFactory.call(this, node, name, testArguments, this.parser.getCurrentToken().getLine());
    }

    parseNotTestExpression(node: TwingNodeExpression): TwingNodeExpression {
        return new TwingNodeExpressionUnaryNot(this.parseTestExpression(node), this.parser.getCurrentToken().getLine(), this.parser.getCurrentToken().getColumn());
    }

    parseConditionalExpression(expr: TwingNodeExpression): TwingNodeExpression {
        let expr2;
        let expr3;

        while (this.parser.getStream().nextIf(TwingTokenType.PUNCTUATION, '?')) {
            if (!this.parser.getStream().nextIf(TwingTokenType.PUNCTUATION, ':')) {
                expr2 = this.parseExpression();

                if (this.parser.getStream().nextIf(TwingTokenType.PUNCTUATION, ':')) {
                    expr3 = this.parseExpression();
                } else {
                    expr3 = new TwingNodeExpressionConstant('', this.parser.getCurrentToken().getLine(), this.parser.getCurrentToken().getColumn());
                }
            } else {
                expr2 = expr;
                expr3 = this.parseExpression();
            }

            expr = new TwingNodeExpressionConditional(expr, expr2, expr3, this.parser.getCurrentToken().getLine(), this.parser.getCurrentToken().getColumn());
        }

        return expr;
    }

    parseFilterExpression(node: TwingNodeExpression): TwingNodeExpression {
        this.parser.getStream().next();

        return this.parseFilterExpressionRaw(node);
    }

    parseFilterExpressionRaw(node: TwingNodeExpression, tag: string = null): TwingNodeExpression {
        while (true) {
            let token = this.parser.getStream().expect(TwingTokenType.NAME);

            let name = new TwingNodeExpressionConstant(token.getContent(), token.getLine(), token.getColumn());
            let methodArguments;

            if (!this.parser.getStream().test(TwingTokenType.PUNCTUATION, '(')) {
                methodArguments = new TwingNode();
            } else {
                methodArguments = this.parseArguments(true);
            }

            let factory = this.getFilterExpressionFactory('' + name.getAttribute('value'), token.getLine(), token.getColumn());

            node = factory.call(this, node, name, methodArguments, token.getLine(), tag);

            if (!this.parser.getStream().test(TwingTokenType.PUNCTUATION, '|')) {
                break;
            }

            this.parser.getStream().next();
        }

        return node;
    }

    /**
     * Parses arguments.
     *
     * @param namedArguments boolean Whether to allow named arguments or not
     * @param definition     boolean Whether we are parsing arguments for a function definition
     *
     * @return TwingNode
     *
     * @throws TwingErrorSyntax
     */
    parseArguments(namedArguments: boolean = false, definition: boolean = false): TwingNode {
        let parsedArguments = new Map();
        let stream = this.parser.getStream();
        let value: TwingNodeExpression;
        let token;

        stream.expect(TwingTokenType.PUNCTUATION, '(', 'A list of arguments must begin with an opening parenthesis');

        while (!stream.test(TwingTokenType.PUNCTUATION, ')')) {
            if (parsedArguments.size > 0) {
                stream.expect(TwingTokenType.PUNCTUATION, ',', 'Arguments must be separated by a comma');
            }

            if (definition) {
                token = stream.expect(TwingTokenType.NAME, null, 'An argument must be a name');

                value = new TwingNodeExpressionName(token.getContent(), this.parser.getCurrentToken().getLine(), this.parser.getCurrentToken().getColumn());
            } else {
                value = this.parseExpression();
            }

            let name = null;

            if (namedArguments && (token = stream.nextIf(TwingTokenType.OPERATOR, '='))) {
                if (value.getType() !== TwingNodeType.EXPRESSION_NAME) {
                    throw new TwingErrorSyntax(`A parameter name must be a string, "${value.constructor.name}" given.`, token.getLine(), stream.getSourceContext());
                }
                name = value.getAttribute('name');

                if (definition) {
                    value = this.parsePrimaryExpression();

                    if (!this.checkConstantExpression(value)) {
                        throw new TwingErrorSyntax(`A default value for an argument must be a constant (a boolean, a string, a number, or an array).`, token.getLine(), stream.getSourceContext());
                    }
                } else {
                    value = this.parseExpression();
                }
            }

            if (definition) {
                if (name === null) {
                    name = value.getAttribute('name');
                    value = new TwingNodeExpressionConstant(null, this.parser.getCurrentToken().getLine(), this.parser.getCurrentToken().getColumn());
                }

                parsedArguments.set(name, value);
            } else {
                if (null === name) {
                    push(parsedArguments, value);
                } else {
                    parsedArguments.set(name, value);
                }
            }
        }

        stream.expect(TwingTokenType.PUNCTUATION, ')', 'A list of arguments must be closed by a parenthesis');

        return new TwingNode(parsedArguments);
    }

    parseAssignmentExpression() {
        let stream = this.parser.getStream();
        let targets = new Map();

        while (true) {
            let token = stream.expect(TwingTokenType.NAME, null, 'Only variables can be assigned to');
            let value = token.getContent();

            if (['true', 'false', 'none', 'null'].indexOf(value.toLowerCase()) > -1) {
                throw new TwingErrorSyntax(`You cannot assign a value to "${value}".`, token.getLine(), stream.getSourceContext());
            }

            push(targets, new TwingNodeExpressionAssignName(value, token.getLine(), token.getColumn()));

            if (!stream.nextIf(TwingTokenType.PUNCTUATION, ',')) {
                break;
            }
        }

        return new TwingNode(targets);
    }

    parseMultitargetExpression() {
        let targets = new Map();

        while (true) {
            push(targets, this.parseExpression());

            if (!this.parser.getStream().nextIf(TwingTokenType.PUNCTUATION, ',')) {
                break;
            }
        }

        return new TwingNode(targets);
    }

    // checks that the node only contains "constant" elements
    checkConstantExpression(node: TwingNode) {
        let self = this;

        if (!(node.getType() === TwingNodeType.EXPRESSION_CONSTANT || node.getType() === TwingNodeType.EXPRESSION_ARRAY || node.getType() === TwingNodeType.EXPRESSION_UNARY_NEG || node.getType() === TwingNodeType.EXPRESSION_UNARY_POS)) {
            return false;
        }

        for (let [k, n] of node.getNodes()) {
            if (!self.checkConstantExpression(n)) {
                return false;
            }
        }

        return true;
    }

    private isUnary(token: TwingToken) {
        return token.test(TwingTokenType.OPERATOR) && this.unaryOperators.has(token.getContent());
    }

    private isBinary(token: TwingToken) {
        return token.test(TwingTokenType.OPERATOR) && this.binaryOperators.has(token.getContent());
    }

    private getTest(line: number): Array<any> {
        let stream = this.parser.getStream();
        let name = stream.expect(TwingTokenType.NAME).getContent();

        let test = this.env.getTest(name);

        if (test) {
            return [name, test];
        }

        if (stream.test(TwingTokenType.NAME)) {
            // try 2-words tests
            name = name + ' ' + this.parser.getCurrentToken().getContent();

            let test = this.env.getTest(name);

            if (test) {
                stream.next();

                return [name, test];
            }
        }

        let e = new TwingErrorSyntax(`Unknown "${name}" test.`, line, stream.getSourceContext());

        e.addSuggestions(name, [...this.env.getTests().keys()]);

        throw e;
    }

    private getFunctionExpressionFactory(name: string, line: number, column: number) {
        let function_ = this.env.getFunction(name);

        if (!function_) {
            let e = new TwingErrorSyntax(`Unknown "${name}" function.`, line, this.parser.getStream().getSourceContext());

            e.addSuggestions(name, Array.from(this.env.getFunctions().keys()));

            throw e;
        }

        if (function_.isDeprecated()) {
            let message = `Twing Function "${function_.getName()}" is deprecated`;

            if (typeof function_.getDeprecatedVersion() !== 'boolean') {
                message += ` since version ${function_.getDeprecatedVersion()}`;
            }

            if (function_.getAlternative()) {
                message += `. Use "${function_.getAlternative()}" instead`;
            }

            let src = this.parser.getStream().getSourceContext();

            message += ` in ${src.getPath() ? src.getPath() : src.getName()} at line ${line}.`;

            process.stdout.write(message);
        }

        return function_.getExpressionFactory();
    }

    private getFilterExpressionFactory(name: string, line: number, column: number) {
        let filter = this.env.getFilter(name);

        if (!filter) {
            let e = new TwingErrorSyntax(`Unknown "${name}" filter.`, line, this.parser.getStream().getSourceContext());

            e.addSuggestions(name, Array.from(this.env.getFilters().keys()));

            throw e;
        }

        if (filter.isDeprecated()) {
            let message = `Twing Filter "${filter.getName()}" is deprecated`;

            if (typeof filter.getDeprecatedVersion() !== 'boolean') {
                message += ` since version ${filter.getDeprecatedVersion()}`;
            }

            if (filter.getAlternative()) {
                message += `. Use "${filter.getAlternative()}" instead`;
            }

            let src = this.parser.getStream().getSourceContext();

            message += ` in ${src.getPath() ? src.getPath() : src.getName()} at line ${line}.`;

            process.stdout.write(message);
        }

        return filter.getExpressionFactory();
    }
}
