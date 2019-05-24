import {TwingNode, TwingNodeType} from "../node";
import {TwingSource} from "../source";

import {TwingCompiler} from "../compiler";

const ctype_space = require('locutus/php/ctype/ctype_space');

/**
 * Represents a module node.
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

        attributes.set('index', null);
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
        if (!this.getAttribute('index')) {
            compiler
                .write('module.exports = (TemplateConstructor) => {\n')
                .indent()
                .write('let templates = {};\n')
            ;
        }

        this.compileTemplate(compiler);

        for (let template of this.getAttribute('embedded_templates')) {
            compiler.subcompile(template);
        }

        if (!this.getAttribute('index')) {
            compiler
                .write('return templates;\n')
                .outdent()
                .write('};')
            ;
        }
    }

    protected compileTemplate(compiler: TwingCompiler) {
        this.compileClassHeader(compiler);

        this.compileConstructor(compiler);

        this.compileGetParent(compiler);

        this.compileDisplay(compiler);

        compiler.subcompile(this.getNode('blocks'));

        this.compileMacros(compiler);

        this.compileIsTraitable(compiler);

        this.compileDebugInfo(compiler);

        this.compileClassfooter(compiler);
    }

    protected compileGetParent(compiler: TwingCompiler) {
        if (!this.hasNode('parent')) {
            return;
        }

        let parent = this.getNode('parent');

        compiler
            .write("doGetParent(context) {\n")
            .indent()
            .addDebugInfo(parent)
            .write('return ')
        ;

        if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
            compiler.subcompile(parent);
        }
        else {
            compiler
                .raw('this.loadTemplate(')
                .subcompile(parent)
                .raw(', ')
                .repr(this.source.getName())
                .raw(', ')
                .repr(parent.getTemplateLine())
                .raw(')')
            ;
        }

        compiler
            .raw(";\n")
            .outdent()
            .write("}\n\n")
        ;
    }

    protected compileClassHeader(compiler: TwingCompiler) {
        let templateClass = compiler.getEnvironment().getTemplateClass(this.source.getName(), this.getAttribute('index'));

        compiler
            .write("\n\n")
            .write('/* ' + this.source.getName() + ' */\n')
            .write('templates.')
            .raw(`${templateClass} = class extends TemplateConstructor {\n`)
            .indent();
    }

    protected compileConstructor(compiler: TwingCompiler) {
        compiler
            .write('constructor(env) {\n')
            .indent()
            .subcompile(this.getNode('constructor_start'))
            .write('super(env);\n\n')
            .write('this.sourceCode = ').string(`${compiler.getEnvironment().isDebug() || compiler.getEnvironment().isSourceMap() ?  this.source.getCode() : ''}`).raw(';\n')
            .write('this.sourceName = ').string(this.source.getName()).raw(';\n')
            .write('this.sourcePath = ').string(this.source.getPath()).raw(';\n\n')
        ;

        // parent
        if (!this.hasNode('parent')) {
            compiler.write("this.parent = false;\n\n");
        }
        else {
            let parent = this.getNode('parent');

            if (parent && (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT)) {
                compiler
                    .addDebugInfo(parent)
                    .write('this.parent = this.loadTemplate(')
                    .subcompile(parent)
                    .raw(', ')
                    .repr(this.source.getName())
                    .raw(', ')
                    .repr(parent.getTemplateLine())
                    .raw(");\n")
                ;
            }
        }

        let countTraits = this.getNode('traits').getNodes().size;

        if (countTraits) {
            // traits
            for (let [i, trait] of this.getNode('traits').getNodes()) {
                let node = trait.getNode('template');

                compiler
                    .write(`let _trait_${i} = this.loadTemplate(`)
                    .subcompile(node)
                    .raw(', ')
                    .repr(node.getTemplateName())
                    .raw(', ')
                    .repr(node.getTemplateLine())
                    .raw(");\n")
                ;

                compiler
                    .addDebugInfo(trait.getNode('template'))
                    .write(`if (!_trait_${i}.isTraitable()) {\n`)
                    .indent()
                    .write('this.throwRuntimeError(\'Template "+')
                    .subcompile(trait.getNode('template'))
                    .raw('+" cannot be used as a trait.\', ')
                    .repr(node.getTemplateLine())
                    .raw(", this.getSourceContext());\n")
                    .outdent()
                    .write('}\n')
                    .write(`let _trait_${i}_blocks = this.cloneMap(_trait_${i}.getBlocks());\n\n`)
                ;

                for (let [key, value] of trait.getNode('targets').getNodes()) {
                    compiler
                        .write(`if (!_trait_${i}_blocks.has(`)
                        .string(key as string)
                        .raw(")) {\n")
                        .indent()
                        .write('this.throwRuntimeError(\'Block ')
                        .string(key as string)
                        .raw(' is not defined in trait ')
                        .subcompile(trait.getNode('template'))
                        .raw('.\', ')
                        .repr(value.getTemplateLine())
                        .raw(', this.getSourceContext());\n')
                        .outdent()
                        .write('}\n\n')
                        .write(`_trait_${i}_blocks.set(`)
                        .subcompile(value)
                        .raw(`, _trait_${i}_blocks.get(`)
                        .string(key)
                        .raw(`)); _trait_${i}_blocks.delete(`)
                        .string(key)
                        .raw(');\n\n')
                    ;
                }
            }

            if (countTraits > 1) {
                for (let i = 0; i < countTraits; ++i) {
                    compiler
                        .write(`this.traits = this.merge(this.traits, _trait_${i}_blocks);\n`)
                    ;
                }
            }
            else {
                compiler
                    .write("this.traits = this.cloneMap(_trait_0_blocks);\n\n")
                ;
            }

            compiler
                .write("this.blocks = this.merge(this.traits, new Map([\n")
                .indent()
            ;
        }
        else {
            compiler
                .write("this.blocks = new Map([\n")
            ;
        }

        // blocks
        compiler
            .indent()
        ;

        let count = this.getNode('blocks').getNodes().size;

        for (let [name, node] of this.getNode('blocks').getNodes()) {
            count--;

            let safeName = name;

            const varValidator = require('var-validator');

            if (!varValidator.isValid(name)) {
                safeName = Buffer.from(name as string).toString('hex');
            }

            compiler
                .write(`['${name}', [this, 'block_${safeName}']]`)
            ;

            if (count > 0) {
                compiler.raw(',')
            }

            compiler.raw('\n');
        }

        compiler
            .outdent()
            .write("])")
        ;

        if (countTraits) {
            compiler
                .write("\n")
                .outdent()
                .write(")")
            ;
        }

        compiler.raw(';\n');

        compiler
            .outdent()
            .subcompile(this.getNode('constructor_end'))
            .write('}\n\n')
        ;
    }

    protected compileMacros(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('macros'));
    }

    protected compileDisplay(compiler: TwingCompiler) {
        compiler
            .write("doDisplay(context, blocks = new Map()) {\n")
            .indent()
            .addSourceMapEnter(this)
            .subcompile(this.getNode('display_start'))
            .subcompile(this.getNode('body'))
        ;

        if (this.hasNode('parent')) {
            let parent = this.getNode('parent');
            compiler
                .addDebugInfo(parent)
            ;

            if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
                compiler.write('this.parent');
            } else {
                compiler.write('this.getParent(context)');
            }

            compiler.raw(".display(context, this.merge(this.blocks, blocks));\n");
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
            }
            else {
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

                // unit: this block is not coverable; how can node be of type TEXT and have children nodes?
                // if (node.getType() === TwingNodeType.TEXT && ctype_space(node.getAttribute('data'))) {
                //     continue;
                // }

                // unit: this block is not coverable; how can node be of type BLOCK_REFERENCE and have children nodes?
                // if (node.getType() === TwingNodeType.BLOCK_REFERENCE) {
                //     continue;
                // }

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
            // unit: something is really wrong here
            // .write(`return ${traitable ? 'true' : 'false'};\n`)
            .write('return false;\n')
            .outdent()
            .write("}\n\n")
        ;
    }

    protected compileDebugInfo(compiler: TwingCompiler) {
        compiler
            .write("getDebugInfo() {\n")
            .indent()
            .write('return ')
            // @see https://github.com/Microsoft/TypeScript/issues/11152
            .repr(new Map(Array.from(compiler.getDebugInfo()).reverse() as Iterable<any>))
            .raw(';\n')
            .outdent()
            .write("}\n")
        ;
    }

    protected compileClassfooter(compiler: TwingCompiler) {
        compiler
            .subcompile(this.getNode('class_end'))
            .outdent()
            .write('};\n\n')
        ;
    }
}
