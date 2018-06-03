import {TwingEnvironment} from "./environment";
import {TwingTokenStream} from "./token-stream";
import {TwingNodeBlock} from "./node/block";
import {TwingTokenParserInterface} from "./token-parser-interface";
import {TwingNodeVisitorInterface} from "./node-visitor-interface";
import {TwingExpressionParser} from "./expression-parser";
import {TwingErrorSyntax} from "./error/syntax";
import {TwingNode, TwingNodeType} from "./node";
import {TwingToken} from "./token";
import {TwingNodeText} from "./node/text";
import {TwingNodePrint} from "./node/print";
import {TwingNodeExpression} from "./node/expression";
import {TwingNodeBody} from "./node/body";
import {TwingNodeModule} from "./node/module";
import {TwingNodeTraverser} from "./node-traverser";
import {TwingNodeMacro} from "./node/macro";
import {TwingTokenParser} from "./token-parser";
import {first} from "./helper/first";
import {push} from "./helper/push";

const ctype_space = require('locutus/php/ctype/ctype_space');
const mt_rand = require('locutus/php/math/mt_rand');
const crypto = require('crypto');

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
    private expressionParser: TwingExpressionParser = null;
    private blocks: Map<string, TwingNodeBody>;
    private blockStack: Array<string>;
    private macros: Map<string, TwingNode>;
    private env: TwingEnvironment;
    private importedSymbols: Array<Map<string, Map<string, { name: string, node: TwingNodeExpression }>>>;
    private traits: Map<string, TwingNode>;
    private embeddedTemplates: Array<TwingNodeModule> = [];
    private varNameSalt: number = 0;

    constructor(env: TwingEnvironment) {
        this.env = env;
    }

    getVarName(prefix: string = '__internal_'): string {
        return `${prefix}${crypto.createHash('sha256').update('TwingParser::getVarName' + this.stream.getSourceContext().getCode() + this.varNameSalt++).digest('hex')}`;
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

        if (this.expressionParser === null) {
            this.expressionParser = new TwingExpressionParser(this, this.env);
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
        }
        catch (e) {
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

    getExpressionParser(): TwingExpressionParser {
        return this.expressionParser;
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
                case TwingToken.TEXT_TYPE:
                    token = this.stream.next();
                    rv.set(i++, new TwingNodeText(token.getValue(), token.getLine(), token.getColumn()));

                    break;
                case TwingToken.VAR_START_TYPE:
                    token = this.stream.next();
                    let expression = this.expressionParser.parseExpression();

                    this.stream.expect(TwingToken.VAR_END_TYPE);
                    rv.set(i++, new TwingNodePrint(expression, token.getLine(), token.getColumn()));

                    break;
                case TwingToken.BLOCK_START_TYPE:
                    this.stream.next();
                    token = this.getCurrentToken();

                    if (token.getType() !== TwingToken.NAME_TYPE) {
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

                    if (!this.handlers.has(token.getValue())) {
                        let e;

                        if (test !== null) {
                            e = new TwingErrorSyntax(
                                `Unexpected "${token.getValue()}" tag`,
                                token.getLine(),
                                this.stream.getSourceContext()
                            );

                            if (Array.isArray(test) && (test.length > 1) && (test[0] instanceof TwingTokenParser)) {
                                e.appendMessage(` (expecting closing tag for the "${test[0].getTag()}" tag defined near line ${lineno}).`);
                            }
                        }
                        else {
                            e = new TwingErrorSyntax(
                                `Unknown "${token.getValue()}" tag.`,
                                token.getLine(),
                                this.stream.getSourceContext()
                            );

                            e.addSuggestions(token.getValue(), Array.from(this.env.getTags().keys()));
                        }

                        throw e;
                    }

                    this.stream.next();

                    let subparser = this.handlers.get(token.getValue());

                    let node = subparser.parse(token);

                    if (node !== null) {
                        rv.set(i++, node);
                    }

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
        template.setIndex(mt_rand());

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
     * @returns {TwingNode}
     */
    filterBodyNodes(node: TwingNode): TwingNode {
        if ((node.getType() === TwingNodeType.TEXT && !ctype_space(node.getAttribute('data'))) ||
            ((node.getType() !== TwingNodeType.TEXT) && (node.getType() !== TwingNodeType.BLOCK_REFERENCE) && ((node as any).TwingNodeOutputInterfaceImpl)))
        {
            if (String(node).indexOf(String.fromCharCode(0xEF, 0xBB, 0xBF)) > -1) {
                throw new TwingErrorSyntax(
                    `A template that extends another one cannot start with a byte order mark (BOM); it must be removed.`,
                    node.getTemplateLine(),
                    this.stream.getSourceContext());
            }

            throw new TwingErrorSyntax(
                `A template that extends another one cannot include content outside Twig blocks. Did you forget to put the content inside a {% block %} tag?`,
                node.getTemplateLine(),
                this.stream.getSourceContext());
        }

        // bypass nodes that will "capture" the output
        if ((node as any).TwingNodeCaptureInterfaceImpl) {
            return node;
        }

        if ((node as any).TwingNodeOutputInterfaceImpl) {
            return null;
        }

        for (let [k, n] of node.getNodes()) {
            if (n !== null && (this.filterBodyNodes(n) === null)) {
                node.removeNode(k);
            }
        }

        return node;
    }
}
