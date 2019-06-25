import {TwingEnvironment} from "./environment";
import {TwingTokenStream} from "./token-stream";
import {TwingNodeBlock} from "./node/block";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingNode, TwingNodeType} from "./node";
import {TwingToken, TwingTokenType} from "./token";
import {TwingNodeText} from "./node/text";
import {TwingNodePrint} from "./node/print";
import {TwingNodeExpression} from "./node/expression";
import {TwingNodeBody} from "./node/body";
import {TwingNodeModule} from "./node/module";
import {TwingNodeTraverser} from "./node-traverser";
import {TwingNodeMacro} from "./node/macro";
import {TwingTokenParser} from "./token-parser";
import {TwingOperator, TwingOperatorAssociativity} from "./operator";
import {TwingNodeExpressionConstant} from "./node/expression/constant";
import {TwingNodeExpressionName} from "./node/expression/name";
import {TwingLexer} from "./lexer";
import {TwingNodeExpressionArray} from "./node/expression/array";
import {TwingTemplate} from "./template";
import {TwingNodeExpressionMethodCall} from "./node/expression/method-call";
import {TwingNodeExpressionGetAttr} from "./node/expression/get-attr";
import {TwingNodeExpressionBinaryConcat} from "./node/expression/binary/concat";
import {TwingNodeExpressionHash} from "./node/expression/hash";
import {TwingNodeExpressionParent} from "./node/expression/parent";
import {TwingNodeExpressionBlockReference} from "./node/expression/block-reference";
import {TwingNodeExpressionConditional} from "./node/expression/conditional";
import {TwingTest} from "./test";
import {TwingNodeExpressionUnaryNot} from "./node/expression/unary/not";
import {first} from "./helpers/first";
import {push} from "./helpers/push";
import {TwingNodeExpressionAssignName} from "./node/expression/assign-name";
import {ctypeSpace} from "./helpers/ctype_space";

const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

class TwingParserStackEntry {
    stream: TwingTokenStream;
    parent: TwingNode;
    blocks: Map<string, TwingNodeBlock>;
    blockStack: Array<string>;
    macros: Map<string, TwingNode>;
    importedSymbols: Array<Map<string, Map<string, { node: TwingNodeExpression, name: string }>>>;
    traits: Map<string, TwingNode>;
    embeddedTemplates: Array<TwingNodeModule>;

    constructor(stream: TwingTokenStream, parent: TwingNode = null, blocks: Map<string, TwingNodeBlock>, blockStack: Array<string>, macros: Map<string, TwingNode>, importedSymbols: Array<Map<string, Map<string, { name: string, node: TwingNodeExpression }>>>, traits: Map<string, TwingNode>, embeddedTemplates: Array<TwingNodeModule>) {
        this.stream = stream;
        this.parent = parent;
        this.blocks = blocks;
        this.blockStack = blockStack;
        this.macros = macros;
        this.importedSymbols = importedSymbols;
        this.traits = traits;
        this.embeddedTemplates = embeddedTemplates;
    }
}

export class TwingParser {
    private stack: Array<TwingParserStackEntry> = [];
    private stream: TwingTokenStream;
    private parent: TwingNode;
    private handlers: Map<string, TwingTokenParserInterface> = null;
    private visitors: Array<TwingNodeVisitorInterface>;
    private blocks: Map<string, TwingNodeBody>;
    private blockStack: Array<string>;
    private macros: Map<string, TwingNode>;
    private env: TwingEnvironment;
    private importedSymbols: Array<Map<string, Map<string, { name: string, node: TwingNodeExpression }>>>;
    private traits: Map<string, TwingNode>;
    private embeddedTemplates: Array<TwingNodeModule> = [];
    private varNameSalt: number = 0;
    private embeddedTemplateIndex: number = 1;
    private unaryOperators: Map<string, TwingOperator>;
    private binaryOperators: Map<string, TwingOperator>;

    constructor(env: TwingEnvironment) {
        this.env = env;
        this.unaryOperators = env.getUnaryOperators();
        this.binaryOperators = env.getBinaryOperators();
    }

    getVarName(prefix: string = '__internal_'): string {
        return `${prefix}${hex.stringify(sha256('TwingParser::getVarName' + this.stream.getSourceContext().getCode() + this.varNameSalt++))}`;
    }

    parse(stream: TwingTokenStream, test: Array<any> = null, dropNeedle: boolean = false): TwingNodeModule {
        this.stack.push(new TwingParserStackEntry(
            this.stream,
            this.parent,
            this.blocks,
            this.blockStack,
            this.macros,
            this.importedSymbols,
            this.traits,
            this.embeddedTemplates
        ));

        // tag handlers
        if (this.handlers === null) {
            this.handlers = new Map();

            for (let handler of this.env.getTokenParsers()) {
                handler.setParser(this);

                this.handlers.set(handler.getTag(), handler);
            }
        }

        // node visitors
        if (!this.visitors) {
            this.visitors = this.env.getNodeVisitors();
        }

        this.stream = stream;
        this.parent = null;
        this.blocks = new Map();
        this.macros = new Map();
        this.traits = new Map();
        this.blockStack = [];
        this.importedSymbols = [new Map()];
        this.embeddedTemplates = [];
        this.varNameSalt = 0;

        let body: TwingNode;

        try {
            body = this.subparse(test, dropNeedle);

            if (this.parent !== null && (body = this.filterBodyNodes(body)) === null) {
                body = new TwingNode();
            }
        } catch (e) {
            if (e instanceof TwingErrorSyntax) {
                if (!e.getSourceContext()) {
                    e.setSourceContext(this.stream.getSourceContext());
                }
            }

            throw e;
        }

        let nodes = new Map();

        nodes.set(0, body);

        let node = new TwingNodeModule(new TwingNodeBody(nodes), this.parent, new TwingNode(this.blocks), new TwingNode(this.macros), new TwingNode(this.traits), this.embeddedTemplates, stream.getSourceContext());

        let traverser = new TwingNodeTraverser(this.env, this.visitors);

        node = traverser.traverse(node) as TwingNodeModule;

        // restore previous stack so previous parse() call can resume working
        let stack = this.stack.pop();

        this.stream = stack.stream;
        this.parent = stack.parent;
        this.blocks = stack.blocks;
        this.blockStack = stack.blockStack;
        this.macros = stack.macros;
        this.importedSymbols = stack.importedSymbols;
        this.traits = stack.traits;
        this.embeddedTemplates = stack.embeddedTemplates;

        return node;
    }

    getParent(): TwingNode {
        return this.parent;
    }

    setParent(parent: TwingNode) {
        this.parent = parent;
    }

    subparse(test: Array<any>, dropNeedle: boolean = false): TwingNode {
        let lineno = this.getCurrentToken().getLine();
        let rv = new Map();
        let i: number = 0;
        let token;

        while (!this.stream.isEOF()) {
            switch (this.getCurrentToken().getType()) {
                case TwingTokenType.TEXT:
                    token = this.stream.next();
                    rv.set(i++, new TwingNodeText(token.getContent(), token.getLine(), token.getColumn()));

                    break;
                case TwingTokenType.VAR_START:
                    token = this.stream.next();
                    let expression = this.parseExpression();


                    this.stream.expect(TwingTokenType.VAR_END);
                    rv.set(i++, new TwingNodePrint(expression, token.getLine(), token.getColumn()));

                    break;
                case TwingTokenType.BLOCK_START:
                    this.stream.next();
                    token = this.getCurrentToken();

                    if (token.getType() !== TwingTokenType.NAME) {
                        console.warn(token);

                        throw new TwingErrorSyntax('A block must start with a tag name.', token.getLine(), this.stream.getSourceContext());
                    }

                    if (test !== null && test[1](token)) {
                        if (dropNeedle) {
                            this.stream.next();
                        }

                        if (rv.size === 1) {
                            return first(rv);
                        }

                        return new TwingNode(rv, new Map(), lineno);
                    }

                    if (!this.handlers.has(token.getContent())) {
                        let e;

                        if (test !== null) {
                            e = new TwingErrorSyntax(
                                `Unexpected "${token.getContent()}" tag`,
                                token.getLine(),
                                this.stream.getSourceContext()
                            );

                            if (Array.isArray(test) && (test.length > 1) && (test[0] instanceof TwingTokenParser)) {
                                e.appendMessage(` (expecting closing tag for the "${test[0].getTag()}" tag defined near line ${lineno}).`);
                            }
                        } else {
                            e = new TwingErrorSyntax(
                                `Unknown "${token.getContent()}" tag.`,
                                token.getLine(),
                                this.stream.getSourceContext()
                            );

                            e.addSuggestions(token.getContent(), Array.from(this.env.getTags().keys()));
                        }

                        throw e;
                    }

                    this.stream.next();

                    let subparser = this.handlers.get(token.getContent());

                    let node = subparser.parse(token);

                    if (node !== null) {
                        rv.set(i++, node);
                    }

                    break;
                case TwingTokenType.COMMENT_START:
                    this.stream.next();
                    token = this.stream.expect(TwingTokenType.TEXT);
                    this.stream.expect(TwingTokenType.COMMENT_END);

                    break;
                default:
                    throw new TwingErrorSyntax(
                        'Lexer or parser ended up in unsupported state.',
                        this.getCurrentToken().getLine(),
                        this.stream.getSourceContext()
                    );
            }
        }

        if (rv.size === 1) {
            return first(rv);
        }

        return new TwingNode(rv, new Map(), lineno);
    }

    getBlockStack() {
        return this.blockStack;
    }

    peekBlockStack() {
        return this.blockStack[this.blockStack.length - 1];
    }

    popBlockStack() {
        this.blockStack.pop();
    }

    pushBlockStack(name: string) {
        this.blockStack.push(name);
    }

    hasBlock(name: string) {
        return this.blocks.has(name);
    }

    getBlock(name: string) {
        return this.blocks.get(name);
    }

    setBlock(name: string, value: TwingNodeBlock) {
        let bodyNodes = new Map();

        bodyNodes.set(0, value);

        this.blocks.set(name, new TwingNodeBody(bodyNodes, new Map(), value.getTemplateLine()));
    }

    addTrait(trait: TwingNode) {
        push(this.traits, trait);
    }

    hasTraits() {
        return this.traits.size > 0;
    }

    embedTemplate(template: TwingNodeModule) {
        template.setIndex(this.embeddedTemplateIndex++);

        this.embeddedTemplates.push(template);
    }

    /**
     * @return {TwingToken}
     */
    getCurrentToken(): TwingToken {
        return this.stream.getCurrent();
    }

    /**
     *
     * @return {TwingTokenStream}
     */
    getStream(): TwingTokenStream {
        return this.stream;
    }

    addImportedSymbol(type: string, alias: string, name: string = null, node: TwingNodeExpression = null) {
        let localScope = this.importedSymbols[0];

        if (!localScope.has(type)) {
            localScope.set(type, new Map());
        }

        let localScopeType = localScope.get(type);

        localScopeType.set(alias, {name: name, node: node});
    }

    getImportedSymbol(type: string, alias: string): { node: TwingNodeExpression, name: string } {
        let result = null;

        this.importedSymbols.forEach(function (importedSymbol) {
            if (importedSymbol.has(type)) {
                let importedSymbolType = importedSymbol.get(type);

                if (importedSymbolType.has(alias)) {
                    result = importedSymbolType.get(alias);
                }
            }
        });

        return result;
    }

    hasMacro(name: string) {
        return this.macros.has(name);
    }

    setMacro(name: string, node: TwingNodeMacro) {
        this.macros.set(name, node);
    }

    isMainScope() {
        return this.importedSymbols.length === 1;
    }

    pushLocalScope() {
        this.importedSymbols.unshift(new Map());
    }

    popLocalScope() {
        this.importedSymbols.shift();
    }

    /**
     *
     * @param node
     * @param nested {boolean}
     * @returns {TwingNode}
     */
    filterBodyNodes(node: TwingNode, nested: boolean = false): TwingNode {
        // check that the body does not contain non-empty output nodes
        if ((node.getType() === TwingNodeType.TEXT && !ctypeSpace(node.getAttribute('data'))) ||
            ((node.getType() !== TwingNodeType.TEXT) && (node.getType() !== TwingNodeType.BLOCK_REFERENCE) && ((node as any).TwingNodeOutputInterfaceImpl) && (node.getType() !== TwingNodeType.SPACELESS))) {
            let nodeData: string = node.getAttribute('data') as string;

            if (nodeData.indexOf(String.fromCharCode(0xEF, 0xBB, 0xBF)) > -1) {
                let trailingData = nodeData.substring(3);

                if (trailingData === '' || ctypeSpace(trailingData)) {
                    // bypass empty nodes starting with a BOM
                    return null;
                }
            }

            throw new TwingErrorSyntax(
                `A template that extends another one cannot include content outside Twig blocks. Did you forget to put the content inside a {% block %} tag?`,
                node.getTemplateLine(),
                this.stream.getSourceContext());
        }

        // bypass nodes that "capture" the output
        if ((node as any).TwingNodeCaptureInterfaceImpl) {
            // a "block" tag in such a node will serve as a block definition AND be displayed in place as well
            return node;
        }

        // to be removed completely in Twig 3.0
        if (!nested && (node.getType() === TwingNodeType.SPACELESS)) {
            console.error(`Using the spaceless tag at the root level of a child template in "${this.stream.getSourceContext().getName()}" at line ${node.getTemplateLine()} is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.`);
        }

        // "block" tags that are not captured (see above) are only used for defining
        // the content of the block. In such a case, nesting it does not work as
        // expected as the definition is not part of the default template code flow.
        if (nested && (node.getType() === TwingNodeType.BLOCK_REFERENCE)) {
            console.error(`Nesting a block definition under a non-capturing node in "${this.stream.getSourceContext().getName()}" at line ${node.getTemplateLine()} is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.`);

            return null;
        }

        if ((node as any).TwingNodeOutputInterfaceImpl && (node.getType() !== TwingNodeType.SPACELESS)) {
            return null;
        }

        // here, nested means "being at the root level of a child template"
        // we need to discard the wrapping "TwingNode" for the "body" node
        nested = nested || (node.getType() !== null);

        for (let [k, n] of node.getNodes()) {
            if (n !== null && (this.filterBodyNodes(n, nested) === null)) {
                node.removeNode(k);
            }
        }

        return node;
    }

    private isUnary(token: TwingToken) {
        return token.test(TwingTokenType.OPERATOR) && this.unaryOperators.has(token.getContent());
    }

    private isBinary(token: TwingToken) {
        return token.test(TwingTokenType.OPERATOR) && this.binaryOperators.has(token.getContent());
    }

    // expressions
    public parseExpression(precedence: number = 0): TwingNodeExpression {
        let expr = this.getPrimary();
        let token = this.getCurrentToken();

        while (this.isBinary(token) && this.binaryOperators.get(token.getContent()).getPrecedence() >= precedence) {
            let operator = this.binaryOperators.get(token.getContent());

            this.getStream().next();

            if (token.getContent() === 'is not') {
                expr = this.parseNotTestExpression(expr);
            } else if (token.getContent() === 'is') {
                expr = this.parseTestExpression(expr);
            } else {
                let expr1 = this.parseExpression(operator.getAssociativity() === TwingOperatorAssociativity.LEFT ? operator.getPrecedence() + 1 : operator.getPrecedence());
                let expressionFactory = operator.getExpressionFactory();

                expr = expressionFactory([expr, expr1], token.getLine(), token.getColumn());
            }

            token = this.getCurrentToken();
        }

        if (precedence === 0) {
            return this.parseConditionalExpression(expr);
        }

        return expr;
    }

    public parsePrimaryExpression() {
        let token: TwingToken = this.getCurrentToken();
        let node: TwingNodeExpression;

        switch (token.getType()) {
            case TwingTokenType.WHITESPACE:
                this.getStream().next();
                break;
            case TwingTokenType.NAME:
                this.getStream().next();

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
                        if ('(' === this.getCurrentToken().getContent()) {
                            node = this.parseFunctionExpression(token.getContent(), token.getLine(), token.getColumn());
                        } else {
                            node = new TwingNodeExpressionName(token.getContent(), token.getLine(), token.getColumn());
                        }
                }
                break;

            case TwingTokenType.NUMBER:
                this.getStream().next();
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
                    this.getStream().next();
                    node = new TwingNodeExpressionName(token.getContent(), token.getLine(), token.getColumn());

                    break;
                } else if (this.unaryOperators.has(token.getContent())) {
                    let operator = this.unaryOperators.get(token.getContent());
                    //
                    // ref = new ReflectionClass(class);
                    // negClass = 'Twig_Node_Expression_Unary_Neg';
                    // posClass = 'Twig_Node_Expression_Unary_Pos';
                    //
                    // if (!(in_array(ref.getTemplateName(), array(negClass, posClass)) || ref.isSubclassOf(negClass) || ref.isSubclassOf(posClass))) {
                    //     throw new Twig_Error_Syntax(sprintf('Unexpected unary operator "%s".', token.getContent()), token.getLine(), this.parser.getStream().getSource());
                    // }
                    //
                    this.getStream().next();

                    let expr = this.parsePrimaryExpression();

                    node = operator.getExpressionFactory()([expr, null], token.getLine(), token.getColumn());

                    break;
                }
            default:
                if (token.test(TwingTokenType.PUNCTUATION, '[')) {
                    node = this.parseArrayExpression();
                } else if (token.test(TwingTokenType.PUNCTUATION, '{')) {
                    node = this.parseHashExpression();
                } else if (token.test(TwingTokenType.OPERATOR, '=') && (this.getStream().look(-1).getContent() === '==' || this.getStream().look(-1).getContent() === '!=')) {
                    throw new TwingErrorSyntax(`Unexpected operator of value "${token.getContent()}". Did you try to use "===" or "!==" for strict comparison? Use "is same as(value)" instead.`, token.getLine(), this.getStream().getSourceContext());
                } else {

                    throw new TwingErrorSyntax(`Unexpected token "${TwingToken.typeToEnglish(token.getType())}" of value "${token.getContent()}".`, token.getLine(), this.getStream().getSourceContext());
                }
        }

        return this.parsePostfixExpression(node);
    }

    public parsePostfixExpression(node: TwingNodeExpression): TwingNodeExpression {
        while (true) {
            let token = this.getCurrentToken();

            if (token.getType() === TwingTokenType.PUNCTUATION) {
                if ('.' == token.getContent() || '[' == token.getContent()) {
                    node = this.parseSubscriptExpression(node);
                } else if ('|' == token.getContent()) {
                    this.getStream().next();

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

    public parseSubscriptExpression(node: TwingNodeExpression) {
        let stream = this.getStream();
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

            if ((node.getType() === TwingNodeType.EXPRESSION_NAME) && this.getImportedSymbol('template', node.getAttribute('name'))) {
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

                let factory = this.getFilterExpressionFactory('slice', token.getLine());
                let filterArguments = new TwingNode(new Map([[0, arg], [1, length]]));
                let filter = factory.call(this, node, new TwingNodeExpressionConstant('slice', token.getLine(), token.getColumn()), filterArguments, token.getLine(), token.getColumn());

                stream.expect(TwingTokenType.PUNCTUATION, ']');

                return filter;
            }

            stream.expect(TwingTokenType.PUNCTUATION, ']');
        }

        return new TwingNodeExpressionGetAttr(node, arg, arguments_, type, lineno, columnno);
    }

    public parseConditionalExpression(expr: TwingNodeExpression): TwingNodeExpression {
        let expr2: TwingNodeExpression;
        let expr3: TwingNodeExpression;

        while (this.getStream().nextIf(TwingTokenType.PUNCTUATION, '?')) {
            if (!this.getStream().nextIf(TwingTokenType.PUNCTUATION, ':')) {
                expr2 = this.parseExpression();

                if (this.getStream().nextIf(TwingTokenType.PUNCTUATION, ':')) {
                    expr3 = this.parseExpression();
                } else {
                    expr3 = new TwingNodeExpressionConstant('', this.getCurrentToken().getLine(), this.getCurrentToken().getColumn());
                }
            } else {
                expr2 = expr;
                expr3 = this.parseExpression();
            }

            expr = new TwingNodeExpressionConditional(expr, expr2, expr3, this.getCurrentToken().getLine(), this.getCurrentToken().getColumn());
        }

        return expr;
    }

    public parseTestExpression(node: TwingNodeExpression): TwingNodeExpression {
        let stream = this.getStream();
        let name: string;
        let test: TwingTest;

        [name, test] = this.getTest(node.getTemplateLine());

        let expressionFactory = test.getExpressionFactory();

        let testArguments = null;

        if (stream.test(TwingTokenType.PUNCTUATION, '(')) {
            testArguments = this.parseArguments(true);
        }

        return expressionFactory.call(this, node, name, testArguments, this.getCurrentToken().getLine());
    }

    public parseNotTestExpression(node: TwingNodeExpression): TwingNodeExpression {
        return new TwingNodeExpressionUnaryNot(this.parseTestExpression(node), this.getCurrentToken().getLine(), this.getCurrentToken().getColumn());
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
    public parseArguments(namedArguments: boolean = false, definition: boolean = false): TwingNode {
        let parsedArguments = new Map();
        let stream = this.getStream();
        let value: TwingNodeExpression;
        let token;

        stream.expect(TwingTokenType.PUNCTUATION, '(', 'A list of arguments must begin with an opening parenthesis');

        while (!stream.test(TwingTokenType.PUNCTUATION, ')')) {
            if (parsedArguments.size > 0) {
                stream.expect(TwingTokenType.PUNCTUATION, ',', 'Arguments must be separated by a comma');
            }

            if (definition) {
                token = stream.expect(TwingTokenType.NAME, null, 'An argument must be a name');

                value = new TwingNodeExpressionName(token.getContent(), this.getCurrentToken().getLine(), this.getCurrentToken().getColumn());
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
                    value = new TwingNodeExpressionConstant(null, this.getCurrentToken().getLine(), this.getCurrentToken().getColumn());
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

    public parseFilterExpression(node: TwingNodeExpression, tag: string = null): TwingNodeExpression {
        while (true) {
            let token = this.getStream().expect(TwingTokenType.NAME);

            let name = new TwingNodeExpressionConstant(token.getContent(), token.getLine(), token.getColumn());
            let methodArguments;

            if (!this.getStream().test(TwingTokenType.PUNCTUATION, '(')) {
                methodArguments = new TwingNode();
            } else {
                methodArguments = this.parseArguments(true);
            }

            let factory = this.getFilterExpressionFactory('' + name.getAttribute('value'), token.getLine());

            node = factory.call(this, node, name, methodArguments, token.getLine(), tag);

            if (!this.getStream().test(TwingTokenType.PUNCTUATION, '|')) {
                break;
            }

            this.getStream().next();
        }

        return node;
    }

    public parseFunctionExpression(name: string, line: number, column: number): TwingNodeExpression {
        switch (name) {
            case 'parent':
                this.parseArguments();

                if (!this.getBlockStack().length) {
                    throw new TwingErrorSyntax('Calling "parent" outside a block is forbidden.', line, this.getStream().getSourceContext());
                }

                if (!this.getParent() && !this.hasTraits()) {
                    throw new TwingErrorSyntax('Calling "parent" on a template that does not extend nor "use" another template is forbidden.', line, this.getStream().getSourceContext());
                }

                return new TwingNodeExpressionParent(this.peekBlockStack(), line, column);
            case 'block':
                let blockArgs = this.parseArguments();

                if (blockArgs.getNodes().size < 1) {
                    throw new TwingErrorSyntax('The "block" function takes one argument (the block name).', line, this.getStream().getSourceContext());
                }

                return new TwingNodeExpressionBlockReference(blockArgs.getNode(0), blockArgs.getNodes().size > 1 ? blockArgs.getNode(1) : null, line, column);
            case 'attribute':
                let attributeArgs = this.parseArguments();

                if (attributeArgs.getNodes().size < 2) {
                    throw new TwingErrorSyntax('The "attribute" function takes at least two arguments (the variable and the attributes).', line, this.getStream().getSourceContext());
                }

                return new TwingNodeExpressionGetAttr(<TwingNodeExpression>attributeArgs.getNode(0), <TwingNodeExpression>attributeArgs.getNode(1), attributeArgs.getNodes().size > 2 ? <TwingNodeExpression>attributeArgs.getNode(2) : null, TwingTemplate.ANY_CALL, line, column);
            default:
                let alias = this.getImportedSymbol('function', name);

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
                let aliasFactory = this.getFunctionExpressionFactory(name, line);

                return aliasFactory(name, aliasArguments, line, column);
        }
    }

    public parseStringExpression(): TwingNodeExpression {
        let stream = this.getStream();

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
            expr = new TwingNodeExpressionBinaryConcat([expr, node], expr.getTemplateLine(), expr.getTemplateColumn());
        });

        return expr;
    }

    public parseArrayExpression(): TwingNodeExpression {
        let stream = this.getStream();

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

    public parseHashExpression(): TwingNodeExpression {
        let stream = this.getStream();

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

    public parseAssignmentExpression() {
        let stream = this.getStream();
        let targets = new Map();

        while (true) {
            let token = this.getCurrentToken();

            if (stream.test(TwingTokenType.OPERATOR) && TwingLexer.REGEX_NAME.exec(token.getContent())) {
                // in this context, string operators are variable names
                this.getStream().next();
            } else {
                stream.expect(TwingTokenType.NAME, null, 'Only variables can be assigned to');
            }

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

    public parseMultitargetExpression() {
        let targets = new Map();

        while (true) {
            push(targets, this.parseExpression());

            if (!this.getStream().nextIf(TwingTokenType.PUNCTUATION, ',')) {
                break;
            }
        }

        return new TwingNode(targets);
    }

    protected getFilterExpressionFactory(name: string, line: number) {
        let filter = this.env.getFilter(name);

        if (!filter) {
            let e = new TwingErrorSyntax(`Unknown "${name}" filter.`, line, this.getStream().getSourceContext());

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

            let src = this.getStream().getSourceContext();

            message += ` in ${src.getPath() ? src.getPath() : src.getName()} at line ${line}.`;

            process.stdout.write(message);
        }

        return filter.getExpressionFactory();
    }

    protected getFunctionExpressionFactory(name: string, line: number) {
        let function_ = this.env.getFunction(name);

        if (!function_) {
            let e = new TwingErrorSyntax(`Unknown "${name}" function.`, line, this.getStream().getSourceContext());

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

            let src = this.getStream().getSourceContext();

            message += ` in ${src.getPath() ? src.getPath() : src.getName()} at line ${line}.`;

            process.stdout.write(message);
        }

        return function_.getExpressionFactory();
    }

    protected getPrimary(): TwingNodeExpression {
        let token = this.getCurrentToken();

        if (this.isUnary(token)) {
            let operator = this.unaryOperators.get(token.getContent());
            this.getStream().next();
            let expr = this.parseExpression(operator.getPrecedence());

            return this.parsePostfixExpression(operator.getExpressionFactory()([expr, null], token.getLine(), token.getColumn()));
        } else if (token.test(TwingTokenType.PUNCTUATION, '(')) {
            this.getStream().next();
            let expr = this.parseExpression();
            this.getStream().expect(TwingTokenType.PUNCTUATION, ')', 'An opened parenthesis is not properly closed');

            return this.parsePostfixExpression(expr);
        }

        return this.parsePrimaryExpression();
    }

    protected getTest(line: number): Array<any> {
        let stream = this.getStream();
        let name = stream.expect(TwingTokenType.NAME).getContent();

        let test = this.env.getTest(name);

        if (test) {
            return [name, test];
        }

        if (stream.test(TwingTokenType.NAME)) {
            // try 2-words tests
            name = name + ' ' + this.getCurrentToken().getContent();

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

    /**
     * Check that the node only contains "constant" elements
     *
     * @return boolean
     */
    protected checkConstantExpression(node: TwingNode): boolean {
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
}
