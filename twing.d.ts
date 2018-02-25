/// <reference types="luxon" />
import {DateTime, Interval} from "luxon";

declare module twing {
    enum TwingNodeType {
        AUTO_ESCAPE = "auto_escape",
        BLOCK = "block",
        BLOCK_REFERENCE = "block_reference",
        BODY = "body",
        DO = "do",
        EXPRESSION_ARRAY = "expression_array",
        EXPRESSION_ASSIGN_NAME = "expression_assign_name",
        EXPRESSION_BINARY = "expression_binary",
        EXPRESSION_BLOCK_REFERENCE = "expression_block_reference",
        EXPRESSION_CONDITIONAL = "expression_conditional",
        EXPRESSION_CONSTANT = "expression_constant",
        EXPRESSION_FILTER = "expression_filter",
        EXPRESSION_FUNCTION = "expression_function",
        EXPRESSION_GET_ATTR = "expression_get_attr",
        EXPRESSION_METHOD_CALL = "expression_method_call",
        EXPRESSION_NAME = "expression_name",
        EXPRESSION_NULL_COALESCE = "expression_null_coalesce",
        EXPRESSION_PARENT = "expression_parent",
        EXPRESSION_TEST = "expression_test",
        EXPRESSION_UNARY = "expression_unary",
        EXPRESSION_UNARY_NEG = "expression_unary_neg",
        EXPRESSION_UNARY_POS = "expression_unary_pos",
        FLUSH = "flush",
        FOR = "for",
        IF = "if",
        IMPORT = "import",
        INCLUDE = "include",
        MACRO = "macro",
        MODULE = "module",
        PRINT = "print",
        SANDBOX = "sandbox",
        SET = "set",
        SPACELESS = "spaceless",
        TEXT = "text",
    }

    class TokenPosition {
        line: number;
        column: number;
        source: string;

        /**
         *
         * @param {number} line
         * @param {number} column
         * @param {string} source
         */
        constructor(line?: number, column?: number, source?: string);
    }

    enum TwingTokenType {
        EOF_TYPE = "EOF_TYPE",
        TEXT_TYPE = "TEXT_TYPE",
        BLOCK_START_TYPE = "BLOCK_START_TYPE",
        VAR_START_TYPE = "VAR_START_TYPE",
        BLOCK_END_TYPE = "BLOCK_END_TYPE",
        VAR_END_TYPE = "VAR_END_TYPE",
        NAME_TYPE = "NAME_TYPE",
        NUMBER_TYPE = "NUMBER_TYPE",
        STRING_TYPE = "STRING_TYPE",
        OPERATOR_TYPE = "OPERATOR_TYPE",
        PUNCTUATION_TYPE = "PUNCTUATION_TYPE",
        INTERPOLATION_START_TYPE = "INTERPOLATION_START_TYPE",
        INTERPOLATION_END_TYPE = "INTERPOLATION_END_TYPE",
    }

    class TwingToken {
        position: TokenPosition;
        type: TwingTokenType;
        value: string;
        lineno: number;

        constructor(type: TwingTokenType, value: string, lineno: number);

        /**
         * Tests the current token for a type and/or a value.
         *
         * Parameters may be:
         *  * just type
         *  * type and value (or array of possible values)
         *  * just value (or array of possible values) (NAME_TYPE is used as type)
         *
         * @param type TwingTokenType
         * @param values string|Array<string>
         * @returns {boolean}
         */
        test(type: TwingTokenType, values?: Array<string> | string | number): boolean;

        /**
         * @return int
         */
        getLine(): number;

        getType(): TwingTokenType;

        getValue(): string;

        toString(): string;

        static typeToEnglish(type: TwingTokenType): string;
    }

    class TwingSource {
        private code;
        private name;
        private path;

        constructor(code: string, name: string, path?: string);

        getCode(): string;

        getName(): string;

        getPath(): string;
    }

    class TwingErrorRuntime extends TwingError {
    }

    class TwingMap<K, V> extends Map<any, any> {
        push(item: any): this;

        first(): any;

        merge(map: TwingMap<any, any>): TwingMap<any, any>;

        chunk(size: number, preserveKeys?: boolean): TwingMap<any, any>[];

        fill(start: number, length: number, value: any): void;

        join(separator: string): string;

        slice(start: number, length: number, preserveKeys?: boolean): TwingMap<{}, {}>;

        /**
         * Reverse the Map.
         *
         * @param {boolean} preserveKeys
         *
         * @returns TwingMap
         */
        reverse(preserveKeys?: boolean): TwingMap<{}, {}>;

        /**
         *
         * @param {Function} handler
         * @returns {TwingMap}
         */
        sort(handler?: any): this;

        /**
         *
         * @param {Function} handler
         * @returns {TwingMap}
         */
        sortByKeys(handler?: any): this;

        includes(thing: any): boolean;

        clone(): TwingMap<any, any>;
    }

    class TwingNodeBlock extends TwingNode {
        constructor(name: string, body: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Exposes a template to userland.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     * @author Eric MORAND <eric.morand@gmail.com>
     */

    class TwingTemplateWrapper {
        private env;
        private template;

        /**
         * This method is for internal use only and should never be called
         * directly (use TwingEnvironment::load() instead).
         *
         * @internal
         */
        constructor(env: TwingEnvironment, template: TwingTemplate);

        /**
         * Renders the template.
         *
         * @param context An hash of parameters to pass to the template
         *
         * @returns {string} The rendered template
         */
        render(context?: any): Promise<string>;

        /**
         * Checks if a block is defined.
         *
         * @param {string} name    The block name
         * @param context           A hash of parameters to pass to the template
         *
         * @returns {boolean}
         */
        hasBlock(name: string, context?: any): boolean;

        /**
         * Returns defined block names in the template.
         *
         * @param context A hash of parameters to pass to the template
         *
         * @returns {Array<string>} An array of defined template block names
         */
        getBlockNames(context?: any): string[];

        /**
         * Renders a template block.
         *
         * @param {string} name The block name to render
         * @param context A hash of parameters to pass to the template
         * @param {TwingMap<string, TwingTemplateBlock>} blocks The current set of blocks
         *
         * @returns {string} The rendered block
         */
        renderBlock(name: string, context?: any, blocks?: TwingMap<string, Array<any>>): Promise<void>;

        /**
         * Displays a template block.
         *
         * @param {string} name The block name to render
         * @param context An array of parameters to pass to the template
         */
        displayBlock(name: string, context?: any): Promise<void>;

        /**
         *
         * @returns {TwingSource}
         */
        getSourceContext(): TwingSource;
    }

    class TwingOutputHandler {
        static readonly OUTPUT_HANDLER_CLEANABLE: number;
        static readonly OUTPUT_HANDLER_FLUSHABLE: number;
        static readonly OUTPUT_HANDLER_REMOVABLE: number;
        static readonly OUTPUT_HANDLER_STDFLAGS: number;
        private content;
        private name;
        private level;
        private flags;

        constructor(level: number, flags: number);

        getContent(): string;

        getName(): string;

        getLevel(): number;

        getFlags(): number;

        write(value: string): void;

        append(value: string): void;
    }

    class TwingOutputBuffer {
        static handlers: Array<TwingOutputHandler>;

        static echo(string: any): string | void;

        /**
         * Turn on Output Buffering (specifying an optional output handler).
         *
         * @returns {boolean}
         */
        static obStart(): boolean;

        /**
         * Flush (send) contents of the output buffer. The last buffer content is sent to next buffer
         *
         * In human terms, append the top-most buffer to the second-top-most buffer and empty the top-most buffer
         *
         * ┌─────────┐    ┌─────────┐
         * │   oof   │    │         │
         * ├─────────┤    ├─────────┤
         * │   bar   │ => │  baroof │
         * ├─────────┤    ├─────────┤
         * │   foo   │    │   foo   │ => true
         * └─────────┘    └─────────┘
         *
         */
        static obFlush(): boolean;

        /**
         * Alias for TwingOutputBuffer.obFlush
         *
         * @returns {boolean}
         */
        static flush(): boolean;

        /**
         * Flush (send) the output buffer, and delete current output buffer
         *
         * In human terms: append the top-most buffer to the second-top-most buffer and remove the top-most buffer
         *
         * ┌─────────┐
         * │   oof   │
         * ├─────────┤    ┌─────────┐
         * │   bar   │ -> │  baroof │
         * ├─────────┤    ├─────────┤
         * │   foo   │    │   foo   │ => true
         * └─────────┘    └─────────┘
         *
         * @returns {boolean}
         */
        static obEndFlush(): boolean;

        /**
         * Get active buffer contents, flush (send) the output buffer, and delete active output buffer
         *
         * In human terms: append the top-most buffer to the second-top-most buffer, remove the top-most buffer and returns its content
         *
         * ┌─────────┐
         * │   oof   │
         * ├─────────┤    ┌─────────┐
         * │   bar   │ -> │  baroof │
         * ├─────────┤    ├─────────┤
         * │   foo   │    │   foo   │ => oof
         * └─────────┘    └─────────┘
         *
         * @returns {string | false}
         */
        static obGetFlush(): string | false;

        /**
         * Clean (erase) the output buffer
         *
         * In human terms, empty the top-most buffer
         *
         * ┌─────────┐    ┌─────────┐
         * │   oof   │    │         │
         * ├─────────┤    ├─────────┤
         * │   bar   │ => │   bar   │
         * ├─────────┤    ├─────────┤
         * │   foo   │    │   foo   │ => true
         * └─────────┘    └─────────┘
         *
         */
        static obClean(): boolean;

        /**
         * Clean the output buffer, and delete active output buffer
         *
         * In human terms: clean the top-most buffer and remove the top-most buffer
         *
         * ┌─────────┐
         * │   oof   │
         * ├─────────┤    ┌─────────┐
         * │   bar   │ -> │   bar   │
         * ├─────────┤    ├─────────┤
         * │   foo   │    │   foo   │ => true
         * └─────────┘    └─────────┘
         *
         * @returns {boolean}
         */
        static obEndClean(): boolean;

        /**
         * Get active buffer contents and delete active output buffer
         *
         * In human terms: Remove the top-most buffer and returns its content
         *
         * ┌─────────┐
         * │   oof   │
         * ├─────────┤    ┌─────────┐
         * │   bar   │ -> │   bar   │
         * ├─────────┤    ├─────────┤
         * │   foo   │    │   foo   │ => oof
         * └─────────┘    └─────────┘
         *
         * @returns {string | false}
         */
        static obGetClean(): string | false;

        /**
         * Return the nesting level of the output buffering mechanism
         *
         * @returns {number}
         */
        static obGetLevel(): number;

        /**
         * Return the contents of the output buffer
         *
         * @returns {string | false}
         */
        static obGetContents(): string | false;

        /**
         * Append the string to the top-most buffer or return  the string if there is none
         *
         * @param {string} string | void
         */
        private static outputWrite(string);

        private static getActive();
    }

    const echo: typeof TwingOutputBuffer.echo;
    const obStart: typeof TwingOutputBuffer.obStart;
    const obEndClean: typeof TwingOutputBuffer.obEndClean;
    const obGetClean: typeof TwingOutputBuffer.obGetClean;
    const obGetContents: typeof TwingOutputBuffer.obGetContents;
    const flush: typeof TwingOutputBuffer.flush;

    /**
     * Converts input to TwingMap.
     *
     * @param seq
     * @returns {TwingMap<any, any>}
     */


    function iteratorToMap(thing: any): TwingMap<any, any>;

    abstract class TwingTemplate {
        static ANY_CALL: string;
        static ARRAY_CALL: string;
        static METHOD_CALL: string;
        /**
         * @internal
         */
        protected static cache: Array<string>;
        protected parent: TwingTemplate | false;
        protected parents: TwingMap<string, TwingTemplate>;
        protected env: TwingEnvironment;
        protected blocks: TwingMap<string, Array<any>>;
        protected traits: TwingMap<string, [string, TwingTemplate]>;

        constructor(env: TwingEnvironment);

        /**
         * @internal this method will be removed in 2.0 and is only used internally to provide an upgrade path from 1.x to 2.0
         */
        toString(): string;

        /**
         * Returns the template name.
         *
         * @returns {string} The template name
         */
        abstract getTemplateName(): string;

        /**
         * Returns debug information about the template.
         *
         * @returns {Map<number, number>} Debug information
         *
         * @internal
         */
        abstract getDebugInfo(): Map<number, number>;

        /**
         * Returns information about the original template source code.
         *
         * @return TwingSource
         */
        getSourceContext(): TwingSource;

        /**
         * Returns the parent template.
         *
         * @param context
         *
         * @returns TwingTemplate|false The parent template or false if there is no parent
         */
        getParent(context?: any): any;

        protected doGetParent(context: any): TwingTemplate | false;

        isTraitable(): boolean;

        /**
         * Displays a parent block.
         *
         * This method is for internal use only and should never be called
         * directly.
         *
         * @param {string} name The block name to display from the parent
         * @param context The context
         * @param {Map<string, TwingNodeBlock>} blocks The active set of blocks
         * @returns {string}
         *
         * @internal
         */
        displayParentBlock(name: string, context: any, blocks?: Map<string, TwingNodeBlock>): Promise<void>;

        /**
         * Displays a block.
         *
         * This method is for internal use only and should never be called
         * directly.
         *
         * @param {string} name The block name to display
         * @param context The context
         * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
         * @param {boolean} useBlocks Whether to use the active set of blocks
         *
         * @internal
         */
        displayBlock(name: string, context: any, blocks?: TwingMap<string, [TwingTemplate, string]>, useBlocks?: boolean): Promise<void>;

        /**
         * Renders a parent block.
         *
         * This method is for internal use only and should never be called
         * directly.
         *
         * @param {string} name The block name to display from the parent
         * @param context The context
         * @param {Map<string, TwingNodeBlock>} blocks The active set of blocks
         *
         * @returns string The rendered block
         *
         * @internal
         */
        renderParentBlock(name: string, context: any, blocks?: Map<string, TwingNodeBlock>): Promise<string>;

        /**
         * Renders a block.
         *
         * This method is for internal use only and should never be called
         * directly.
         *
         * @param {string} name The block name to display
         * @param context The context
         * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
         * @param {boolean} useBlocks Whether to use the active set of blocks
         *
         * @return string The rendered block
         *
         * @internal
         */
        renderBlock(name: string, context: any, blocks?: TwingMap<string, Array<any>>, useBlocks?: boolean): Promise<string>;

        /**
         * Returns whether a block exists or not in the active context of the template.
         *
         * This method checks blocks defined in the active template
         * or defined in "used" traits or defined in parent templates.
         *
         * @param {string} name The block name
         * @param context The context
         * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
         *
         * @returns {boolean} true if the block exists, false otherwise
         */
        hasBlock(name: string, context: any, blocks?: TwingMap<string, Array<any>>): boolean;

        /**
         * Returns all block names in the active context of the template.
         *
         * This method checks blocks defined in the active template
         * or defined in "used" traits or defined in parent templates.
         *
         * @param context The context
         * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
         * @returns {Array<string>}
         */
        getBlockNames(context: any, blocks?: TwingMap<string, Array<any>>): Array<string>;

        loadTemplate(template: TwingTemplate | TwingTemplateWrapper | Array<TwingTemplate> | string, templateName?: string, line?: number, index?: number): TwingTemplate | TwingTemplateWrapper;

        /**
         * Returns all blocks.
         *
         * This method is for internal use only and should never be called
         * directly.
         *
         * @returns {TwingMap<string, Array<*>>} An array of blocks
         *
         * @internal
         */
        getBlocks(): TwingMap<string, any[]>;

        display(context: any, blocks?: TwingMap<string, Array<any>>): Promise<void>;

        render(context: any): Promise<string>;

        protected displayWithErrorHandling(context: any, blocks?: TwingMap<string, Array<any>>): Promise<void>;

        /**
         * Auto-generated method to display the template with the given context.
         *
         * @param {*} context An array of parameters to pass to the template
         * @param {TwingMap<string, Array<*>>} blocks  An array of blocks to pass to the template
         */
        abstract doDisplay(context: {}, blocks: TwingMap<string, Array<any>>): Promise<void>;
    }

    /**
     * Twing base error.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */

    class TwingError extends Error {
        sourceName: string;
        private lineno;
        private rawMessage;
        private sourcePath;
        private sourceCode;
        private previous;
        private template;

        constructor(message: string, lineno?: number, source?: TwingSource | string | null, previous?: Error, template?: TwingTemplate);

        /**
         * Gets the raw message.
         *
         * @return string The raw message
         */
        getRawMessage(): string;

        /**
         * Gets the template line where the error occurred.
         *
         * @return int The template line
         */
        getTemplateLine(): number | boolean;

        /**
         * Sets the template line where the error occurred.
         *
         * @param {number} lineno The template line
         */
        setTemplateLine(lineno: number | boolean): void;

        /**
         * Gets the source context of the Twig template where the error occurred.
         *
         * @return TwingSource|null
         */
        getSourceContext(): TwingSource;

        /**
         * Sets the source context of the Twig template where the error occurred.
         */
        setSourceContext(source?: TwingSource): void;

        /**
         *
         * @returns {TwingTemplate}
         */
        getTemplate(): TwingTemplate;

        /**
         *
         * @param {TwingTemplate} template
         */
        setTemplate(template: TwingTemplate): void;

        guess(): void;

        appendMessage(rawMessage: string): void;

        updateRepr(): void;

        guessTemplateInfo(): void;
    }

    class TwingErrorSyntax extends TwingError {
        /**
         * Tweaks the error message to include suggestions.
         *
         * @param string $name  The original name of the item that does not exist
         * @param array  $items An array of possible items
         */
        addSuggestions(name: string, items: string[]): void;
    }

    class TwingTokenStream {
        tokens: Array<TwingToken>;
        current: number;
        source: TwingSource;

        constructor(tokens: Array<TwingToken>, source?: TwingSource);

        toString(): string;

        injectTokens(tokens: Array<TwingToken>): void;

        /**
         * Sets the pointer to the next token and returns the old one.
         *
         * @return TwingToken
         */
        next(): TwingToken;

        /**
         * Tests a token, sets the pointer to the next one and returns it or throws a syntax error.
         *
         * @return TwingToken|null The next token if the condition is true, null otherwise
         */
        nextIf(primary: TwingTokenType, secondary?: Array<string> | string): TwingToken;

        /**
         * Tests a token and returns it or throws a syntax error.
         *
         * @return TwingToken
         */
        expect(type: TwingTokenType, value?: Array<string> | string | number, message?: string): TwingToken;

        /**
         * Looks at the next token.
         *
         * @param number {number}
         *
         * @return TwingToken
         */
        look(number?: number): TwingToken;

        /**
         * Tests the active token.
         *
         * @return bool
         */
        test(primary: TwingTokenType, secondary?: Array<string> | string): boolean;

        /**
         * Checks if end of stream was reached.
         *
         * @return bool
         */
        isEOF(): boolean;

        /**
         * @return TwingToken
         */
        getCurrent(): TwingToken;

        /**
         * Gets the source associated with this stream.
         *
         * @return TwingSource
         *
         * @internal
         */
        getSourceContext(): TwingSource;
    }

    /**
     * Abstract class for all nodes that represents an expression.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    abstract class TwingNodeExpression extends TwingNode {
        private dummy;
    }

    class TwingNodeExpressionConstant extends TwingNodeExpression {
        constructor(value: TwingNode | string | number | boolean, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    enum TwingLexerState {
        STATE_DATA = 0,
        STATE_BLOCK = 1,
        STATE_VAR = 2,
        STATE_STRING = 3,
        STATE_INTERPOLATION = 4,
    }

    /**
     * Lexes a template string.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */

    class TwingLexer {
        static REGEX_NAME: RegExp;
        static REGEX_NUMBER: RegExp;
        static REGEX_STRING: RegExp;
        static REGEX_DQ_STRING_DELIM: RegExp;
        static REGEX_DQ_STRING_PART: RegExp;
        static PUNCTUATION: string;
        brackets: Array<{
            value: string;
            line: number;
        }>;
        code: string;
        currentVarBlockLine: number;
        cursor: number;
        end: number;
        env: TwingEnvironment;
        lineno: number;
        options: {
            interpolation: Array<string>;
            tag_block: Array<string>;
            tag_comment: Array<string>;
            tag_variable: Array<string>;
            whitespace_trim: string;
        };
        position: number;
        positions: Array<RegExpExecArray>;
        regexes: {
            interpolation_end: RegExp;
            interpolation_start: RegExp;
            lex_block: RegExp;
            lex_block_line: RegExp;
            lex_block_raw: RegExp;
            lex_comment: RegExp;
            lex_tokens_start: RegExp;
            lex_var: RegExp;
            operator: RegExp;
            lex_raw_data: RegExp;
        };
        source: TwingSource;
        state: TwingLexerState;
        states: Array<TwingLexerState>;
        tokens: Array<TwingToken>;

        constructor(env: TwingEnvironment, options?: {});

        tokenize(source: TwingSource): TwingTokenStream;

        private lexData();

        private lexBlock();

        private lexVar();

        private lexExpression();

        private lexRawData();

        private lexComment();

        private lexString();

        private lexInterpolation();

        private moveCursor(text);

        private getOperatorRegEx();

        private pushTwingToken(type, value?);

        private pushState(state);

        /**
         * @return TwingLexerState
         */
        private popState();
    }

    class TwingNodeExpressionName extends TwingNodeExpression {
        private specialVars;

        constructor(name: string, lineno: number);

        compile(compiler: TwingCompiler): void;

        isSpecial(): boolean;

        isSimple(): boolean;
    }

    abstract class TwingNodeExpressionBinary extends TwingNodeExpression {
        constructor(left: TwingNode, right: TwingNode, lineno: number);

        compile(compiler: TwingCompiler): void;

        /**
         *
         * @param {TwingCompiler} compiler
         * @returns {TwingCompiler}
         */
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryConcat extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionGetAttr extends TwingNodeExpression {
        constructor(node: TwingNodeExpression, attribute: TwingNodeExpression, methodArguments: TwingNodeExpression, type: string, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionArray extends TwingNodeExpression {
        private index;

        constructor(elements: TwingMap<string, TwingNodeExpression>, lineno: number);

        getKeyValuePairs(): Array<{
            key: TwingNodeExpression;
            value: TwingNodeExpression;
        }>;

        addElement(value: TwingNodeExpression, key?: TwingNodeExpression): void;

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionMethodCall extends TwingNodeExpression {
        constructor(node: TwingNodeExpression, method: string, methodArguments: TwingNodeExpressionArray, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionConditional extends TwingNodeExpression {
        constructor(expr1: TwingNodeExpression, expr2: TwingNodeExpression, expr3: TwingNodeExpression, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionAssignName extends TwingNodeExpressionName {
        constructor(name: string, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    interface TwingOperatorDefinitionInterface {
        precedence: number;
        associativity?: string;
        factory: Function;
        callable?: Function;
    }

    interface TwingTestOptions {
        is_variadic?: boolean;
        node_factory?: Function;
        deprecated?: string;
        alternative?: TwingTest;
        need_context?: boolean;
    }

    class TwingReflectionParameter {
        private name;
        private defaultValue;
        private optional;

        constructor(name: string, defaultValue: any);

        isDefaultValueAvailable(): boolean;

        getName(): string;

        getDefaultValue(): any;

        isArray(): boolean;

        isOptional(): boolean;

        setOptional(flag: boolean): void;
    }

    class TwingReflectionMethod {
        private name;
        private parameters;
        private callable;

        constructor(callable: Function, name: string);

        getName(): string;

        getParameters(): Array<TwingReflectionParameter>;

        isStatic(): boolean;

        invokeArgs(scope: any, ...args: Array<any>): any;
    }

    class TwingNodeExpressionFilter extends TwingNodeExpressionCall {
        constructor(node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    type TwingFilterOptions = {
        needs_environment?: boolean;
        needs_context?: boolean;
        is_variadic?: boolean;
        is_safe?: Array<any>;
        is_safe_callback?: Function;
        pre_escape?: string;
        preserves_safety?: Array<string>;
        expression_factory?: Function;
        deprecated?: string;
        alternative?: TwingFilter;
    };

    class TwingFilter {
        private name;
        private callable;
        private options;
        private methodArguments;

        constructor(name: string, callable: Function, options?: TwingFilterOptions);

        getName(): string;

        /**
         * Returns the callable to execute for this filter.
         *
         * @returns {Function}
         */
        getCallable(): Function;

        /**
         *
         * @returns {Function}
         */
        getExpressionFactory(): Function;

        setArguments(someArguments: Array<any>): void;

        getArguments(): any[];

        needsEnvironment(): boolean;

        needsContext(): boolean;

        /**
         *
         * @param {TwingNode} filterArgs
         * @returns boolean
         */
        getSafe(filterArgs: TwingNode): any;

        getPreservesSafety(): string[];

        getPreEscape(): string;

        isVariadic(): boolean;

        isDeprecated(): string;

        /**
         *
         * @returns {string}
         */
        getDeprecatedVersion(): string;

        /**
         *
         * @returns {TwingFilter}
         */
        getAlternative(): TwingFilter;

        filter(env: TwingEnvironment, value: string): string;
    }

    type TwingFunctionOptions = {
        needs_environment?: boolean;
        needs_context?: boolean;
        is_variadic?: boolean;
        is_safe?: Array<string>;
        is_safe_callback?: Function;
        expression_factory?: Function;
        deprecated?: string;
        alternative?: string;
    };

    class TwingNodeExpressionFunction extends TwingNodeExpressionCall {
        constructor(name: string, functionArguments: TwingNode, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingFunction {
        private name;
        private callable;
        private options;
        private arguments;

        /**
         * Creates a template function.
         *
         * @param {string} name Name of this function
         * @param {Function} callable A callable implementing the function. If null, you need to overwrite the "expression_factory" option to customize compilation.
         * @param {TwingFunctionOptions} options Options
         */
        constructor(name: string, callable?: Function, options?: TwingFunctionOptions);

        getName(): string;

        /**
         * Returns the callable to execute for this function.
         *
         * @return callable|null
         */
        getCallable(): Function;

        getExpressionFactory(): Function;

        setArguments(arguments_: Array<any>): void;

        getArguments(): any[];

        needsEnvironment(): boolean;

        needsContext(): boolean;

        getSafe(functionArgs: TwingNode): any;

        isVariadic(): boolean;

        isDeprecated(): boolean;

        getDeprecatedVersion(): string;

        getAlternative(): string;
    }

    /**
     * Interface implemented by extension classes.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */

    interface TwingExtensionInterface {
        /**
         * Returns the token parser instances to add to the existing list.
         *
         * @return Array<TwingTokenParserInterface>
         */
        getTokenParsers(): Array<TwingTokenParserInterface>;

        /**
         * Returns the node visitor instances to add to the existing list.
         *
         * @return Array<TwingNodeVisitorInterface>
         */
        getNodeVisitors(): Array<TwingNodeVisitorInterface>;

        /**
         * Returns a list of filters to add to the existing list.
         *
         * @return Array<TwingFilter>
         */
        getFilters(): Array<TwingFilter>;

        /**
         * Returns a list of tests to add to the existing list.
         *
         * @returns Array<TwingTest>
         */
        getTests(): Array<TwingTest>;

        /**
         * Returns a list of functions to add to the existing list.
         *
         * @return Array<TwingFunction>
         */
        getFunctions(): Array<TwingFunction>;

        /**
         * Returns a list of operators to add to the existing list.
         *
         * @return array<Map<string, TwingOperatorDefinitionInterface>> First array of unary operators, second array of binary operators
         */
        getOperators(): {
            unary: Map<string, TwingOperatorDefinitionInterface>;
            binary: Map<string, TwingOperatorDefinitionInterface>;
        };

        /**
         * Gets the default strategy to use when not defined by the user.
         *
         * @param {string} name The template name
         *
         * @returns string|Function The default strategy to use for the template
         */
        getDefaultStrategy(name: string): string | Function | false;
    }

    class TwingExtension implements TwingExtensionInterface {
        getDefaultStrategy(name: string): string | Function;

        getTokenParsers(): Array<TwingTokenParserInterface>;

        getNodeVisitors(): TwingNodeVisitorInterface[];

        getFilters(): Array<TwingFilter>;

        getTests(): Array<TwingTest>;

        getFunctions(): Array<TwingFunction>;

        getOperators(): {
            unary: Map<string, TwingOperatorDefinitionInterface>;
            binary: Map<string, TwingOperatorDefinitionInterface>;
        };
    }

    abstract class TwingNodeExpressionCall extends TwingNodeExpression {
        private reflector;

        protected compileCallable(compiler: TwingCompiler): void;

        protected compileArguments(compiler: TwingCompiler): void;

        protected getArguments(callable: Function, argumentsNode: TwingNode): Array<TwingNode>;

        protected normalizeName(name: string): any;

        private getCallableParameters(callable, isVariadic);

        private reflectCallable(callable);
    }

    class TwingNodeExpressionTest extends TwingNodeExpressionCall {
        constructor(node: TwingNode, name: string | TwingNode, nodeArguments: TwingNode, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingTest {
        private name;
        private callable;
        private options;

        /**
         * Creates a template test.
         *
         * @param string        $name     Name of this test
         * @param callable|null $callable A callable implementing the test. If null, you need to overwrite the "node_class" option to customize compilation.
         * @param array         $options  Options array
         */
        constructor(name: string, callable?: Function, options?: TwingTestOptions);

        getName(): string;

        /**
         * Returns the callable to execute for this test.
         *
         * @return callable|null
         */
        getCallable(): Function;

        getNodeFactory(): Function;

        isVariadic(): boolean;

        isDeprecated(): boolean;

        getDeprecatedVersion(): string;

        getAlternative(): TwingTest;
    }

    class TwingNodeExpressionParent extends TwingNodeExpression {
        constructor(name: string, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBlockReference extends TwingNodeExpression {
        constructor(name: TwingNode, template: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;

        compileTemplateCall(compiler: TwingCompiler, method: string): TwingCompiler;

        compileBlockArguments(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionHash extends TwingNodeExpressionArray {
        compile(compiler: TwingCompiler): void;
    }

    abstract class TwingNodeExpressionUnary extends TwingNodeExpression {
        constructor(expr: TwingNode, lineno: number);

        compile(compiler: TwingCompiler): void;

        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionUnaryNot extends TwingNodeExpressionUnary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingExpressionParser {
        private parser;
        private env;
        private unaryOperators;
        private binaryOperators;
        static OPERATOR_LEFT: string;
        static OPERATOR_RIGHT: string;

        constructor(parser: TwingParser, env: TwingEnvironment);

        parseExpression(precedence?: number): TwingNodeExpression;

        getPrimary(): TwingNodeExpression;

        private isUnary(token);

        private isBinary(token);

        parsePrimaryExpression(): TwingNodeExpression;

        getFunctionNode(name: string, line: number): TwingNodeExpression;

        parseStringExpression(): TwingNodeExpression;

        parseArrayExpression(): TwingNodeExpression;

        parseHashExpression(): TwingNodeExpression;

        parseSubscriptExpression(node: TwingNodeExpression): any;

        parsePostfixExpression(node: TwingNodeExpression): TwingNodeExpression;

        parseTestExpression(node: TwingNodeExpression): TwingNodeExpression;

        parseNotTestExpression(node: TwingNodeExpression): TwingNodeExpression;

        private getTest(line);

        parseConditionalExpression(expr: TwingNodeExpression): TwingNodeExpression;

        parseFilterExpression(node: TwingNodeExpression): TwingNodeExpression;

        parseFilterExpressionRaw(node: TwingNodeExpression, tag?: string): TwingNodeExpression;

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
        parseArguments(namedArguments?: boolean, definition?: boolean): TwingNode;

        parseAssignmentExpression(): TwingNode;

        parseMultitargetExpression(): TwingNode;

        private getFunctionExpressionFactory(name, line);

        private getFilterExpressionFactory(name, line);

        checkConstantExpression(node: TwingNode): boolean;
    }

    enum TwingNodeOutputType {
        NONE = "none",
        CAPTURE = "capture",
        OUTPUT = "output",
    }

    class TwingNodeText extends TwingNode {
        constructor(data: string, line: number);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Represents a displayable node in the AST.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */
    interface TwingNodeOutputInterface {
    }

    class TwingNodePrint extends TwingNode implements TwingNodeOutputInterface {
        constructor(expr: TwingNodeExpression, line: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Represents a body node.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */
    class TwingNodeBody extends TwingNode {
        constructor(nodes?: TwingMap<any, any>, attributes?: TwingMap<string, any>, lineno?: number, tag?: string);
    }

    /**
     * Represents a module node.
     */
    class TwingNodeModule extends TwingNode {
        source: TwingSource;

        constructor(body: TwingNode, parent: TwingNode, blocks: TwingNode, macros: TwingNode, traits: TwingNode, embeddedTemplates: Array<{}>, source: TwingSource);

        setIndex(index: number): void;

        compile(compiler: TwingCompiler): void;

        compileTemplate(compiler: TwingCompiler): void;

        compileGetParent(compiler: TwingCompiler): void;

        compileClassHeader(compiler: TwingCompiler): void;

        compileConstructor(compiler: TwingCompiler): void;

        compileMacros(compiler: TwingCompiler): void;

        compileDisplay(compiler: TwingCompiler): void;

        compileGetTemplateName(compiler: TwingCompiler): void;

        compileIsTraitable(compiler: TwingCompiler): void;

        compileDebugInfo(compiler: TwingCompiler): void;

        compileGetSourceContext(compiler: TwingCompiler): void;

        compileClassfooter(compiler: TwingCompiler): void;
    }

    /**
     * Twig_NodeTraverser is a node traverser.
     *
     * It visits all nodes and their children and calls the given visitor for each.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     * @author Eric MORAND <eric.morand@gmail.com>
     */

    class TwingNodeTraverser {
        private env;
        private visitors;

        /**
         *
         * @param {TwingEnvironment} env
         * @param {Array<TwingNodeVisitorInterface>} visitors
         */
        constructor(env: TwingEnvironment, visitors?: Array<TwingNodeVisitorInterface>);

        addVisitor(visitor: TwingNodeVisitorInterface): void;

        /**
         * Traverses a node and calls the registered visitors.
         *
         * @return TwingNode
         */
        traverse(node: TwingNode): TwingNode;

        traverseForVisitor(visitor: TwingNodeVisitorInterface, node: TwingNode): TwingNode;
    }

    /**
     * Represents a macro node.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */

    class TwingNodeMacro extends TwingNode {
        static VARARGS_NAME: string;

        constructor(name: string, body: TwingNode, macroArguments: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Base class for all token parsers.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */
    abstract class TwingTokenParser implements TwingTokenParserInterface {
        parse(token: TwingToken): TwingNode;

        getTag(): string;

        /**
         * @var TwingParser
         */
        protected parser: TwingParser;

        setParser(parser: TwingParser): void;
    }

    class TwingParser {
        private stack;
        private stream;
        private parent;
        private handlers;
        private visitors;
        private expressionParser;
        private blocks;
        private blockStack;
        private macros;
        private env;
        private importedSymbols;
        private traits;
        private embeddedTemplates;

        constructor(env: TwingEnvironment);

        getVarName(prefix?: string): string;

        parse(stream: TwingTokenStream, test?: Array<any>, dropNeedle?: boolean): TwingNodeModule;

        getExpressionParser(): TwingExpressionParser;

        getParent(): TwingNode;

        setParent(parent: TwingNode): void;

        subparse(test: Array<any>, dropNeedle?: boolean): TwingNode;

        getBlockStack(): string[];

        peekBlockStack(): string;

        popBlockStack(): void;

        pushBlockStack(name: string): void;

        hasBlock(name: string): boolean;

        getBlock(name: string): any;

        setBlock(name: string, value: TwingNodeBlock): void;

        addTrait(trait: TwingNode): void;

        hasTraits(): boolean;

        embedTemplate(template: TwingNodeModule): void;

        /**
         * @return {TwingToken}
         */
        getCurrentToken(): TwingToken;

        /**
         *
         * @return {TwingTokenStream}
         */
        getStream(): TwingTokenStream;

        addImportedSymbol(type: string, alias: string, name?: string, node?: TwingNodeExpression): void;

        getImportedSymbol(type: string, alias: string): {
            node: TwingNodeExpression;
            name: string;
        };

        hasMacro(name: string): boolean;

        setMacro(name: string, node: TwingNodeMacro): void;

        isMainScope(): boolean;

        pushLocalScope(): void;

        popLocalScope(): void;

        /**
         *
         * @param node
         * @returns {TwingNode}
         */
        filterBodyNodes(node: TwingNode): TwingNode;
    }

    /**
     * Interface implemented by token parsers.
     *
     * @author Eric MORAND <eric.morand@gmail.com>
     */
    interface TwingTokenParserInterface {
        /**
         * Sets the parser associated with this token parser.
         */
        setParser(parser: TwingParser): void;

        /**
         * Parses a token and returns a node.
         *
         * @return TwingNode A TwingNode instance
         *
         * @throws TwingErrorSyntax
         */
        parse(token: TwingToken): TwingNode;

        /**
         * Gets the tag name associated with this token parser.
         *
         * @return string The tag name
         */
        getTag(): string;
    }

    class TwingExtensionStaging extends TwingExtension {
        private functions;
        private filters;
        private visitors;
        private tokenParsers;
        private tests;

        addFunction(twingFunction: TwingFunction): void;

        getFunctions(): TwingFunction[];

        addTokenParser(parser: TwingTokenParserInterface): void;

        getTokenParsers(): Array<TwingTokenParserInterface>;

        addFilter(filter: TwingFilter): void;

        getFilters(): TwingFilter[];

        addNodeVisitor(visitor: TwingNodeVisitorInterface): void;

        addTest(test: TwingTest): void;

        getTests(): TwingTest[];
    }

    /**
     * Enables usage of the deprecated Twig_Extension::initRuntime() method.
     *
     * Explicitly implement this interface if you really need to implement the
     * deprecated initRuntime() method in your extensions.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */

    interface TwingExtensionsInitRuntimeInterface {
        /**
         * Initializes the runtime environment.
         *
         * This is where you can load some file that contains filter functions for instance.
         *
         * @param {TwingEnvironment} environment The active Twig_Environment instance
         */
        initRuntime(environment: TwingEnvironment): void;
    }

    abstract class TwingExtensionInitRuntime extends TwingExtension implements TwingExtensionsInitRuntimeInterface {
        initRuntime(environment: TwingEnvironment): void;
    }

    class TwingExtensionSet {
        private extensions;
        private initialized;
        private runtimeInitialized;
        private staging;
        private parsers;
        private visitors;
        private filters;
        private tests;
        private functions;
        private unaryOperators;
        private binaryOperators;
        private globals;
        private functionCallbacks;
        private filterCallbacks;
        private lastModified;

        constructor();

        /**
         * Initializes the runtime environment.
         */
        initRuntime(env: TwingEnvironment): void;

        hasExtension(name: string): boolean;

        getExtension(name: string): TwingExtensionInterface;

        /**
         * Registers an array of extensions.
         *
         * @param array $extensions An array of extensions
         */
        setExtensions(extensions: Array<TwingExtensionInterface>): void;

        /**
         * Returns all registered extensions.
         *
         * @return array An array of extensions
         */
        getExtensions(): Map<string, TwingExtensionInterface>;

        getSignature(): string;

        isInitialized(): boolean;

        getLastModified(): number;

        getNodeVisitors(): TwingNodeVisitorInterface[];

        getTokenParsers(): TwingTokenParserInterface[];

        getGlobals(): TwingMap<{}, {}>;

        /**
         * Registers an extension.
         *
         * @param extension TwingExtensionInterface A TwingExtensionInterface instance
         */
        addExtension(extension: TwingExtensionInterface): void;

        addTokenParser(parser: TwingTokenParserInterface): void;

        /**
         * Gets the registered unary Operators.
         *
         * @return Map<string, TwingOperatorDefinitionInterface> A map of unary operator definitions
         */
        getUnaryOperators(): Map<string, TwingOperatorDefinitionInterface>;

        /**
         * Gets the registered binary Operators.
         *
         * @return Map<string, TwingOperatorDefinitionInterface> A map of binary operators
         */
        getBinaryOperators(): Map<string, TwingOperatorDefinitionInterface>;

        private initExtensions();

        private initExtension(extension);

        addFunction(twingFunction: TwingFunction): void;

        getFunctions(): TwingMap<string, TwingFunction>;

        /**
         * Get a function by name.
         *
         * @param {string} name         function name
         * @returns {TwingFunction}     A TwingFunction instance or null if the function does not exist
         */
        getFunction(name: string): TwingFunction;

        registerUndefinedFunctionCallback(callable: Function): void;

        addFilter(filter: TwingFilter): void;

        getFilters(): Map<string, TwingFilter>;

        /**
         * Get a filter by name.
         *
         * Subclasses may override this method and load filters differently;
         * so no list of filters is available.
         *
         * @param string name The filter name
         *
         * @return Twig_Filter|false A Twig_Filter instance or false if the filter does not exist
         */
        getFilter(name: string): TwingFilter;

        registerUndefinedFilterCallback(callable: Function): void;

        addNodeVisitor(visitor: TwingNodeVisitorInterface): void;

        addTest(test: TwingTest): void;

        /**
         *
         * @returns {TwingMap<string, TwingTest>}
         */
        getTests(): TwingMap<string, TwingTest>;

        /**
         * Gets a test by name.
         *
         * @param {string} name The test name
         * @returns {TwingTest} A TwingTest instance or null if the test does not exist
         */
        getTest(name: string): TwingTest;
    }

    class TwingNodeForLoop extends TwingNode {
        constructor(lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeIf extends TwingNode {
        constructor(tests: TwingNode, elseNode: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeFor extends TwingNode {
        private loop;

        constructor(keyTarget: TwingNodeExpressionAssignName, valueTarget: TwingNodeExpressionAssignName, seq: TwingNodeExpression, ifexpr: TwingNodeExpression, body: TwingNode, elseNode: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Loops over each item of a sequence.
     *
     * <pre>
     * <ul>
     *  {% for user in users %}
     *    <li>{{ user.username|e }}</li>
     *  {% endfor %}
     * </ul>
     * </pre>
     */

    class TwingTokenParserFor extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeFor;

        decideForFork(token: TwingToken): boolean;

        decideForEnd(token: TwingToken): boolean;

        checkLoopUsageCondition(stream: TwingTokenStream, node: TwingNode): void;

        private checkLoopUsageBody(stream, node);

        getTag(): string;
    }

    class TwingNodeExpressionBinaryAnd extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;

        operator(compiler: TwingCompiler): TwingCompiler;
    }

    /**
     * Loops over each item of a sequence.
     *
     * <pre>
     * <ul>
     *  {% for user in users %}
     *    <li>{{ user.username|e }}</li>
     *  {% endfor %}
     * </ul>
     * </pre>
     */

    class TwingTokenParserExtends extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        getTag(): string;
    }

    /**
     * Represents an import node.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */

    class TwingNodeImport extends TwingNode {
        constructor(expr: TwingNodeExpression, varName: TwingNodeExpression, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Imports macros.
     *
     * <pre>
     *   {% from 'forms.html' import forms %}
     * </pre>
     */
    class TwingTokenParserFrom extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeImport;

        getTag(): string;
    }

    /**
     * Defines a macro.
     *
     * <pre>
     * {% macro input(name, value, type, size) %}
     *    <input type="{{ type|default('text') }}" name="{{ name }}" value="{{ value|e }}" size="{{ size|default(20) }}" />
     * {% endmacro %}
     * </pre>
     */

    class TwingTokenParserMacro extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeExpressionBinaryIn extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    /**
     * Tests a condition.
     *
     * <pre>
     * {% if users %}
     *  <ul>
     *    {% for user in users %}
     *      <li>{{ user.username|e }}</li>
     *    {% endfor %}
     *  </ul>
     * {% endif %}
     * </pre>
     */

    class TwingTokenParserIf extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeIf;

        decideIfFork(token: TwingToken): boolean;

        decideIfEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeSet extends TwingNode {
        constructor(capture: boolean, names: TwingNode, values: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Loops over each item of a sequence.
     *
     * <pre>
     * <ul>
     *  {% for user in users %}
     *    <li>{{ user.username|e }}</li>
     *  {% endfor %}
     * </ul>
     * </pre>
     */

    class TwingTokenParserSet extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeSet;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    /**
     * Represents a block call node.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingNodeBlockReference extends TwingNode {
        constructor(name: string, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingTokenParserBlock extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeExpressionBinaryGreater extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryLess extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeInclude extends TwingNode {
        constructor(expr: TwingNodeExpression, variables: TwingNodeExpression, only: boolean, ignoreMissing: boolean, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;

        addGetTemplate(compiler: TwingCompiler): void;

        addTemplateArguments(compiler: TwingCompiler): void;
    }

    class TwingTokenParserInclude extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeInclude;

        /**
         *
         * @returns {{variables: TwingNodeExpression; only: boolean; ignoreMissing: boolean}}
         */
        protected parseArguments(): {
            variables: TwingNodeExpression;
            only: boolean;
            ignoreMissing: boolean;
        };

        getTag(): string;
    }

    class TwingNodeWith extends TwingNode {
        constructor(body: TwingNode, variables: TwingNode, only: boolean, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingTokenParserWith extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeWith;

        decideWithEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeExpressionUnaryNeg extends TwingNodeExpressionUnary {
        constructor(expr: TwingNode, lineno: number);

        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionUnaryPos extends TwingNodeExpressionUnary {
        constructor(expr: TwingNode, lineno: number);

        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeSpaceless extends TwingNode {
        constructor(body: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    /**
     * Loops over each item of a sequence.
     *
     * <pre>
     * <ul>
     *  {% for user in users %}
     *    <li>{{ user.username|e }}</li>
     *  {% endfor %}
     * </ul>
     * </pre>
     */

    class TwingTokenParserSpaceless extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        decideSpacelessEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeExpressionBinaryMul extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryDiv extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryFloorDiv extends TwingNodeExpressionBinaryDiv {
        compile(compiler: TwingCompiler): void;

        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryMod extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinarySub extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryAdd extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingTokenParserUse extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        getTag(): string;
    }

    class TwingNodeEmbed extends TwingNodeInclude {
        constructor(name: string, index: string, variables: TwingNodeExpression, only: boolean, ignoreMissing: boolean, lineno: number, tag?: string);

        addGetTemplate(compiler: TwingCompiler): void;
    }

    class TwingTokenParserEmbed extends TwingTokenParserInclude {
        parse(token: TwingToken): TwingNodeEmbed;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    /**
     * Filters a section of a template by applying filters.
     *
     * <pre>
     * {% filter upper %}
     *  This text becomes uppercase
     * {% endfilter %}
     * </pre>
     */
    class TwingTokenParserFilter extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeExpressionBinaryRange extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingTokenParserImport extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeImport;

        getTag(): string;
    }

    /**
     * Represents a do node.
     *
     * The do tag works exactly like the regular variable expression ({{ ... }}) just that it doesn't print anything:
     * {% do 1 + 2 %}
     *
     * @author Fabien Potencier <fabien@symfony.com>
     * @author Eric Morand <eric.morand@gmail.com>
     */
    class TwingNodeDo extends TwingNode {
        constructor(expr: TwingNodeExpression, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingTokenParserDo extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeDo;

        getTag(): string;
    }

    class TwingNodeFlush extends TwingNode {
        constructor(lineno: number, tag: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingTokenParserFlush extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeFlush;

        getTag(): string;
    }

    class TwingNodeExpressionBinaryEqual extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBinaryNotEqual extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBinaryOr extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;

        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryBitwiseOr extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryBitwiseXor extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryBitwiseAnd extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryGreaterEqual extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryLessEqual extends TwingNodeExpressionBinary {
        operator(compiler: TwingCompiler): TwingCompiler;
    }

    class TwingNodeExpressionBinaryNotIn extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    /**
     * Checks if a variable is defined in the active context.
     *
     * <pre>
     * {# defined works with variable names and variable attributes #}
     * {% if foo is defined %}
     *     {# ... #}
     * {% endif %}
     * </pre>
     */
    class TwingNodeExpressionTestDefined extends TwingNodeExpressionTest {
        constructor(node: TwingNodeExpression, name: string, nodeArguments: TwingNode, lineno: number);

        changeIgnoreStrictCheck(node: TwingNodeExpression): void;

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionTestNull extends TwingNodeExpressionTest {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionNullCoalesce extends TwingNodeExpressionConditional {
        constructor(left: TwingNodeExpression, right: TwingNodeExpression, lineno: number);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBinaryPower extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionTestSameAs extends TwingNodeExpressionTest {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionTestOdd extends TwingNodeExpressionTest {
        compile(compiler: TwingCompiler): void;
    }

    /**
     * Checks if a variable is the exact same value as a constant.
     *
     * <pre>
     *  {% if post.status is constant('Post::PUBLISHED') %}
     *    the status attribute is exactly the same as Post::PUBLISHED
     *  {% endif %}
     * </pre>
     *
     * Global or class constants make no sense in JavaScript. To emulate the expected behavior, it is assumed that
     * so-called constants are keys of the TwingEnvironment::globals property.
     */
    class TwingNodeExpressionTestConstant extends TwingNodeExpressionTest {
        compile(compiler: TwingCompiler): void;
    }

    /**
     * Checks if a variable is divisible by a number.
     *
     * <pre>
     *  {% if loop.index is divisible by(3) %}
     * </pre>
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingNodeExpressionTestDivisibleBy extends TwingNodeExpressionTest {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBinaryMatches extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBinaryStartsWith extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionBinaryEndsWith extends TwingNodeExpressionBinary {
        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionFilterDefault extends TwingNodeExpressionFilter {
        constructor(node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeExpressionTestEven extends TwingNodeExpressionTest {
        compile(compiler: TwingCompiler): void;
    }

    function min(...things: Array<any>): any;

    function max(...things: Array<any>): any;

    function isTraversable(value: any): boolean;

    /**
     * Proxy for Math.abs
     *
     * @param {number} x
     * @returns {number}
     */
    function abs(x: number): number;

    function jsonEncode(value: any): string;

    /// <reference types="node" />
    /**
     * Convert string to requested character encoding
     * @link http://php.net/manual/en/function.iconv.php
     * @param {string} inCharset The input charset.
     * @param {string} outCharset The output charset.
     * @param {string} str The string to be converted.
     *
     * @returns {string} the converted string or false on failure.
     */
    function iconv(inCharset: string, outCharset: string, str: string): Buffer;

    function iteratorToArray(value: any, useKeys?: boolean): Array<any>;

    /**
     *
     * @param {TwingEnvironment} env
     * @param {"luxon".luxon.DateTime} date
     * @param {string} format
     * @returns {string}
     */
    function formatDateTime(date: DateTime, format?: string): string;

    /**
     *
     * @param {"luxon".luxon.Interval} interval
     * @param {string} format
     * @returns {string} The formatted interval.
     *
     * @see http://php.net/manual/en/dateinterval.format.php
     */
    function formatDateInterval(interval: Interval, format: string): string;

    function iteratorToHash(value: any): any;

    /**
     * Compare an array to something else by conforming to PHP loose comparisons rules
     * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
     * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
     * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
     * │ []      │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ FALSE |
     * │ ["php"] │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE    │ FALSE │ FALSE |
     * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
     */
    function twingCompareArray(value: Array<any>, compare: any): boolean;

    /**
     * Compare a string to something else by conforming to PHP loose comparisons rules
     * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
     * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
     * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
     * │ "1"     │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │
     * │ "0"     │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │
     * │ "-1"    │ TRUE  │ FALSE │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE   │ FALSE │ FALSE │
     * │ ""      │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ FALSE   │ FALSE │ TRUE  │
     * │ "php"   │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE │ FALSE   │ TRUE  │ FALSE │
     * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
     */
    function twingCompareString(value: string, compare: any): boolean;

    /**
     * Compare a number to something else by conforming to PHP loose comparisons rules
     * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
     * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
     * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
     * │ 1       │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE   │ FALSE │ FALSE │
     * │ 0       │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE   │ TRUE  │ TRUE  │
     * │ -1      │ TRUE  │ FALSE │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ FALSE   │ FALSE │ FALSE │
     * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
     */
    function twingCompareNumber(value: number, compare: any): boolean;

    /**
     * Compare a boolean to something else by conforming to PHP loose comparisons rules
     * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
     * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ array() │ "php" │  ""   │
     * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────── ─┼───────┼───────┤
     * │ TRUE    │ TRUE  │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE   │ TRUE  │ FALSE │
     * │ FALSE   │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ TRUE  │ FALSE │ TRUE  │ TRUE    │ FALSE │ TRUE  │
     * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
     */
    function twingCompareToBoolean(value: boolean, compare: any): boolean;

    /// <reference types="luxon" />
    /**
     * Compare a DateTime to something else by conforming to PHP loose comparisons rules
     * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
     * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
     * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
     * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
     */
    function twingCompareToDateTime(value: DateTime, compare: any): boolean;

    /**
     * Compare null to something else by conforming to PHP loose comparisons rules
     * ┌─────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┬─────────┬───────┬───────┐
     * │         │ TRUE  │ FALSE │   1   │   0   │  -1   │  "1"  │  "0"  │ "-1"  │ NULL  │ []    │ ["php"] | "php" │  ""   │
     * ├─────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┼─────────┼───────┼───────┤
     * │ NULL    │ FALSE │ TRUE  │ FALSE │ TRUE  │ FALSE │ FALSE │ FALSE │ FALSE │ TRUE  │ TRUE  │ FALSE   │ FALSE │ TRUE  |
     * └─────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┴─────────┴───────┴───────┘
     */
    function twingCompareToNull(value: any): boolean;

    function twingCompare(firstOperand: any, secondOperand: any): boolean;

    /**
     * Interfaces that all security policy classes must implements.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    interface TwingSandboxSecurityPolicyInterface {
        checkSecurity(tags: Array<string>, filters: Array<string>, functions: Array<string>): void;

        checkMethodAllowed(method: Function): void;

        checkPropertyAllowed(obj: any, method: string): void;
    }

    class TwingNodeSandbox extends TwingNode {
        constructor(body: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingTokenParserSandbox extends TwingTokenParser {
        parse(token: TwingToken): TwingNodeSandbox;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingNodeSandboxedPrint extends TwingNodePrint {
        compile(compiler: TwingCompiler): void;

        /**
         * Removes node filters.
         *
         * This is mostly needed when another visitor adds filters (like the escaper one).
         *
         * @returns {TwingNode}
         */
        private removeNodeFilter(node);
    }

    class TwingNodeCheckSecurity extends TwingNode {
        private usedFilters;
        private usedTags;
        private usedFunctions;

        constructor(usedFilters: TwingMap<string, TwingNode>, usedTags: TwingMap<string, TwingNode>, usedFunctions: TwingMap<string, TwingNode>);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeVisitorSandbox extends TwingBaseNodeVisitor {
        private inAModule;
        private tags;
        private filters;
        private functions;

        doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        getPriority(): number;
    }

    class TwingExtensionSandbox extends TwingExtension {
        private sandboxedGlobally;
        private sandboxed;
        private policy;

        constructor(policy: TwingSandboxSecurityPolicyInterface, sandboxed?: boolean);

        getTokenParsers(): TwingTokenParserSandbox[];

        getNodeVisitors(): TwingNodeVisitorSandbox[];

        enableSandbox(): void;

        disableSandbox(): void;

        isSandboxed(): boolean;

        isSandboxedGlobally(): boolean;

        setSecurityPolicy(policy: TwingSandboxSecurityPolicyInterface): void;

        getSecurityPolicy(): TwingSandboxSecurityPolicyInterface;

        checkSecurity(tags: Array<string>, filters: Array<string>, functions: Array<string>): void;

        checkMethodAllowed(method: Function): void;

        checkPropertyAllowed(obj: any, method: string): void;

        ensureToStringAllowed(obj: any): any;
    }

    /**
     * Exception thrown when an error occurs during template loading.
     *
     * Automatic template information guessing is always turned off as
     * if a template cannot be loaded, there is nothing to guess.
     * However, when a template is loaded from another one, then, we need
     * to find the current context and this is automatically done by
     * Twig_Template::displayWithErrorHandling().
     *
     * This strategy makes Twig_Environment::resolveTemplate() much faster.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingErrorLoader extends TwingError {
        constructor(message: string, lineno?: number, source?: TwingSource | string | null, previous?: Error);
    }

    function defined(constant: string): boolean;

    class TwingMarkup {
        private content;
        private charset;

        constructor(content: string, charset: string);

        toString(): string;

        count(): number;

        toJSON(): string;
    }

    /**
     * Escapes a string.
     *
     * Implemented as a helper since it's needed by the test suite. May change in the future.
     *
     * @param TwingEnvironment $env
     * @param mixed            $string     The value to be escaped
     * @param string           $strategy   The escaping strategy
     * @param string           $charset    The charset
     * @param bool             $autoescape Whether the function is called by the auto-escaping feature (true) or by the developer (false)
     *
     * @returns {string}
     */
    function escape(env: TwingEnvironment, string: any, strategy?: string, charset?: string, autoescape?: boolean): any;

    function twingRange(low: any, high: any, step: number): any;

    function relativeDate(date: string): DateTime;

    class TwingExtensionCore extends TwingExtension {
        private dateFormats;
        private numberFormat;
        private timezone;
        private escapers;

        /**
         * Defines a new escaper to be used via the escape filter.
         *
         * @param {string} strategy     The strategy name that should be used as a strategy in the escape call
         * @param {Function} callable   A valid PHP callable
         */
        setEscaper(strategy: string, callable: Function): void;

        /**
         * Gets all defined escapers.
         *
         * @returns {TwingMap<string, Function>}
         */
        getEscapers(): TwingMap<string, Function>;

        /**
         * Sets the default format to be used by the date filter.
         *
         * @param {string} format The default date format string
         * @param {string} dateIntervalFormat The default date interval format string
         */
        setDateFormat(format?: string, dateIntervalFormat?: string): void;

        /**
         * Gets the default format to be used by the date filter.
         *
         * @return array The default date format string and the default date interval format string
         */
        getDateFormat(): string[];

        /**
         * Sets the default timezone to be used by the date filter.
         *
         * @param {string} timezone The default timezone string or a TwingDateTimeZone object
         */
        setTimezone(timezone: string): void;

        /**
         * Gets the default timezone to be used by the date filter.
         *
         * @returns {string} The default timezone currently in use
         */
        getTimezone(): string;

        /**
         * Sets the default format to be used by the number_format filter.
         *
         * @param {number} decimal the number of decimal places to use
         * @param {string} decimalPoint the character(s) to use for the decimal point
         * @param {string} thousandSep  the character(s) to use for the thousands separator
         */
        setNumberFormat(decimal: number, decimalPoint: string, thousandSep: string): void;

        /**
         * Get the default format used by the number_format filter.
         *
         * @return array The arguments for number_format()
         */
        getNumberFormat(): (string | number)[];

        getTokenParsers(): (TwingTokenParserFor | TwingTokenParserExtends | TwingTokenParserFrom | TwingTokenParserMacro | TwingTokenParserIf | TwingTokenParserSet | TwingTokenParserBlock | TwingTokenParserInclude | TwingTokenParserWith | TwingTokenParserSpaceless | TwingTokenParserUse | TwingTokenParserFilter | TwingTokenParserImport | TwingTokenParserDo | TwingTokenParserFlush)[];

        getFilters(): TwingFilter[];

        getFunctions(): Array<TwingFunction>;

        getTests(): Array<TwingTest>;

        getOperators(): {
            unary: Map<string, TwingOperatorDefinitionInterface>;
            binary: Map<string, TwingOperatorDefinitionInterface>;
        };
    }

    /**
     * Cycles over a value.
     *
     * @param {Array} values
     * @param {number} position The cycle position
     *
     * @returns {string} The next value in the cycle
     */
    function twingCycle(values: Array<any>, position: number): any;

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
    function twingRandom(env: TwingEnvironment, values?: any): any;

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
    function twingDateFormatFilter(env: TwingEnvironment, date: DateTime | Interval | string, format?: string, timezone?: string | null | false): string;

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
    function twingDateModifyFilter(env: TwingEnvironment, date: Date | DateTime | Interval | string, modifier?: string): DateTime;

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
    function twingDateConverter(env: TwingEnvironment, date: Date | DateTime | Interval | number | string, timezone?: string | null | false): DateTime | Interval;

    /**
     * Replaces strings within a string.
     *
     * @param {string} str  String to replace in
     * @param {Array<string>|Map<string, string>} from Replace values
     *
     * @returns {string}
     */
    function twingReplaceFilter(str: string, from: any): any;

    /**
     * Rounds a number.
     *
     * @param value The value to round
     * @param {number} precision The rounding precision
     * @param {string} method The method to use for rounding
     *
     * @returns int|float The rounded number
     */
    function twingRound(value: any, precision?: number, method?: string): any;

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
    function twingNumberFormatFilter(env: TwingEnvironment, number: any, decimal: number, decimalPoint: string, thousandSep: string): any;

    /**
     * URL encodes (RFC 3986) a string as a path segment or a hash as a query string.
     *
     * @param {string|{}} url A URL or a hash of query parameters
     *
     * @returns {string} The URL encoded value
     */
    function twingUrlencodeFilter(url: string | {}): string;

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
    function twingArrayMerge(arr1: any, arr2: any): any;

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
    function twingSlice(env: TwingEnvironment, item: any, start: number, length?: number, preserveKeys?: boolean): string | TwingMap<any, any>;

    /**
     * Returns the first element of the item.
     *
     * @param {TwingEnvironment} env
     * @param {*} item A variable
     *
     * @returns {*} The first element of the item
     */
    function twingFirst(env: TwingEnvironment, item: any): any;

    /**
     * Returns the last element of the item.
     *
     * @param {TwingEnvironment} env
     * @param item A variable
     *
     * @returns The last element of the item
     */
    function twingLast(env: TwingEnvironment, item: any): any;

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
    function twingJoinFilter(value: Array<any>, glue?: string): string;

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
    function twingSplitFilter(env: TwingEnvironment, value: string, delimiter: string, limit: number): any;

    /**
     * @internal
     */
    function twingDefaultFilter(value: any, defaultValue?: any): any;

    /**
     * Reverses a variable.
     *
     * @param {TwingEnvironment} env
     * @param item An array, a Traversable instance, or a string
     * @param {boolean} preserveKeys Whether to preserve key or not
     *
     * @returns The reversed input
     */
    function twingReverseFilter(env: TwingEnvironment, item: any, preserveKeys?: boolean): string | TwingMap<any, any>;

    /**
     * Sorts an array.
     *
     * @param {Array<*>} array
     *
     * @returns {TwingMap<*,*>}
     */
    function twingSortFilter(array: Array<any>): TwingMap<any, any>;

    /**
     * @internal
     */
    function twingInFilter(value: any, compare: any): boolean;

    /**
     * Returns a trimmed string.
     *
     * @returns {string}
     *
     * @throws TwingErrorRuntime When an invalid trimming side is used (not a string or not 'left', 'right', or 'both')
     */
    function twingTrimFilter(string: string, characterMask?: string, side?: string): any;

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
    function twingEscapeFilter(env: TwingEnvironment, string: any, strategy?: string, charset?: string, autoescape?: boolean): any;

    /**
     * @internal
     */
    function twingEscapeFilterIsSafe(filterArgs: TwingNode): string[];

    function twingConvertEncoding(string: string, to: string, from: string): Buffer;

    /**
     * Returns the length of a variable.
     *
     * @param {TwingEnvironment} env A TwingEnvironment instance
     * @param thing A variable
     *
     * @returns {number} The length of the value
     */
    function twingLengthFilter(env: TwingEnvironment, thing: any): any;

    /**
     * Converts a string to uppercase.
     *
     * @param {TwingEnvironment} env
     * @param {string} string A string
     *
     * @returns {string} The uppercased string
     */
    function twingUpperFilter(env: TwingEnvironment, string: string): string;

    /**
     * Converts a string to lowercase.
     *
     * @param {TwingEnvironment} env
     * @param {string} string A string
     *
     * @returns {string} The lowercased string
     */
    function twingLowerFilter(env: TwingEnvironment, string: string): string;

    /**
     * Returns a titlecased string.
     *
     * @param {TwingEnvironment} env
     * @param {string} string A string
     *
     * @returns {string} The titlecased string
     */
    function twingTitleStringFilter(env: TwingEnvironment, string: string): any;

    /**
     * Returns a capitalized string.
     *
     * @param {TwingEnvironment} env
     * @param {string} string A string
     *
     * @returns {string} The capitalized string
     */
    function twingCapitalizeStringFilter(env: TwingEnvironment, string: string): any;

    /**
     * @internal
     */
    function twingEnsureTraversable(seq: any): TwingMap<any, any>;

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
    function twingTestEmpty(value: any): boolean;

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
    function twingTestIterable(value: any): boolean;

    /**
     * Returns a template content without rendering it.
     *
     * @param {TwingEnvironment} env
     * @param {string} name The template name
     * @param {boolean} ignoreMissing Whether to ignore missing templates or not
     *
     * @return string The template source
     */
    function twingSource(env: TwingEnvironment, name: string, ignoreMissing?: boolean): string;

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
    function twingConstant(env: TwingEnvironment, constant: string, object: any): any;

    /**
     * Batches item.
     *
     * @param {Array} items An array of items
     * @param {number} size  The size of the batch
     * @param fill A value used to fill missing items
     *
     * @returns Array<any>
     */
    function twingArrayBatch(items: Array<any>, size: number, fill?: any): Array<TwingMap<any, any>>;

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
    function twingGetAttribute(env: TwingEnvironment, source: TwingSource, object: any, item: any, _arguments?: Array<any>, type?: string, isDefinedTest?: boolean, ignoreStrictCheck?: boolean): any;

    interface TwingLoaderInterface {
        /**
         * Returns the source context for a given template logical name.
         *
         * @param string $name The template logical name
         *
         * @return TwingSource
         *
         * @throws Twig_Error_Loader When $name is not found
         */
        getSourceContext(name: string): TwingSource;

        /**
         * Gets the cache key to use for the cache for a given template name.
         *
         * @param string $name The name of the template to load
         *
         * @return string The cache key
         *
         * @throws Twig_Error_Loader When $name is not found
         */
        getCacheKey(name: string): string;

        /**
         * Returns true if the template is still fresh.
         *
         * @param string $name The template name
         * @param int    $time Timestamp of the last modification time of the
         *                     cached template
         *
         * @return bool true if the template is fresh, false otherwise
         *
         * @throws Twig_Error_Loader When $name is not found
         */
        isFresh(name: string, time: number): boolean;

        /**
         * Check if we have the source code of a template, given its name.
         *
         * @param string $name The name of the template to check if we can load
         *
         * @return bool If the template source code is handled by this loader or not
         */
        exists(name: string): boolean;
    }

    class TwingNodeVisitorSafeAnalysis extends TwingBaseNodeVisitor {
        private data;
        private safeVars;

        setSafeVars(safeVars: Array<any>): void;

        /**
         *
         * @param {TwingNode} node
         * @returns {Array<string>}
         */
        getSafe(node: TwingNode): Array<TwingNode | string | false>;

        setSafe(node: TwingNode, safe: Array<string>): void;

        doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        private intersectSafe(a?, b?);

        getPriority(): number;
    }

    /**
     * Represents an autoescape node.
     *
     * The value is the escaping strategy (can be html, js, ...)
     *
     * The true value is equivalent to html.
     *
     * If autoescaping is disabled, then the value is false.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingNodeAutoEscape extends TwingNode {
        constructor(value: {}, body: TwingNode, lineno: number, tag?: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingNodeVisitorEscaper extends TwingBaseNodeVisitor {
        private statusStack;
        private blocks;
        private safeAnalysis;
        private traverser;
        private defaultStrategy;
        private safeVars;

        constructor();

        doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        private escapePrintNode(node, env, type);

        private preEscapeFilterNode(filter, env);

        private isSafeFor(type, expression, env);

        /**
         *
         * @param {TwingEnvironment} env
         * @returns string | Function | false
         */
        needEscaping(env: TwingEnvironment): string | false | Function | TwingNode;

        private getEscaperFilter(type, node);

        getPriority(): number;
    }

    /**
     * Loops over each item of a sequence.
     *
     * <pre>
     * <ul>
     *  {% for user in users %}
     *    <li>{{ user.username|e }}</li>
     *  {% endfor %}
     * </ul>
     * </pre>
     */

    class TwingTokenParserAutoEscape extends TwingTokenParser {
        parse(token: TwingToken): TwingNode;

        decideBlockEnd(token: TwingToken): boolean;

        getTag(): string;
    }

    class TwingFileExtensionEscapingStrategy {
        /**
         * Guesses the best autoescaping strategy based on the file name.
         *
         * @param {string} name The template name
         *
         * @return string | Function | false The escaping strategy to use or false to disable
         */
        static guess(name: string): false | "html" | "js" | "css";
    }

    class TwingExtensionEscaper extends TwingExtension {
        private defaultStrategy;

        /**
         * @param {string} defaultStrategy An escaping strategy
         */
        constructor(defaultStrategy?: string | boolean | Function);

        getTokenParsers(): TwingTokenParserAutoEscape[];

        getNodeVisitors(): TwingNodeVisitorEscaper[];

        getFilters(): TwingFilter[];

        /**
         * Sets the default strategy to use when not defined by the user.
         *
         * The strategy can be a valid PHP callback that takes the template
         * name as an argument and returns the strategy to use.
         *
         * @param {string|boolean|Function} defaultStrategy An escaping strategy
         */
        setDefaultStrategy(defaultStrategy: string | boolean | Function): void;

        /**
         * Gets the default strategy to use when not defined by the user.
         *
         * @param {string|boolean} name The template name
         *
         * @returns {string|false} The default strategy to use for the template
         */
        getDefaultStrategy(name: string | boolean): string;
    }

    /**
     * Marks a variable as being safe.
     *
     * @param string $string A PHP variable
     *
     * @return string
     */
    function twingRawFilter(value: string): string;

    interface TwingCacheInterface {
        /**
         * Generates a cache key for the given template class name.
         *
         * @param {string} name The template name
         * @param {string} className The template class name
         *
         * @return string
         */
        generateKey(name: string, className: string): string;

        /**
         * Writes the compiled template to cache.
         *
         * @param {string} key The cache key
         * @param {string} content The template representation as a PHP class
         */
        write(key: string, content: string): void;

        /**
         * Loads a template from the cache.
         *
         * @param {string} key The cache key
         */
        load(key: string): void;

        /**
         * Returns the modification timestamp of a key.
         *
         * @param {string} key The cache key
         *
         * @returns {number}
         */
        getTimestamp(key: string): number;
    }

    /**
     *  * Available options:
     *
     *  * debug: When set to true, it automatically set "auto_reload" to true as
     *           well (default to false).
     *
     *  * charset: The charset used by the templates (default to UTF-8).
     *
     *  * base_template_class: The base template class to use for generated
     *                         templates (default to Twig_Template).
     *
     *  * cache: An absolute path where to store the compiled templates,
     *           a TwingCacheInterface implementation,
     *           or false to disable compilation cache (default).
     *
     *  * auto_reload: Whether to reload the template if the original source changed.
     *                 If you don't provide the auto_reload option, it will be
     *                 determined automatically based on the debug value.
     *
     *  * strict_variables: Whether to ignore invalid variables in templates
     *                      (default to false).
     *
     *  * autoescape: Whether to enable auto-escaping (default to html):
     *                  * false: disable auto-escaping
     *                  * html, js: set the autoescaping to one of the supported strategies
     *                  * name: set the autoescaping strategy based on the template name extension
     *                  * PHP callback: a PHP callback that returns an escaping strategy based on the template "name"
     *
     *  * optimizations: A flag that indicates which optimizations to apply
     *                   (default to -1 which means that all optimizations are enabled;
     *                   set it to 0 to disable).
     */

    type TwingEnvironmentOptions = {
        debug?: boolean;
        charset?: string;
        base_template_class?: string;
        cache?: TwingCacheInterface | string | false;
        auto_reload?: boolean;
        strict_variables?: boolean;
        autoescape?: string | boolean | Function;
        optimizations?: number;
    };

    /**
     * Loads template from the filesystem.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     * @author Eric MORAND <eric.morand@gmail.com>
     */
    class TwingLoaderArray implements TwingLoaderInterface {
        private templates;

        constructor(templates: any);

        setTemplate(name: string, template: string): void;

        getSourceContext(name: string): TwingSource;

        exists(name: string | number): boolean;

        getCacheKey(name: string): string;

        isFresh(name: string, time: number): boolean;
    }

    /**
     * Loads templates from other loaders.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingLoaderChain implements TwingLoaderInterface {
        private hasSourceCache;
        private loaders;

        /**
         * @param {Array<TwingLoaderInterface>} loaders
         */
        constructor(loaders?: Array<TwingLoaderInterface>);

        addLoader(loader: TwingLoaderInterface): void;

        getSourceContext(name: string): TwingSource;

        exists(name: string): any;

        getCacheKey(name: string): string;

        isFresh(name: string, time: number): boolean;
    }

    /**
     * Twig_NodeVisitor_Optimizer tries to optimizes the AST.
     *
     * This visitor is always the last registered one.
     *
     * You can configure which optimizations you want to activate via the
     * optimizer mode.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingNodeVisitorOptimizer extends TwingBaseNodeVisitor {
        readonly OPTIMIZE_ALL: number;
        readonly OPTIMIZE_NONE: number;
        readonly OPTIMIZE_FOR: number;
        readonly OPTIMIZE_RAW_FILTER: number;
        readonly OPTIMIZE_VAR_ACCESS: number;
        private loops;
        private loopsTargets;
        private optimizers;

        /**
         * @param {number} optimizers The optimizer mode
         */
        constructor(optimizers?: number);

        doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Optimizes print nodes.
         *
         * It replaces:
         *
         *   * "echo this.render(Parent)Block()" with "this.display(Parent)Block()"
         *
         * @returns {TwingNode}
         */
        optimizePrintNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Removes "raw" filters.
         *
         * @returns {TwingNode}
         */
        optimizeRawFilter(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Optimizes "for" tag by removing the "loop" variable creation whenever possible.
         */
        enterOptimizeFor(node: TwingNode, env: TwingEnvironment): void;

        /**
         * Optimizes "for" tag by removing the "loop" variable creation whenever possible.
         */
        leaveOptimizeFor(node: TwingNode, env: TwingEnvironment): void;

        addLoopToCurrent(): void;

        addLoopToAll(): void;

        getPriority(): number;
    }

    class TwingExtensionOptimizer extends TwingExtension {
        private optimizers;

        constructor(optimizers?: number);

        getNodeVisitors(): TwingNodeVisitorInterface[];
    }

    abstract class TwingCache implements TwingCacheInterface {
        generateKey(name: string, className: string): string;

        write(key: string, content: string): void;

        load(key: string): any;

        getTimestamp(key: string): number;
    }

    /**
     * Implements a no-cache strategy.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingCacheNull extends TwingCache {
        generateKey(name: string, className: string): string;

        write(key: string, content: string): void;

        load(key: string): void;

        getTimestamp(key: string): number;
    }

    /**
     * Implements a cache on the filesystem.
     *
     * @author Andrew Tch <andrew@noop.lv>
     */
    class TwingCacheFilesystem extends TwingCache {
        readonly FORCE_BYTECODE_INVALIDATION: number;
        private directory;
        private options;

        /**
         * @param directory {string} The root cache directory
         * @param options {number} A set of options
         */
        constructor(directory: string, options?: number);

        generateKey(name: string, className: string): any;

        load(key: string): any;

        write(key: string, content: string): void;

        getTimestamp(key: string): any;
    }

    /**
     * Creates runtime implementations for Twig elements (filters/functions/tests).
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    abstract class TwingRuntimeLoaderInterface {
        /**
         * Creates the runtime implementation of a Twing element (filter/function/test).
         *
         * @param {string} class_ A runtime class
         *
         * @return {{}|null} The runtime instance or null if the loader does not know how to create the runtime for this class
         */
        abstract load(class_: string): any | null;
    }

    class TwingEnvironment {
        private charset;
        private loader;
        private debug;
        private autoReload;
        private cache;
        private lexer;
        private parser;
        private baseTemplateClass;
        private globals;
        private resolvedGlobals;
        private loadedTemplates;
        private strictVariables;
        private templateClassPrefix;
        private originalCache;
        private extensionSet;
        private runtimeLoaders;
        private runtimes;
        private optionsHash;
        private loading;

        /**
         * Constructor.
         *
         * @param {TwingLoaderInterface} loader
         * @param {TwingEnvironmentOptions} options
         */
        constructor(loader: TwingLoaderInterface, options?: TwingEnvironmentOptions);

        /**
         *
         * @returns {TwingExtensionCore}
         */
        getCoreExtension(): TwingExtensionCore;

        /**
         * Gets the base template class for compiled templates.
         *
         * @returns {string} The base template class name
         */
        getBaseTemplateClass(): string;

        /**
         * Sets the base template class for compiled templates.
         *
         * @param {string} templateClass The base template class name
         */
        setBaseTemplateClass(templateClass: string): void;

        /**
         * Enables debugging mode.
         */
        enableDebug(): void;

        /**
         * Disables debugging mode.
         */
        disableDebug(): void;

        /**
         * Checks if debug mode is enabled.
         *
         * @returns {boolean} true if debug mode is enabled, false otherwise
         */
        isDebug(): boolean;

        /**
         * Enables the auto_reload option.
         */
        enableAutoReload(): void;

        /**
         * Disables the auto_reload option.
         */
        disableAutoReload(): void;

        /**
         * Checks if the auto_reload option is enabled.
         *
         * @returns {boolean} true if auto_reload is enabled, false otherwise
         */
        isAutoReload(): boolean;

        /**
         * Enables the strict_variables option.
         */
        enableStrictVariables(): void;

        /**
         * Disables the strict_variables option.
         */
        disableStrictVariables(): void;

        /**
         * Checks if the strict_variables option is enabled.
         *
         * @returns {boolean} true if strict_variables is enabled, false otherwise
         */
        isStrictVariables(): boolean;

        /**
         * Gets the active cache implementation.
         *
         * @param {boolean} original Whether to return the original cache option or the real cache instance
         *
         * @returns {TwingCacheInterface|string|false} A TwingCacheInterface implementation,
         *                                                an absolute path to the compiled templates,
         *                                                or false to disable cache
         */
        getCache(original?: boolean): TwingCacheInterface | string | false;

        /**
         * Sets the active cache implementation.
         *
         * @param {TwingCacheInterface|string|false} cache A TwingCacheInterface implementation,
         *                                                an absolute path to the compiled templates,
         *                                                or false to disable cache
         */
        setCache(cache: TwingCacheInterface | string | false): void;

        /**
         * Gets the template class associated with the given string.
         *
         * The generated template class is based on the following parameters:
         *
         *  * The cache key for the given template;
         *  * The currently enabled extensions;
         *  * Whether the Twig C extension is available or not;
         *  * PHP version;
         *  * Twig version;
         *  * Options with what environment was created.
         *
         * @param {string} name The name for which to calculate the template class name
         * @param {number|null} index The index if it is an embedded template
         *
         * @return string The template class name
         */
        getTemplateClass(name: string, index?: number): string;

        /**
         * Renders a template.
         *
         * @param {string} name The template name
         * @param {{}} context An array of parameters to pass to the template
         * @returns {Promise<string>}
         */
        render(name: string, context?: any): Promise<string>;

        /**
         * Displays a template.
         *
         * @param {string} name The template name
         * @param {{}} context An array of parameters to pass to the template
         *
         * @throws TwingErrorLoader  When the template cannot be found
         * @throws TwingErrorSyntax  When an error occurred during compilation
         * @throws TwingErrorRuntime When an error occurred during rendering
         */
        display(name: string, context?: any): Promise<void>;

        /**
         * Loads a template.
         *
         * @param {string | TwingTemplateWrapper | TwingTemplate} name The template name
         *
         * @throws {TwingErrorLoader}  When the template cannot be found
         * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
         * @throws {TwingErrorSyntax}  When an error occurred during compilation
         *
         * @returns {TwingTemplateWrapper}
         */
        load(name: string | TwingTemplateWrapper | TwingTemplate): TwingTemplateWrapper;

        /**
         * Loads a template internal representation.
         *
         * This method is for internal use only and should never be called
         * directly.
         *
         * @param {string} name  The template name
         * @param {number} index The index if it is an embedded template
         *
         * @returns {TwingTemplate} A template instance representing the given template name
         *
         * @throws {TwingErrorLoader}  When the template cannot be found
         * @throws {TwingErrorRuntime} When a previously generated cache is corrupted
         * @throws {TwingErrorSyntax  When an error occurred during compilation
	     *
         * @internal
         */
        loadTemplate(name: string, index?: number): TwingTemplate;

        /**
         * Creates a template from source.
         *
         * This method should not be used as a generic way to load templates.
         *
         * @param {string} template The template name
         *
         * @returns {TwingTemplate} A template instance representing the given template name
         *
         * @throws TwingErrorLoader When the template cannot be found
         * @throws TwingErrorSyntax When an error occurred during compilation
         */
        createTemplate(template: string): TwingTemplate;

        /**
         * Returns true if the template is still fresh.
         *
         * @param {string} name The template name
         * @param {number} time The last modification time of the cached template
         *
         * @returns {boolean} true if the template is fresh, false otherwise
         */
        isTemplateFresh(name: string, time: number): boolean;

        /**
         * Tries to load a template consecutively from an array.
         *
         * Similar to loadTemplate() but it also accepts TwingTemplate instances and an array
         * of templates where each is tried to be loaded.
         *
         * @param {string|TwingTemplate|Array<string|TwingTemplate>} names A template or an array of templates to try consecutively
         *
         * @returns {TwingTemplate|TwingTemplateWrapper}
         *
         * @throws {TwingErrorLoader} When none of the templates can be found
         * @throws {TwingErrorSyntax} When an error occurred during compilation
         */
        resolveTemplate(names: string | TwingTemplate | TwingTemplateWrapper | Array<string | TwingTemplate>): TwingTemplate | TwingTemplateWrapper;

        setLexer(lexer: TwingLexer): void;

        /**
         * Tokenizes a source code.
         *
         * @param {TwingSource} source The source to tokenize
         * @returns {TwingTokenStream}
         *
         * @throws {TwingErrorSyntax} When the code is syntactically wrong
         */
        tokenize(source: TwingSource): TwingTokenStream;

        setParser(parser: TwingParser): void;

        /**
         * Converts a token stream to a template.
         *
         * @param {TwingTokenStream} stream
         * @returns {TwingNodeModule}
         *
         * @throws {TwingErrorSyntax} When the token stream is syntactically or semantically wrong
         */
        parse(stream: TwingTokenStream): TwingNodeModule;

        /**
         * Compiles a node and returns its compiled templates.
         *
         * @returns { Map<number, TwingTemplate> } The compiled templates
         */
        compile(node: TwingNode): string;

        /**
         *
         * @param {TwingSource} source
         * @returns {Map<number, TwingTemplate> }
         */
        compileSource(source: TwingSource): string;

        setLoader(loader: TwingLoaderInterface): void;

        /**
         * Gets the Loader instance.
         *
         * @return TwingLoaderInterface
         */
        getLoader(): TwingLoaderInterface;

        /**
         * Sets the default template charset.
         *
         * @param {string} charset The default charset
         */
        setCharset(charset: string): void;

        /**
         * Gets the default template charset.
         *
         * @return {string} The default charset
         */
        getCharset(): string;

        /**
         * Returns true if the given extension is registered.
         *
         * @param {string} name
         * @returns {boolean}
         */
        hasExtension(name: string): boolean;

        /**
         * Adds a runtime loader.
         */
        addRuntimeLoader(loader: TwingRuntimeLoaderInterface): void;

        /**
         * Gets an extension by name.
         *
         * @param {string} name
         * @returns {TwingExtensionInterface}
         */
        getExtension(name: string): TwingExtensionInterface;

        /**
         * Returns the runtime implementation of a Twig element (filter/function/test).
         *
         * @param {string} class_ A runtime class name
         *
         * @returns {{}} The runtime implementation
         *
         * @throws TwimgErrorRuntime When the template cannot be found
         */
        getRuntime(class_: string): any;

        addExtension(extension: TwingExtensionInterface): void;

        /**
         * Registers an array of extensions.
         *
         * @param {Array<TwingExtensionInterface>} extensions An array of extensions
         */
        setExtensions(extensions: Array<TwingExtensionInterface>): void;

        /**
         * Returns all registered extensions.
         *
         * @returns Array<TwingExtensionInterface> An array of extensions (keys are for internal usage only and should not be relied on)
         */
        getExtensions(): Map<string, TwingExtensionInterface>;

        addTokenParser(parser: TwingTokenParserInterface): void;

        /**
         * Gets the registered Token Parsers.
         *
         * @returns {Array<TwingTokenParserInterface>}
         *
         * @internal
         */
        getTokenParsers(): TwingTokenParserInterface[];

        /**
         * Gets registered tags.
         *
         * @return Map<string, TwingTokenParserInterface>
         *
         * @internal
         */
        getTags(): Map<string, TwingTokenParserInterface>;

        addNodeVisitor(visitor: TwingNodeVisitorInterface): void;

        /**
         * Gets the registered Node Visitors.
         *
         * @returns {Array<TwingNodeVisitorInterface>}
         *
         * @internal
         */
        getNodeVisitors(): TwingNodeVisitorInterface[];

        addFilter(filter: TwingFilter): void;

        /**
         * Get a filter by name.
         *
         * Subclasses may override this method and load filters differently;
         * so no list of filters is available.
         *
         * @param string name The filter name
         *
         * @return Twig_Filter|false A Twig_Filter instance or null if the filter does not exist
         *
         * @internal
         */
        getFilter(name: string): TwingFilter;

        registerUndefinedFilterCallback(callable: Function): void;

        /**
         * Gets the registered Filters.
         *
         * Be warned that this method cannot return filters defined with registerUndefinedFilterCallback.
         *
         * @return Twig_Filter[]
         *
         * @see registerUndefinedFilterCallback
         *
         * @internal
         */
        getFilters(): Map<string, TwingFilter>;

        /**
         * Registers a Test.
         *
         * @param {TwingTest} test
         */
        addTest(test: TwingTest): void;

        /**
         * Gets the registered Tests.
         *
         * @returns {TwingMap<string, TwingTest>}
         */
        getTests(): TwingMap<string, TwingTest>;

        /**
         * Gets a test by name.
         *
         * @param {string} name The test name
         * @returns {TwingTest} A TwingTest instance or null if the test does not exist
         */
        getTest(name: string): TwingTest;

        addFunction(aFunction: TwingFunction): void;

        /**
         * Get a function by name.
         *
         * Subclasses may override this method and load functions differently;
         * so no list of functions is available.
         *
         * @param {string} name function name
         *
         * @returns {TwingFunction} A TwingFunction instance or null if the function does not exist
         *
         * @internal
         */
        getFunction(name: string): TwingFunction;

        registerUndefinedFunctionCallback(callable: Function): void;

        /**
         * Gets registered functions.
         *
         * Be warned that this method cannot return functions defined with registerUndefinedFunctionCallback.
         *
         * @return Twig_Function[]
         *
         * @see registerUndefinedFunctionCallback
         *
         * @internal
         */
        getFunctions(): TwingMap<string, TwingFunction>;

        /**
         * Registers a Global.
         *
         * New globals can be added before compiling or rendering a template;
         * but after, you can only update existing globals.
         *
         * @param {string} name The global name
         * @param value         The global value
         */
        addGlobal(name: string, value: any): void;

        /**
         * Gets the registered Globals.
         *
         * @return array An array of globals
         *
         * @internal
         */
        getGlobals(): {};

        /**
         * Merges a context with the defined globals.
         *
         * @param {TwingMap<*, *>} context
         * @returns {{}}
         */
        mergeGlobals(context: TwingMap<any, any>): TwingMap<any, any>;

        /**
         * Gets the registered unary Operators.
         *
         * @return Map<string, TwingOperator> A map of unary operators
         *
         * @internal
         */
        getUnaryOperators(): Map<string, TwingOperatorDefinitionInterface>;

        /**
         * Gets the registered binary Operators.
         *
         * @return Map<string, TwingOperator> An array of binary operators
         *
         * @internal
         */
        getBinaryOperators(): Map<string, TwingOperatorDefinitionInterface>;

        updateOptionsHash(): void;
    }

    class TwingCompiler {
        private lastLine;
        private source;
        private indentation;
        private env;
        private debugInfo;
        private sourceOffset;
        private sourceLine;

        constructor(env: TwingEnvironment);

        /**
         * Returns the environment instance related to this compiler.
         *
         * @returns TwingEnvironment
         */
        getEnvironment(): TwingEnvironment;

        getSource(): string;

        compile(node: TwingNode, indentation?: number): TwingCompiler;

        subcompile(node: TwingNode, raw?: boolean): any;

        /**
         *
         * @param string
         * @returns
         */
        raw(string: any): TwingCompiler;

        /**
         * Writes a string to the compiled code by adding indentation.
         *
         * @returns {TwingCompiler}
         */
        write(...strings: Array<string>): TwingCompiler;

        /**
         * Adds a quoted string to the compiled code.
         *
         * @param {string} value The string
         *
         * @returns {TwingCompiler}
         */
        string(value: string): TwingCompiler;

        repr(value: any): any;

        /**
         * Adds debugging information.
         *
         * @returns TwingCompiler
         */
        addDebugInfo(node: TwingNode): this;

        getDebugInfo(): TwingMap<string, string>;

        /**
         * Indents the generated code.
         *
         * @param {number} step The number of indentation to add
         *
         * @returns TwingCompiler
         */
        indent(step?: number): this;

        /**
         * Outdents the generated code.
         *
         * @param {number} step The number of indentation to remove
         *
         * @return TwingCompiler
         *
         * @throws Error When trying to outdent too much so the indentation would become negative
         */
        outdent(step?: number): this;

        getVarName(prefix?: string): string;
    }

    interface TwingNodeInterface {
        compile(compiler: TwingCompiler): any;
    }

    class TwingNode implements TwingNodeInterface {
        protected nodes: TwingMap<string, TwingNode>;
        protected attributes: TwingMap<string, any>;
        protected lineno: number;
        protected tag: string;
        protected type: TwingNodeType;
        protected outputType: TwingNodeOutputType;
        private name;

        /**
         * Constructor.
         *
         * The nodes are automatically made available as properties ($this->node).
         * The attributes are automatically made available as array items ($this['name']).
         *
         * @param nodes         Map<string, TwingNode>  A map of named nodes
         * @param attributes    Map<string, {}>         A map of attributes (should not be nodes)
         * @param lineno        number                  The line number
         * @param tag           string                  The tag name associated with the Nodel
         */
        constructor(nodes?: TwingMap<any, any>, attributes?: TwingMap<string, any>, lineno?: number, tag?: string);

        /**
         * @returns {TwingNode}
         */
        clone(): TwingNode;

        toString(indentation?: number): string;

        getType(): TwingNodeType;

        getOutputType(): TwingNodeOutputType;

        static ind: number;

        compile(compiler: TwingCompiler): any;

        getTemplateLine(): number;

        getNodeTag(): string;

        /**
         * @returns booleqn
         */
        hasAttribute(name: string): boolean;

        /**
         *
         * @param {string} name
         * @returns any
         */
        getAttribute(name: string): any;

        /**
         * @param string name
         * @param mixed  value
         */
        setAttribute(name: string, value: any): void;

        removeAttribute(name: string): void;

        /**
         * @return bool
         */
        hasNode(name: any): boolean;

        /**
         * @return TwingNode
         */
        getNode(name: string | number): TwingNode;

        setNode(name: string, node: TwingNode): void;

        removeNode(name: string): void;

        count(): number;

        setTemplateName(name: string): void;

        getTemplateName(): string;

        getNodes(): TwingMap<string, TwingNode>;
    }

    /**
     * Twig_NodeVisitorInterface is the interface the all node visitor classes must implement.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     * @author Eric MORAND <eric.morand@gmail.com>
     */

    interface TwingNodeVisitorInterface {
        /**
         * Called before child nodes are visited.
         *
         * @return Twig_Node The modified node
         */
        enterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Called after child nodes are visited.
         *
         * @return Twig_Node The modified node or null if the node must be removed
         */
        leaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Returns the priority for this visitor.
         *
         * Priority should be between -10 and 10 (0 is the default).
         *
         * @return int The priority level
         */
        getPriority(): number;
    }

    abstract class TwingBaseNodeVisitor implements TwingNodeVisitorInterface {
        getPriority(): number;

        /**
         * Called before child nodes are visited.
         *
         * @returns {TwingNode} The modified node
         */
        enterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Called after child nodes are visited.
         *
         * @returns {TwingNode|false} The modified node or null if the node must be removed
         */
        leaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Called before child nodes are visited.
         *
         * @returns {TwingNode} The modified node
         */
        abstract doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        /**
         * Called after child nodes are visited.
         *
         * @returns {TwingNode|false} The modified node or null if the node must be removed
         */
        abstract doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;
    }

    function varDump(thing: any): string;

    class TwingExtensionDebug extends TwingExtension {
        getFunctions(): TwingFunction[];
    }

    function twingVarDump(env: TwingEnvironment, context: any, ...vars: Array<any>): string;

    class TwingProfilerProfile {
        static ROOT: string;
        static BLOCK: string;
        static TEMPLATE: string;
        static MACRO: string;
        private template;
        private name;
        private type;
        private starts;
        private ends;
        private profiles;
        [Symbol.iterator]: () => IterableIterator<TwingProfilerProfile>;

        constructor(template?: string, type?: string, name?: string);

        getTemplate(): string;

        getType(): string;

        getName(): string;

        isRoot(): boolean;

        isTemplate(): boolean;

        isBlock(): boolean;

        isMacro(): boolean;

        getProfiles(): TwingProfilerProfile[];

        addProfile(profile: TwingProfilerProfile): void;

        /**
         * Returns the duration in microseconds.
         *
         * @return int
         */
        getDuration(): number;

        /**
         * Returns the memory usage in bytes.
         *
         * @return int
         */
        getMemoryUsage(): number;

        /**
         * Returns the peak memory usage in bytes.
         *
         * @return int
         */
        getPeakMemoryUsage(): number;

        /**
         * Starts the profiling.
         */
        enter(): void;

        /**
         * Stops the profiling.
         */
        leave(): void;

        reset(): void;
    }

    /**
     * Represents a profile enter node.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     */
    class TwingProfilerNodeEnterProfile extends TwingNode {
        constructor(extensionName: string, type: string, name: string, varName: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingProfilerNodeLeaveProfile extends TwingNode {
        constructor(varName: string);

        compile(compiler: TwingCompiler): void;
    }

    class TwingProfilerNodeVisitorProfiler extends TwingBaseNodeVisitor {
        private extensionName;

        constructor(extensionName: string);

        doEnterNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        doLeaveNode(node: TwingNode, env: TwingEnvironment): TwingNode;

        getVarName(): string;

        getPriority(): number;
    }

    class TwingExtensionProfiler extends TwingExtension {
        static context: TwingMap<any, any>;
        actives: Array<TwingProfilerProfile>;

        constructor(profile: TwingProfilerProfile);

        enter(profile: TwingProfilerProfile): void;

        leave(profile: TwingProfilerProfile): void;

        getNodeVisitors(): TwingProfilerNodeVisitorProfiler[];
    }

    class TwingExtensionStringLoader extends TwingExtension {
        getFunctions(): TwingFunction[];
    }

    /**
     * Loads a template from a string.
     *
     * <pre>
     * {{ include(template_from_string("Hello {{ name }}")) }}
     * </pre>
     *
     * @param {TwingEnvironment} env A TwingEnvironment instance
     * @param {string} template A template as a string or object implementing toString()
     *
     * @returns TwingTemplate
     */
    function twingTemplateFromString(env: TwingEnvironment, template: string): TwingTemplate;

    /**
     * This helper is mainly used to support TwingNodeExpressionAssignName incomplete assignment syntax
     *
     * @param {TwingMap<*, *>} context
     * @returns {TwingMap<*, *>}
     */
    function getContextProxy(context: TwingMap<any, any>): any;

    function isCountable(thing: any): boolean;

    /**
     *
     * @param {string} input
     * @returns {RegExp}
     */
    function regexParser(input: string): RegExp;

    /**
     * Loads template from the filesystem.
     *
     * @author Fabien Potencier <fabien@symfony.com>
     * @author Eric MORAND <eric.morand@gmail.com>
     */
    class TwingLoaderFilesystem implements TwingLoaderInterface {
        /** Identifier of the main namespace. */
        static MAIN_NAMESPACE: string;
        protected paths: Map<string, Array<string>>;
        protected cache: Map<string, string>;
        protected errorCache: Map<string, string>;
        private rootPath;

        /**
         * @param {string | Array<string>} paths A path or a map of paths where to look for templates
         * @param {string} rootPath The root path common to all relative paths (null for process.cwd())
         */
        constructor(paths?: string | Array<string>, rootPath?: string);

        /**
         * Returns the paths to the templates.
         *
         * @param {string} namespace A path namespace
         *
         * @returns Array<string> The array of paths where to look for templates
         */
        getPaths(namespace?: string): Array<string>;

        /**
         * Returns the path namespaces.
         *
         * The main namespace is always defined.
         *
         * @returns Array<string> The array of defined namespaces
         */
        getNamespaces(): Array<string>;

        /**
         * Sets the paths where templates are stored.
         *
         * @param {string|Array<string>} paths A path or an array of paths where to look for templates
         * @param {string} namespace A path namespace
         */
        setPaths(paths: string | Array<string>, namespace?: string): void;

        /**
         * Adds a path where templates are stored.
         *
         * @param {string} path A path where to look for templates
         * @param {string} namespace A path namespace
         *
         * @throws TwingErrorLoader
         */
        addPath(path: string, namespace?: string): void;

        /**
         * Prepends a path where templates are stored.
         *
         * @param {string} path A path where to look for templates
         * @param {string} namespace A path namespace
         *
         * @throws TwingErrorLoader
         */
        prependPath(path: string, namespace?: string): void;

        getSourceContext(name: string): TwingSource;

        getCacheKey(name: string): string;

        exists(name: string): boolean;

        isFresh(name: string, time: number): boolean;

        /**
         * Checks if the template can be found.
         *
         * @param {string} name  The template name
         * @param {boolean} throw_ Whether to throw an exception when an error occurs
         *
         * @returns {string} The template name or null
         */
        findTemplate(name: string, throw_?: boolean): string;

        normalizeName(name: string): any;

        parseName(name: string, default_?: string): string[];

        validateName(name: string): void;

        private isAbsolutePath(file);
    }

    class TwingSandboxSecurityError extends TwingError {
    }

    class TwingSandboxSecurityNotAllowedFilterError extends TwingSandboxSecurityError {
        private filterName;

        constructor(message: string, functionName: string, lineno?: number, filename?: string, previous?: Error);

        getFilterName(): string;
    }

    class TwingSandboxSecurityNotAllowedFunctionError extends TwingSandboxSecurityError {
        private functionName;

        constructor(message: string, functionName: string, lineno?: number, filename?: string, previous?: Error);

        getFunctionName(): string;
    }

    class TwingSandboxSecurityNotAllowedTagError extends TwingSandboxSecurityError {
        private tagName;

        constructor(message: string, functionName: string, lineno?: number, filename?: string, previous?: Error);

        getTagName(): string;
    }

    class TwingSandboxSecurityPolicy implements TwingSandboxSecurityPolicyInterface {
        private allowedTags;
        private allowedFilters;
        private allowedMethods;
        private allowedProperties;
        private allowedFunctions;

        constructor(allowedTags?: Array<string>, allowedFilters?: Array<string>, allowedMethods?: Array<Function>, allowedProperties?: Array<string>, allowedFunctions?: Array<string>);

        setAllowedMethods(methods: Array<Function>): void;

        checkSecurity(tags: string[], filters: string[], functions: string[]): void;

        checkMethodAllowed(method: Function): void;

        checkPropertyAllowed(obj: any, method: string): void;
    }
}

export = twing;
