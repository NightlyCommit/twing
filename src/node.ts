import TwingNodeType from "./node-type";
import TwingNodeInterface from "./node-interface";
import TwingMap from "./map";
import TwingTemplate from "./template";
import TwingError from "./error";
import DoDisplayHandler from "./do-display-handler";
import TwingCompiler from "./compiler";

class TwingNode implements TwingNodeInterface {
    protected nodes: TwingMap<string, TwingNode>;
    protected attributes: TwingMap<string, any>;
    protected lineno: number;
    protected tag: string;
    protected type: TwingNodeType = TwingNodeType.NONE;

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
     * @param tag           string                  The tag name associated with the Nodel
     */
    constructor(nodes: TwingMap<any, any> = new TwingMap(), attributes: TwingMap<string, any> = new TwingMap(), lineno: number = 0, tag: string = null) {
        this.nodes = nodes;
        this.attributes = attributes;
        this.lineno = lineno;
        this.tag = tag;

        this.type = TwingNodeType.NONE;
    }

    /**
     * @returns {TwingNode}
     */
    clone(): TwingNode {
        let result: TwingNode = Reflect.construct(this.constructor, []);

        for (let [name, node] of this.getNodes()) {
            result.setNode(name, node.clone());
        }

        for (let [name, node] of this.attributes) {
            if (node instanceof TwingNode) {
                node = node.clone();
            }

            result.setAttribute(name, node);
        }

        result.lineno = this.lineno;
        result.tag = this.tag;

        return result;
    }

    toString(indentation: number = 0) {
        let repr = [
            this.constructor.name
        ];

        if (this.attributes.size > 0) {
            let attributes: Array<string> = [];

            repr.push(' '.repeat(indentation + 2) + 'ATTRIBUTES');

            this.attributes.forEach(function (values, index) {
                if (!Array.isArray(values)) {
                    values = [values];
                }

                for (let value of values) {
                    attributes.push(' '.repeat(indentation + 4) + `${index}: ${value && value instanceof TwingNode ? value.toString(indentation + 4) : value}`);
                }
            });

            repr.push(attributes.join('\n'));
        }

        if (this.nodes.size > 0) {
            let nodes: Array<string> = [];

            repr.push(' '.repeat(indentation + 2) + 'NODES');

            this.nodes.forEach(function (node, index) {
                nodes.push(' '.repeat(indentation + 4) + `${index}: ${node.toString(indentation + 4)}`)
            });

            repr.push(nodes.join('\n'));
        }

        return repr.join('\n');
    }

    getType() {
        return this.type;
    }

    static ind = 0;

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let handlers: Array<DoDisplayHandler> = [];

        for (let [k, node] of this.nodes) {
            handlers.push(compiler.subcompile(node));
        }

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            return handlers.map(function (handler) {
                try {
                    return handler(template, context, blocks);
                }
                catch (e) {
                    if (e instanceof TwingError) {
                        // this is mostly useful for TwingErrorLoader exceptions
                        // @see TwingErrorLoader
                        if (e.getTemplateLine() === false) {
                            e.setTemplateLine(handler.node.getTemplateLine());
                        }
                    }

                    throw e;
                }
            }).join('')
        }
    }

    getTemplateLine() {
        return this.lineno;
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
            throw new Error(`Attribute "${name}" does not exist for Node "${this.constructor.name}".`);
        }

        return this.attributes.get(name);
    }

    /**
     * @param string name
     * @param mixed  value
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
            throw new Error(`Node "${name}" does not exist for Node "${this.constructor.name}".`);
        }

        return this.nodes.get(name);
    }

    setNode(name: string, node: TwingNode) {
        this.nodes.set(name, node);
    }

    removeNode(name: string) {
        this.nodes.delete(name);
    }

    count() {
        return this.nodes.size;
    }

    setTemplateName(name: string) {
        let self = this;

        this.name = name;

        this.nodes.forEach(function (node) {
            try {
                node.setTemplateName(name);
            }
            catch (e) {
                throw e;
            }
        });
    }

    getTemplateName() {
        return this.name;
    }

    getNodes() {
        return this.nodes;
    }

}

export default TwingNode;