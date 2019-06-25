import {TwingCompiler} from "./compiler";

const var_export = require('locutus/php/var/var_export');

export enum TwingNodeType {
    AUTO_ESCAPE = 'auto_escape',
    BLOCK = 'block',
    BLOCK_REFERENCE = 'block_reference',
    BODY = 'body',
    COMMENT = 'comment',
    DEPRECATED = 'deprecated',
    DO = 'do',
    EXPRESSION_ARRAY = 'expression_array',
    EXPRESSION_ASSIGN_NAME = 'expression_assign_name',
    EXPRESSION_BINARY = 'expression_binary',
    EXPRESSION_BINARY_RANGE = 'expression_binary_range',
    EXPRESSION_BLOCK_REFERENCE = 'expression_block_reference',
    EXPRESSION_CONDITIONAL = 'expression_conditional',
    EXPRESSION_CONSTANT = 'expression_constant',
    EXPRESSION_FILTER = 'expression_filter',
    EXPRESSION_FUNCTION = 'expression_function',
    EXPRESSION_GET_ATTR = 'expression_get_attr',
    EXPRESSION_METHOD_CALL = 'expression_method_call',
    EXPRESSION_NAME = 'expression_name',
    EXPRESSION_NULL_COALESCE = 'expression_null_coalesce',
    EXPRESSION_PARENT = 'expression_parent',
    EXPRESSION_TEST = 'expression_test',
    EXPRESSION_UNARY = 'expression_unary',
    EXPRESSION_UNARY_NEG = 'expression_unary_neg',
    EXPRESSION_UNARY_POS = 'expression_unary_pos',
    FLUSH = 'flush',
    FOR = 'for',
    IF = 'if',
    IMPORT = 'import',
    INCLUDE = 'include',
    MACRO = 'macro',
    MODULE = 'module',
    PRINT = 'print',
    PROFILER_ENTER_PROFILE = 'profiler_enter_profile',
    PROFILER_LEAVE_PROFILE = 'profiler_leave_profile',
    SANDBOX = 'sandbox',
    SET = 'set',
    SPACELESS = 'spaceless',
    TEXT = 'text',
    VERBATIM = 'verbatim',
    WITH = 'with'
}

export class TwingNode {
    protected nodes: Map<number | string, TwingNode>;
    protected attributes: Map<string, any>;
    protected lineno: number;
    protected columnno: number;
    protected tag: string;
    protected type: TwingNodeType;
    private name: string = null;

    /**
     * Constructor.
     *
     * The nodes are automatically made available as properties ($this->node).
     * The attributes are automatically made available as array items ($this['name']).
     *
     * @param nodes         Map<string, TwingNode>  A map of named nodes
     * @param attributes    Map<string, {}>         A map of attributes (should not be nodes)
     * @param lineno        number                  The line number
     * @param columnno      number                  The column number
     * @param tag           string                  The tag name associated with the Nodel
     */
    constructor(nodes: Map<any, any> = new Map(), attributes: Map<string, any> = new Map(), lineno: number = 0, columnno: number = 0, tag: string = null) {
        this.nodes = nodes;
        this.attributes = attributes;
        this.lineno = lineno;
        this.columnno = columnno;
        this.tag = tag;
        this.type = null;
    }

    /**
     * @returns {TwingNode}
     */
    clone(): TwingNode {
        let result: TwingNode = Reflect.construct(this.constructor, []);

        for (let [name, node] of this.getNodes()) {
            result.setNode(name as string, node.clone());
        }

        for (let [name, node] of this.attributes) {
            if (node instanceof TwingNode) {
                node = node.clone();
            }

            result.setAttribute(name, node);
        }

        result.lineno = this.lineno;
        result.columnno = this.columnno;
        result.tag = this.tag;
        result.type = this.type;

        return result;
    }

    toString(withChildren: boolean = true) {
        let attributes = [];

        for (let [name, value] of this.attributes) {
            let attributeRepr: string;

            if (value instanceof TwingNode) {
                attributeRepr = '' + value.toString();
            }
            else {
                attributeRepr = '' + var_export(value, true);
            }

            attributes.push(`${name}: ${attributeRepr.replace(/\n/g, '')}`);
        }

        attributes.push(`line: ${this.getTemplateLine()}`);
        attributes.push(`column: ${this.getTemplateColumn()}`);

        let repr = [this.constructor.name + '(' + attributes.join(', ')];

        if (withChildren && this.nodes.size > 0) {
            for (let [name, node] of this.nodes) {
                let len = ('' + name).length + 4;
                let nodeRepr = [];

                for (let line of node.toString().split('\n')) {
                    nodeRepr.push(' '.repeat(len) + line);
                }

                repr.push(`  ${name}: ${nodeRepr.join('\n').trimLeft()}`);
            }

            repr.push(')');
        }
        else {
            repr[0] += ')';
        }

        return repr.join('\n');
    }

    getType() {
        return this.type;
    }

    compile(compiler: TwingCompiler): any {
        for (let [k, node] of this.nodes) {
            node.compile(compiler);
        }
    }

    getTemplateLine() {
        return this.lineno;
    }

    getTemplateColumn() {
        return this.columnno;
    }

    getNodeTag() {
        return this.tag;
    }

    /**
     * @returns booleqn
     */
    hasAttribute(name: string) {
        return this.attributes.has(name);
    }

    /**
     *
     * @param {string} name
     * @returns any
     */
    getAttribute(name: string): any {
        if (!this.attributes.has(name)) {
            throw new Error(`Attribute "${name}" does not exist for Node "${this.type}".`);
        }

        return this.attributes.get(name);
    }

    /**
     * @param {string} name
     * @param {*} value
     */
    setAttribute(name: string, value: any) {
        this.attributes.set(name, value);
    }

    removeAttribute(name: string) {
        this.attributes.delete(name);
    }

    /**
     * @return bool
     */
    hasNode(name: any) {
        return this.nodes.has(name);
    }

    /**
     * @return TwingNode
     */
    getNode(name: string | number): TwingNode {
        if (!this.nodes.has(name)) {
            throw new Error(`Node "${name}" does not exist for Node "${this.type}".`);
        }

        return this.nodes.get(name);
    }

    setNode(name: string | number, node: TwingNode) {
        this.nodes.set(name, node);
    }

    removeNode(name: string | number) {
        this.nodes.delete(name);
    }

    count() {
        return this.nodes.size;
    }

    setTemplateName(name: string) {
        this.name = name;

        for (let [k, node] of this.nodes) {
            node.setTemplateName(name);
        }
    }

    getTemplateName() {
        return this.name;
    }

    getNodes() {
        return this.nodes;
    }

}
