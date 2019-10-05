import {TwingEnvironment} from "./environment";
import {TwingTokenStream} from "./token-stream";
import {TwingNodeBlock} from "./node/block";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingNode, TwingNodeType} from "./node";
import {TwingNodeText} from "./node/text";
import {TwingNodePrint} from "./node/print";
import {TwingNodeExpression} from "./node/expression";
import {TwingNodeBody} from "./node/body";
import {TwingNodeModule} from "./node/module";
import {TwingNodeTraverser} from "./node-traverser";
import {TwingNodeMacro} from "./node/macro";
import {TwingTokenParser} from "./token-parser";
import {first} from "./helpers/first";
import {push} from "./helpers/push";
import {TwingNodeComment} from "./node/comment";
import {ctypeSpace} from "./helpers/ctype-space";
import {TwingNodeExpressionConstant} from "./node/expression/constant";
import {TwingNodeExpressionBinaryConcat} from "./node/expression/binary/concat";
import {TwingNodeExpressionAssignName} from "./node/expression/assign-name";
import {TwingNodeExpressionArrowFunction} from "./node/expression/arrow-function";
import {TwingNodeExpressionName} from "./node/expression/name";
import {TwingNodeExpressionParent} from "./node/expression/parent";
import {TwingNodeExpressionBlockReference} from "./node/expression/block-reference";
import {TwingNodeExpressionGetAttr} from "./node/expression/get-attr";
import {TwingTemplate} from "./template";
import {TwingNodeExpressionArray} from "./node/expression/array";
import {TwingNodeExpressionMethodCall} from "./node/expression/method-call";
import {TwingNodeExpressionHash} from "./node/expression/hash";
import {TwingTest} from "./test";
import {TwingNodeExpressionUnaryNot} from "./node/expression/unary/not";
import {TwingNodeExpressionConditional} from "./node/expression/conditional";
import {TwingOperator, TwingOperatorAssociativity} from "./operator";
import {namePattern, Token, TokenType} from "twig-lexer";
import {typeToEnglish} from "./lexer";

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

const nameRegExp = new RegExp(namePattern);

type TwingParserImportedSymbolAlias = {
    name: string,
    node: TwingNodeExpression
};
type TwingParserImportedSymbolType = Map<string, TwingParserImportedSymbolAlias>;
type TwingParserImportedSymbol = Map<string, TwingParserImportedSymbolType>;

export class TwingParser {
    private stack: Array<TwingParserStackEntry> = [];
    private stream: TwingTokenStream;
    private parent: TwingNode;
    private handlers: Map<string, TwingTokenParserInterface> = null;
    private visitors: Array<TwingNodeVisitorInterface>;
    private blocks: Map<string, TwingNodeBody>;
    private blockStack: Array<string>;
    private macros: Map<string, TwingNode>;
    private readonly env: TwingEnvironment;
    private importedSymbols: Array<TwingParserImportedSymbol>;
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
        let key: string;
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
        let lineno = this.getCurrentToken().line;
        let rv = new Map();
        let i: number = 0;
        let token;

        while (!this.stream.isEOF()) {
            switch (this.getCurrentToken().type) {
                case TokenType.TEXT:
                    token = this.stream.next();
                    rv.set(i++, new TwingNodeText(token.value, token.line, token.column, null));

                    break;
                case TokenType.VARIABLE_START:
                    token = this.stream.next();
                    let expression = this.parseExpression();

                    this.stream.expect(TokenType.VARIABLE_END);
                    rv.set(i++, new TwingNodePrint(expression, token.line, token.column));

                    break;
                case TokenType.TAG_START:
                    this.stream.next();
                    token = this.getCurrentToken();

                    if (token.type !== TokenType.NAME) {
                        throw new TwingErrorSyntax('A block must start with a tag name.', token.line, this.stream.getSourceContext());
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

                    if (!this.handlers.has(token.value)) {
                        let e;

                        if (test !== null) {
                            e = new TwingErrorSyntax(
                                `Unexpected "${token.value}" tag`,
                                token.line,
                                this.stream.getSourceContext()
                            );

                            if (Array.isArray(test) && (test.length > 1) && (test[0] instanceof TwingTokenParser)) {
                                e.appendMessage(` (expecting closing tag for the "${test[0].getTag()}" tag defined near line ${lineno}).`);
                            }
                        } else {
                            e = new TwingErrorSyntax(
                                `Unknown "${token.value}" tag.`,
                                token.line,
                                this.stream.getSourceContext()
                            );

                            e.addSuggestions(token.value, Array.from(this.env.getTags().keys()));
                        }

                        throw e;
                    }

                    this.stream.next();

                    let subparser = this.handlers.get(token.value);

                    let node = subparser.parse(token);

                    if (node !== null) {
                        rv.set(i++, node);
                    }

                    break;
                case TokenType.COMMENT_START:
                    this.stream.next();
                    token = this.stream.expect(TokenType.TEXT);
                    this.stream.expect(TokenType.COMMENT_END);
                    rv.set(i++, new TwingNodeComment(token.value, token.line, token.column));

                    break;
                default:
                    throw new TwingErrorSyntax(
                        'Lexer or parser ended up in unsupported state.',
                        this.getCurrentToken().line,
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
     * @return {Token}
     */
    getCurrentToken(): Token {
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

    getImportedSymbol(type: string, alias: string): TwingParserImportedSymbolAlias {
        let result: TwingParserImportedSymbolAlias = null;

        let testImportedSymbol = (importedSymbol: TwingParserImportedSymbol) => {
            if (importedSymbol.has(type)) {
                let importedSymbolType = importedSymbol.get(type);

                if (importedSymbolType.has(alias)) {
                    return importedSymbolType.get(alias);
                }
            }

            return null;
        };

        let length = this.importedSymbols.length;

        if (length > 0) {
            result = testImportedSymbol(this.importedSymbols[0]);

            // if the symbol does not exist in the current scope (0), try in the main/global scope (last index)
            if (!result && (length > 1)) {
                result = testImportedSymbol(this.importedSymbols[length - 1]);
            }
        }

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
            console.warn(`Using the spaceless tag at the root level of a child template in "${this.stream.getSourceContext().getName()}" at line ${node.getTemplateLine()} is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.`);
        }

        // "block" tags that are not captured (see above) are only used for defining
        // the content of the block. In such a case, nesting it does not work as
        // expected as the definition is not part of the default template code flow.
        if (nested && (node.getType() === TwingNodeType.BLOCK_REFERENCE)) {
            console.warn(`Nesting a block definition under a non-capturing node in "${this.stream.getSourceContext().getName()}" at line ${node.getTemplateLine()} is deprecated since Twig 2.5.0 and will become a syntax error in Twig 3.0.`);

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

    parseStringExpression(): TwingNodeExpression {
        let stream = this.getStream();

        let nodes = [];
        // a string cannot be followed by another string in a single expression
        let nextCanBeString = true;
        let token;

        while (true) {
            if (nextCanBeString && (token = stream.nextIf(TokenType.STRING))) {
                nodes.push(new TwingNodeExpressionConstant(token.value, token.line, token.column));
                nextCanBeString = false;
            } else if (stream.nextIf(TokenType.INTERPOLATION_START)) {
                nodes.push(this.parseExpression());
                stream.expect(TokenType.INTERPOLATION_END);
                nextCanBeString = true;
            } else {
                break;
            }
        }

        let expr = nodes.shift();

        for (let node of nodes) {
            expr = new TwingNodeExpressionBinaryConcat([expr, node], node.getTemplateLine(), node.getTemplateColumn());
        }

        return expr;
    }

    // expressions
    parseExpression(precedence: number = 0, allowArrow: boolean = false): TwingNodeExpression {
        if (allowArrow) {
            let arrow = this.parseArrow();

            if (arrow) {
                return arrow;
            }
        }

        let expr = this.getPrimary();
        let token = this.getCurrentToken();

        while (this.isBinary(token) && this.binaryOperators.get(token.value).getPrecedence() >= precedence) {
            let operator = this.binaryOperators.get(token.value);

            this.getStream().next();

            if (token.value === 'is not') {
                expr = this.parseNotTestExpression(expr);
            } else if (token.value === 'is') {
                expr = this.parseTestExpression(expr);
            } else {
                let expr1 = this.parseExpression(operator.getAssociativity() === TwingOperatorAssociativity.LEFT ? operator.getPrecedence() + 1 : operator.getPrecedence());
                let expressionFactory = operator.getExpressionFactory();

                expr = expressionFactory([expr, expr1], token.line, token.column);
            }

            token = this.getCurrentToken();
        }

        if (precedence === 0) {
            return this.parseConditionalExpression(expr);
        }

        return expr;
    }

    /**
     * @return TwingNodeExpressionArrowFunction|null
     */
    protected parseArrow() {
        let stream = this.getStream();
        let token: Token;
        let line: number;
        let column: number;
        let names: Map<number, TwingNodeExpressionAssignName>;

        // short array syntax (one argument, no parentheses)?
        if (stream.look(1).test(TokenType.ARROW)) {
            line = stream.getCurrent().line;
            column = stream.getCurrent().column;
            token = stream.expect(TokenType.NAME);
            names = new Map([[0, new TwingNodeExpressionAssignName(token.value, token.line, token.column)]]);

            stream.expect(TokenType.ARROW);

            return new TwingNodeExpressionArrowFunction(this.parseExpression(0), new TwingNode(names), line, column);
        }

        // first, determine if we are parsing an arrow function by finding => (long form)
        let i: number = 0;

        if (!stream.look(i).test(TokenType.PUNCTUATION, '(')) {
            return null;
        }

        ++i;

        while (true) {
            // variable name
            ++i;

            if (!stream.look(i).test(TokenType.PUNCTUATION, ',')) {
                break;
            }

            ++i;
        }

        if (!stream.look(i).test(TokenType.PUNCTUATION, ')')) {
            return null;
        }

        ++i;

        if (!stream.look(i).test(TokenType.ARROW)) {
            return null;
        }

        // yes, let's parse it properly
        token = stream.expect(TokenType.PUNCTUATION, '(');
        line = token.line;
        column = token.column;
        names = new Map();
        i = 0;

        while (true) {
            token = this.getCurrentToken();

            if (!token.test(TokenType.NAME)) {
                throw new TwingErrorSyntax(`Unexpected token "${typeToEnglish(token.type)}" of value "${token.value}".`, token.line, stream.getSourceContext());
            }

            names.set(i++, new TwingNodeExpressionAssignName(token.value, token.line, token.column));

            stream.next();

            if (!stream.nextIf(TokenType.PUNCTUATION, ',')) {
                break;
            }
        }

        stream.expect(TokenType.PUNCTUATION, ')');
        stream.expect(TokenType.ARROW);

        return new TwingNodeExpressionArrowFunction(this.parseExpression(0), new TwingNode(names), line, column);
    }

    getPrimary(): TwingNodeExpression {
        let token = this.getCurrentToken();

        if (this.isUnary(token)) {
            let operator = this.unaryOperators.get(token.value);
            this.getStream().next();
            let expr = this.parseExpression(operator.getPrecedence());

            return this.parsePostfixExpression(operator.getExpressionFactory()([expr, null], token.line, token.column));
        } else if (token.test(TokenType.PUNCTUATION, '(')) {
            this.getStream().next();
            let expr = this.parseExpression();
            this.getStream().expect(TokenType.PUNCTUATION, ')', 'An opened parenthesis is not properly closed');

            return this.parsePostfixExpression(expr);
        }

        return this.parsePrimaryExpression();
    }

    parsePrimaryExpression() {
        let token: Token = this.getCurrentToken();
        let node: TwingNodeExpression;

        switch (token.type) {
            case TokenType.NAME:
                this.getStream().next();

                switch (token.value) {
                    case 'true':
                    case 'TRUE':
                        node = new TwingNodeExpressionConstant(true, token.line, token.column);
                        break;

                    case 'false':
                    case 'FALSE':
                        node = new TwingNodeExpressionConstant(false, token.line, token.column);
                        break;

                    case 'none':
                    case 'NONE':
                    case 'null':
                    case 'NULL':
                        node = new TwingNodeExpressionConstant(null, token.line, token.column);
                        break;

                    default:
                        if ('(' === this.getCurrentToken().value) {
                            node = this.getFunctionNode(token.value, token.line, token.column);
                        } else {
                            node = new TwingNodeExpressionName(token.value, token.line, token.column);
                        }
                }
                break;

            case TokenType.NUMBER:
                this.getStream().next();
                node = new TwingNodeExpressionConstant(token.value, token.line, token.column);
                break;

            case TokenType.STRING:
            case TokenType.INTERPOLATION_START:
                node = this.parseStringExpression();
                break;

            case TokenType.OPERATOR:
                let match = nameRegExp.exec(token.value);

                if (match !== null && match[0] === token.value) {
                    // in this context, string operators are variable names
                    this.getStream().next();
                    node = new TwingNodeExpressionName(token.value, token.line, token.column);

                    break;
                } else if (this.unaryOperators.has(token.value)) {
                    let operator = this.unaryOperators.get(token.value);

                    this.getStream().next();

                    let expr = this.parsePrimaryExpression();

                    node = operator.getExpressionFactory()([expr, null], token.line, token.column);
                    break;
                }

            default:
                if (token.test(TokenType.PUNCTUATION, '[')) {
                    node = this.parseArrayExpression();
                } else if (token.test(TokenType.PUNCTUATION, '{')) {
                    node = this.parseHashExpression();
                } else if (token.test(TokenType.OPERATOR, '=') && (this.getStream().look(-1).value === '==' || this.getStream().look(-1).value === '!=')) {
                    throw new TwingErrorSyntax(`Unexpected operator of value "${token.value}". Did you try to use "===" or "!==" for strict comparison? Use "is same as(value)" instead.`, token.line, this.getStream().getSourceContext());
                } else {
                    throw new TwingErrorSyntax(`Unexpected token "${typeToEnglish(token.type)}" of value "${token.value}".`, token.line, this.getStream().getSourceContext());
                }
        }

        return this.parsePostfixExpression(node);
    }

    getFunctionNode(name: string, line: number, column: number): TwingNodeExpression {
        switch (name) {
            case 'parent':
                this.parseArguments();

                if (!this.getBlockStack().length) {
                    throw new TwingErrorSyntax('Calling "parent" outside a block is forbidden.', line, this.getStream().getSourceContext());
                }

                if (!this.getParent() && !this.hasTraits()) {
                    throw new TwingErrorSyntax('Calling "parent" on a template that does not extend nor "use" another template is forbidden.', line, this.getStream().getSourceContext());
                }

                return new TwingNodeExpressionParent(this.peekBlockStack(), line);
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
                let aliasFactory = this.getFunctionExpressionFactory(name, line, column);

                return aliasFactory(name, aliasArguments, line, column);
        }
    }

    parseArrayExpression(): TwingNodeExpression {
        let stream = this.getStream();

        stream.expect(TokenType.PUNCTUATION, '[', 'An array element was expected');

        let node = new TwingNodeExpressionArray(new Map(), stream.getCurrent().line, stream.getCurrent().column);
        let first = true;

        while (!stream.test(TokenType.PUNCTUATION, ']')) {
            if (!first) {
                stream.expect(TokenType.PUNCTUATION, ',', 'An array element must be followed by a comma');

                // trailing ,?
                if (stream.test(TokenType.PUNCTUATION, ']')) {
                    break;
                }
            }

            first = false;

            node.addElement(this.parseExpression());
        }

        stream.expect(TokenType.PUNCTUATION, ']', 'An opened array is not properly closed');

        return node;
    }

    parseHashExpression(): TwingNodeExpression {
        let stream = this.getStream();

        stream.expect(TokenType.PUNCTUATION, '{', 'A hash element was expected');

        let node = new TwingNodeExpressionHash(new Map(), stream.getCurrent().line, stream.getCurrent().column);
        let first = true;

        while (!stream.test(TokenType.PUNCTUATION, '}')) {
            if (!first) {
                stream.expect(TokenType.PUNCTUATION, ',', 'A hash value must be followed by a comma');

                // trailing ,?
                if (stream.test(TokenType.PUNCTUATION, '}')) {
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
            let token;
            let key;

            if ((token = stream.nextIf(TokenType.STRING)) || (token = stream.nextIf(TokenType.NAME)) || (token = stream.nextIf(TokenType.NUMBER))) {
                key = new TwingNodeExpressionConstant(token.value, token.line, token.column);
            } else if (stream.test(TokenType.PUNCTUATION, '(')) {
                key = this.parseExpression();
            } else {
                let current = stream.getCurrent();

                throw new TwingErrorSyntax(`A hash key must be a quoted string, a number, a name, or an expression enclosed in parentheses (unexpected token "${typeToEnglish(current.type)}" of value "${current.value}".`, current.line, stream.getSourceContext());
            }

            stream.expect(TokenType.PUNCTUATION, ':', 'A hash key must be followed by a colon (:)');

            let value = this.parseExpression();

            node.addElement(value, key);
        }

        stream.expect(TokenType.PUNCTUATION, '}', 'An opened hash is not properly closed');

        return node;
    }

    parseSubscriptExpression(node: TwingNodeExpression) {
        let stream = this.getStream();
        let token = stream.next();
        let lineno = token.line;
        let columnno = token.column;
        let arguments_ = new TwingNodeExpressionArray(new Map(), lineno, columnno);
        let arg: TwingNodeExpression;

        let type = TwingTemplate.ANY_CALL;

        if (token.value === '.') {
            token = stream.next();

            let match = nameRegExp.exec(token.value);

            if ((token.type === TokenType.NAME) || (token.type === TokenType.NUMBER) || (token.type === TokenType.OPERATOR && (match !== null))) {
                arg = new TwingNodeExpressionConstant(token.value, lineno, columnno);

                if (stream.test(TokenType.PUNCTUATION, '(')) {
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

                node = new TwingNodeExpressionMethodCall(node, 'macro_' + name, arguments_, lineno, columnno);
                node.setAttribute('safe', true);

                return node;
            }
        } else {
            type = TwingTemplate.ARRAY_CALL;

            // slice?
            let slice = false;

            if (stream.test(TokenType.PUNCTUATION, ':')) {
                slice = true;
                arg = new TwingNodeExpressionConstant(0, token.line, token.column);
            } else {
                arg = this.parseExpression();
            }

            if (stream.nextIf(TokenType.PUNCTUATION, ':')) {
                slice = true;
            }

            if (slice) {
                let length: TwingNodeExpression;

                if (stream.test(TokenType.PUNCTUATION, ']')) {
                    length = new TwingNodeExpressionConstant(null, token.line, token.column);
                } else {
                    length = this.parseExpression();
                }

                let factory = this.getFilterExpressionFactory('slice', token.line, token.column);
                let filterArguments = new TwingNode(new Map([[0, arg], [1, length]]));
                let filter = factory.call(this, node, new TwingNodeExpressionConstant('slice', token.line, token.column), filterArguments, token.line, token.column);

                stream.expect(TokenType.PUNCTUATION, ']');

                return filter;
            }

            stream.expect(TokenType.PUNCTUATION, ']');
        }

        return new TwingNodeExpressionGetAttr(node, arg, arguments_, type, lineno, columnno);
    }

    parsePostfixExpression(node: TwingNodeExpression): TwingNodeExpression {
        while (true) {
            let token = this.getCurrentToken();

            if (token.type === TokenType.PUNCTUATION) {
                if ('.' == token.value || '[' == token.value) {
                    node = this.parseSubscriptExpression(node);
                } else if ('|' == token.value) {
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
        let stream = this.getStream();
        let name: string;
        let test: TwingTest;

        [name, test] = this.getTest(node.getTemplateLine());

        let expressionFactory = test.getExpressionFactory();

        let testArguments = null;

        if (stream.test(TokenType.PUNCTUATION, '(')) {
            testArguments = this.parseArguments(true);
        }

        if ((name === 'defined') && (node.getType() === TwingNodeType.EXPRESSION_NAME)) {
            let alias = this.getImportedSymbol('function', node.getAttribute('name'));

            if (alias !== null) {
                node = new TwingNodeExpressionMethodCall(alias.node, alias.name, new TwingNodeExpressionArray(new Map(), node.getTemplateLine(), node.getTemplateColumn()), node.getTemplateLine(), node.getTemplateColumn());
                node.setAttribute('safe', true);
            }
        }

        return expressionFactory.call(this, node, name, testArguments, this.getCurrentToken().line);
    }

    parseNotTestExpression(node: TwingNodeExpression): TwingNodeExpression {
        return new TwingNodeExpressionUnaryNot(this.parseTestExpression(node), this.getCurrentToken().line, this.getCurrentToken().column);
    }

    parseConditionalExpression(expr: TwingNodeExpression): TwingNodeExpression {
        let expr2;
        let expr3;

        while (this.getStream().nextIf(TokenType.PUNCTUATION, '?')) {
            if (!this.getStream().nextIf(TokenType.PUNCTUATION, ':')) {
                expr2 = this.parseExpression();

                if (this.getStream().nextIf(TokenType.PUNCTUATION, ':')) {
                    expr3 = this.parseExpression();
                } else {
                    expr3 = new TwingNodeExpressionConstant('', this.getCurrentToken().line, this.getCurrentToken().column);
                }
            } else {
                expr2 = expr;
                expr3 = this.parseExpression();
            }

            expr = new TwingNodeExpressionConditional(expr, expr2, expr3, this.getCurrentToken().line, this.getCurrentToken().column);
        }

        return expr;
    }

    parseFilterExpression(node: TwingNodeExpression): TwingNodeExpression {
        this.getStream().next();

        return this.parseFilterExpressionRaw(node);
    }

    parseFilterExpressionRaw(node: TwingNodeExpression, tag: string = null): TwingNodeExpression {
        while (true) {
            let token = this.getStream().expect(TokenType.NAME);

            let name = new TwingNodeExpressionConstant(token.value, token.line, token.column);
            let methodArguments;

            if (!this.getStream().test(TokenType.PUNCTUATION, '(')) {
                methodArguments = new TwingNode();
            } else {
                methodArguments = this.parseArguments(true, false, true);
            }

            let factory = this.getFilterExpressionFactory('' + name.getAttribute('value'), token.line, token.column);

            node = factory.call(this, node, name, methodArguments, token.line, tag);

            if (!this.getStream().test(TokenType.PUNCTUATION, '|')) {
                break;
            }

            this.getStream().next();
        }

        return node;
    }

    /**
     * Parses arguments.
     *
     * @param namedArguments {boolean} Whether to allow named arguments or not
     * @param definition {boolean} Whether we are parsing arguments for a function definition
     * @param allowArrow {boolean}
     *
     * @return TwingNode
     *
     * @throws TwingErrorSyntax
     */
    parseArguments(namedArguments: boolean = false, definition: boolean = false, allowArrow: boolean = false): TwingNode {
        let parsedArguments = new Map();
        let stream = this.getStream();
        let value: TwingNodeExpression;
        let token;

        stream.expect(TokenType.PUNCTUATION, '(', 'A list of arguments must begin with an opening parenthesis');

        while (!stream.test(TokenType.PUNCTUATION, ')')) {
            if (parsedArguments.size > 0) {
                stream.expect(TokenType.PUNCTUATION, ',', 'Arguments must be separated by a comma');
            }

            if (definition) {
                token = stream.expect(TokenType.NAME, null, 'An argument must be a name');

                value = new TwingNodeExpressionName(token.value, this.getCurrentToken().line, this.getCurrentToken().column);
            } else {
                value = this.parseExpression(0, allowArrow);
            }

            let name = null;

            if (namedArguments && (token = stream.nextIf(TokenType.OPERATOR, '='))) {
                if (value.getType() !== TwingNodeType.EXPRESSION_NAME) {
                    throw new TwingErrorSyntax(`A parameter name must be a string, "${value.constructor.name}" given.`, token.line, stream.getSourceContext());
                }
                name = value.getAttribute('name');

                if (definition) {
                    value = this.parsePrimaryExpression();

                    if (!this.checkConstantExpression(value)) {
                        throw new TwingErrorSyntax(`A default value for an argument must be a constant (a boolean, a string, a number, or an array).`, token.line, stream.getSourceContext());
                    }
                } else {
                    value = this.parseExpression(0, allowArrow);
                }
            }

            if (definition) {
                if (null === name) {
                    name = value.getAttribute('name');
                    value = new TwingNodeExpressionConstant(null, this.getCurrentToken().line, this.getCurrentToken().column);
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

        stream.expect(TokenType.PUNCTUATION, ')', 'A list of arguments must be closed by a parenthesis');

        return new TwingNode(parsedArguments);
    }

    parseAssignmentExpression() {
        let stream = this.getStream();
        let targets = new Map();

        while (true) {
            let token = this.getCurrentToken();

            if (stream.test(TokenType.OPERATOR) && nameRegExp.exec(token.value)) {
                // in this context, string operators are variable names
                this.getStream().next();
            } else {
                stream.expect(TokenType.NAME, null, 'Only variables can be assigned to');
            }

            let value = token.value;

            if (['true', 'false', 'none', 'null'].indexOf(value.toLowerCase()) > -1) {
                throw new TwingErrorSyntax(`You cannot assign a value to "${value}".`, token.line, stream.getSourceContext());
            }

            push(targets, new TwingNodeExpressionAssignName(value, token.line, token.column));

            if (!stream.nextIf(TokenType.PUNCTUATION, ',')) {
                break;
            }
        }

        return new TwingNode(targets);
    }

    parseMultitargetExpression() {
        let targets = new Map();

        while (true) {
            push(targets, this.parseExpression());

            if (!this.getStream().nextIf(TokenType.PUNCTUATION, ',')) {
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

    private isUnary(token: Token) {
        return token.test(TokenType.OPERATOR) && this.unaryOperators.has(token.value);
    }

    private isBinary(token: Token) {
        return token.test(TokenType.OPERATOR) && this.binaryOperators.has(token.value);
    }

    private getTest(line: number): Array<any> {
        let stream = this.getStream();
        let name = stream.expect(TokenType.NAME).value;

        let test = this.env.getTest(name);

        if (test) {
            return [name, test];
        }

        if (stream.test(TokenType.NAME)) {
            // try 2-words tests
            name = name + ' ' + this.getCurrentToken().value;

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

            message += ` in "${src.getPath() ? src.getPath() : src.getName()}" at line ${line}.`;

            process.stdout.write(message);
        }

        return function_.getExpressionFactory();
    }

    private getFilterExpressionFactory(name: string, line: number, column: number) {
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

            message += ` in "${src.getPath() ? src.getPath() : src.getName()}" at line ${line}.`;

            process.stdout.write(message);
        }

        return filter.getExpressionFactory();
    }
}
