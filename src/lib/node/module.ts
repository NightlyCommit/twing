import {TwingNode, TwingNodeType} from "../node";
import {TwingSource} from "../source";
import {TwingCompiler} from "../compiler";

/**
 * Represents a module node that compiles into a JavaScript module.
 */
export class TwingNodeModule extends TwingNode {
    public source: TwingSource;

    constructor(body: TwingNode, parent: TwingNode, blocks: TwingNode, macros: TwingNode, traits: TwingNode, embeddedTemplates: Array<{}>, source: TwingSource) {
        let nodes = new Map();

        nodes.set('body', body);
        nodes.set('blocks', blocks);
        nodes.set('macros', macros);
        nodes.set('traits', traits);
        nodes.set('display_start', new TwingNode());
        nodes.set('display_end', new TwingNode());
        nodes.set('constructor_start', new TwingNode());
        nodes.set('constructor_end', new TwingNode());
        nodes.set('class_end', new TwingNode());

        if (parent !== null) {
            nodes.set('parent', parent);
        }

        // embedded templates are set as attributes so that they are only visited once by the visitors
        let attributes = new Map();

        attributes.set('index', 0);
        attributes.set('embedded_templates', embeddedTemplates);

        super(nodes, attributes, 1, 1);

        this.type = TwingNodeType.MODULE;
        this.source = source;

        // populate the template name of all node children
        this.setTemplateName(this.source.getName());
    }

    setIndex(index: number) {
        this.setAttribute('index', index);
    }

    compile(compiler: TwingCompiler) {
        let index: number = this.getAttribute('index');

        if (index === 0) {
            compiler
                .write('module.exports = (TwingTemplate) => {\n')
                .indent()
                .write('return new Map([\n')
                .indent()
            ;
        }

        this.compileTemplate(compiler);

        for (let template of this.getAttribute('embedded_templates')) {
            compiler.subcompile(template);
        }

        if (index === 0) {
            compiler
                .outdent()
                .write(']);\n')
                .outdent()
                .write('};')
            ;
        }
    }

    protected compileTemplate(compiler: TwingCompiler) {
        this.compileClassHeader(compiler);
        this.compileConstructor(compiler);
        this.compileDoGetParent(compiler);
        this.compileDoGetTraits(compiler);
        this.compileDoDisplay(compiler);
        this.compileIsTraitable(compiler);
        this.compileClassfooter(compiler);
    }

    protected compileClassHeader(compiler: TwingCompiler) {
        let index: number = this.getAttribute('index');

        compiler
            .write(`[${index}, class extends TwingTemplate {\n`)
            .indent();
    }

    protected compileConstructor(compiler: TwingCompiler) {
        compiler
            .write('constructor(env) {\n')
            .indent()
            .subcompile(this.getNode('constructor_start'))
            .write('super(env);\n\n')
            .write('this.sourceContext = new this.Source(')
            .string(compiler.getEnvironment().isDebug() || compiler.getEnvironment().isSourceMap() ? this.source.getCode() : '')
            .raw(', ')
            .string(this.source.getName())
            .raw(', ')
            .string(this.source.getFQN())
            .raw(");\n\n")
            .write('let aliases = new this.Context();\n')
        ;

        // block handlers
        let count: number = this.getNode('blocks').getNodes().size;

        if (count > 0) {
            compiler
                .write('\n')
                .write('this.blockHandlers = new Map([\n')
                .indent();

            for (let [name, node] of this.getNode('blocks').getNodes()) {
                count--;

                compiler.write(`['${name}', `)
                    .subcompile(node)
                    .raw(']');

                if (count > 0) {
                    compiler.raw(',')
                }

                compiler.raw('\n');
            }

            compiler
                .outdent()
                .write(']);\n');
        }

        // macro handlers
        count = this.getNode('macros').getNodes().size;

        if (count > 0) {
            compiler
                .write('\n')
                .write('this.macroHandlers = new Map([\n')
                .indent();

            for (let [name, node] of this.getNode('macros').getNodes()) {
                count--;

                compiler.write(`['${name}', `)
                    .subcompile(node)
                    .raw(']');

                if (count > 0) {
                    compiler.raw(',')
                }

                compiler.raw('\n');
            }

            compiler
                .outdent()
                .write(']);\n');
        }

        compiler
            .subcompile(this.getNode('constructor_end'))
            .outdent()
            .write('}\n\n');
    }

    protected compileDoGetTraits(compiler: TwingCompiler) {
        let count = this.getNode('traits').getNodes().size;

        if (count > 0) {
            compiler
                .write("async doGetTraits() {\n")
                .indent()
                .write('let traits = new Map();\n\n');

            for (let [i, trait] of this.getNode('traits').getNodes()) {
                let node = trait.getNode('template');

                compiler
                    .write(`let trait_${i} = await this.loadTemplate(`)
                    .subcompile(node)
                    .raw(', ')
                    .repr(node.getTemplateLine())
                    .raw(");\n\n")
                ;

                compiler
                    .write(`if (!trait_${i}.isTraitable()) {\n`)
                    .indent()
                    .write('throw new this.RuntimeError(\'Template ')
                    .subcompile(trait.getNode('template'))
                    .raw(' cannot be used as a trait.\', ')
                    .repr(node.getTemplateLine())
                    .raw(", this.getSourceContext());\n")
                    .outdent()
                    .write('}\n\n')
                    .write(`let traits_${i} = this.cloneMap(await trait_${i}.getBlocks());\n\n`)
                ;

                for (let [key, value] of trait.getNode('targets').getNodes()) {
                    compiler
                        .write(`if (!traits_${i}.has(`)
                        .string(key as string)
                        .raw(")) {\n")
                        .indent()
                        .write('throw new this.RuntimeError(\'Block ')
                        .string(key as string)
                        .raw(' is not defined in trait ')
                        .subcompile(trait.getNode('template'))
                        .raw('.\', ')
                        .repr(value.getTemplateLine())
                        .raw(', this.getSourceContext());\n')
                        .outdent()
                        .write('}\n\n')
                        .write(`traits_${i}.set(`)
                        .subcompile(value)
                        .raw(`, traits_${i}.get(`)
                        .string(key)
                        .raw(`)); traits_${i}.delete(`)
                        .string(key)
                        .raw(');\n\n')
                    ;
                }
            }

            for (let i = 0; i < count; ++i) {
                compiler.write(`traits = this.merge(traits, traits_${i});\n`);
            }

            compiler.write('\n');

            compiler
                .write('return Promise.resolve(traits);\n')
                .outdent()
                .write('}\n\n');
        }
    }

    protected compileDoGetParent(compiler: TwingCompiler) {
        if (this.hasNode('parent')) {
            let parent = this.getNode('parent');

            compiler
                .write("doGetParent(context) {\n")
                .indent()
                .write('return this.loadTemplate(')
                .subcompile(parent)
                .raw(', ')
                .repr(parent.getTemplateLine())
                .raw(")")
            ;

            // if the parent name is not dynamic, then we can cache the parent as it will never change
            if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
                compiler
                    .raw('.then((parent) => {\n')
                    .indent()
                    .write('this.parent = parent;\n\n')
                    .write('return parent;\n')
                    .outdent()
                    .write('})')
            }

            compiler
                .raw(';\n')
                .outdent()
                .write("}\n\n")
            ;
        }
    }

    protected compileDoDisplay(compiler: TwingCompiler) {
        compiler
            .write("async doDisplay(context, blocks = new Map()) {\n")
            .indent()
            .write('let aliases = this.aliases.clone();\n\n')
            .addSourceMapEnter(this)
            .subcompile(this.getNode('display_start'))
            .subcompile(this.getNode('body'))
        ;

        if (this.hasNode('parent')) {
            compiler.write('await (await this.getParent(context)).display(context, this.merge(await this.getBlocks(), blocks));\n');
        }

        compiler
            .subcompile(this.getNode('display_end'))
            .addSourceMapLeave()
            .outdent()
            .write("}\n\n")
        ;
    }

    protected compileIsTraitable(compiler: TwingCompiler) {
        // A template can be used as a trait if:
        //   * it has no parent
        //   * it has no macros
        //   * it has no body
        //
        // Put another way, a template can be used as a trait if it
        // only contains blocks and use statements.
        let traitable = !this.hasNode('parent') && (this.getNode('macros').getNodes().size === 0);

        if (traitable) {
            let nodes: TwingNode;

            if (this.getNode('body').getType() === TwingNodeType.BODY) {
                nodes = this.getNode('body').getNode(0);
            } else {
                nodes = this.getNode('body');
            }

            if (!nodes.getNodes().size) {
                let n = new Map();

                n.set(0, nodes);

                nodes = new TwingNode(n);
            }

            for (let [idx, node] of nodes.getNodes()) {
                if (!node.getNodes().size) {
                    continue;
                }

                traitable = false;

                break;
            }
        }

        if (traitable) {
            return;
        }

        compiler
            .write("isTraitable() {\n")
            .indent()
            .write('return false;\n')
            .outdent()
            .write("}\n\n")
        ;
    }

    protected compileClassfooter(compiler: TwingCompiler) {
        compiler
            .subcompile(this.getNode('class_end'))
            .outdent()
            .write(`}],\n`)
        ;
    }
}
