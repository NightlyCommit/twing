import {TwingNode} from "../node";
import {TwingSource} from "../source";
import {TwingMap} from "../map";
import {TwingCompiler} from "../compiler";
import {TwingNodeType} from "../node-type";

const ctype_space = require('locutus/php/ctype/ctype_space');

/**
 * Represents a module node.
 */
export class TwingNodeModule extends TwingNode {
    public source: TwingSource;

    constructor(body: TwingNode, parent: TwingNode = null, blocks: TwingNode, macros: TwingNode, traits: TwingNode, embeddedTemplates: Array<{}>, source: TwingSource) {
        let nodes = new TwingMap();

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
        let attributes = new TwingMap();

        attributes.set('index', null);
        attributes.set('embedded_templates', embeddedTemplates);

        super(nodes, attributes, 1);

        this.type = TwingNodeType.MODULE;
        this.source = source;

        // populate the template name of all node children
        this.setTemplateName(this.source.getName());
    }

    setIndex(index: number) {
        this.setAttribute('index', index);
    }

    compile(compiler: TwingCompiler) {
        this.compileTemplate(compiler);

        for (let template of this.getAttribute('embedded_templates')) {
            compiler.subcompile(template);
        }
    }

    compileTemplate(compiler: TwingCompiler) {
        if (!this.getAttribute('index')) {
            compiler
                .write('const Twing = require("twing");\n\n')
                .write('module.exports = {};\n')
            ;
        }

        this.compileClassHeader(compiler);

        if (this.getNode('blocks').getNodes().size ||
            this.getNode('traits').getNodes().size ||
            !this.hasNode('parent') ||
            this.getNode('parent').getType() === TwingNodeType.EXPRESSION_CONSTANT ||
            this.getNode('constructor_start').getNodes().size ||
            this.getNode('constructor_end').getNodes().size) {
            this.compileConstructor(compiler)
        }

        this.compileGetParent(compiler);

        this.compileDisplay(compiler);

        compiler.subcompile(this.getNode('blocks'));

        this.compileMacros(compiler);

        this.compileGetTemplateName(compiler);

        this.compileIsTraitable(compiler);

        this.compileDebugInfo(compiler);

        this.compileGetSourceContext(compiler);

        this.compileClassfooter(compiler);
    }

    compileGetParent(compiler: TwingCompiler) {
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

    compileClassHeader(compiler: TwingCompiler) {
        let templateClass = compiler.getEnvironment().getTemplateClass(this.source.getName(), this.getAttribute('index'));

        compiler
            .write("\n\n")
            .write('/* ' + this.source.getName() + ' */\n')
            .write('module.exports.')
            .raw(`${templateClass} = class ${templateClass} extends ${compiler.getEnvironment().getBaseTemplateClass()} `)
            .write('{\n')
            .indent()
    }

    compileConstructor(compiler: TwingCompiler) {
        compiler
            .write('constructor(env) {\n')
            .indent()
            .subcompile(this.getNode('constructor_start'))
            .write('super(env);\n\n')
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
                    .write('throw new Twing.TwingErrorRuntime(\'Template "')
                    .subcompile(trait.getNode('template'))
                    .raw('" cannot be used as a trait.\');\n')
                    .outdent()
                    .write('}\n')
                    .write(`let _trait_${i}_blocks = _trait_${i}.getBlocks().clone();\n\n`)
                ;

                for (let [key, value] of trait.getNode('targets').getNodes()) {
                    compiler
                        .write(`if (!_trait_${i}_blocks.has(`)
                        .string(key)
                        .raw(")) {\n")
                        .indent()
                        .write('throw new Twing.TwingErrorRuntime(\'Block ')
                        .string(key)
                        .raw(' is not defined in trait ')
                        .subcompile(trait.getNode('template'))
                        .raw('.\', ')
                        .repr(value.lineno)
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
                        .write(`this.traits = this.traits.merge(_trait_${i}_blocks);\n`)
                    ;
                }
            }
            else {
                compiler
                    .write("this.traits = _trait_0_blocks.clone();\n\n")
                ;
            }

            compiler
                .write("this.blocks = this.traits.merge(new Twing.TwingMap([\n")
                .indent()
            ;
        }
        else {
            compiler
                .write("this.blocks = new Twing.TwingMap([\n")
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
                safeName = Buffer.from(name).toString('hex');
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

    compileMacros(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('macros'));
    }

    compileDisplay(compiler: TwingCompiler) {
        compiler
            .write("async doDisplay(context, blocks = new Twing.TwingMap()) {\n")
            .indent()
            .subcompile(this.getNode('display_start'))
            .subcompile(this.getNode('body'))
        ;

        if (this.hasNode('parent')) {
            let parent = this.getNode('parent');
            compiler
                .addDebugInfo(parent)
                .write('await ')
            ;

            if (parent.getType() === TwingNodeType.EXPRESSION_CONSTANT) {
                compiler.raw('this.parent');
            } else {
                compiler.raw('this.getParent(context)');
            }

            compiler.raw(".display(context, this.blocks.merge(blocks));\n");
        }

        compiler
            .subcompile(this.getNode('display_end'))
            .outdent()
            .write("}\n\n")
        ;
    }

    compileGetTemplateName(compiler: TwingCompiler) {
        compiler
            .write("getTemplateName() {\n")
            .indent()
            .write('return ')
            .repr(this.source.getName())
            .raw(";\n")
            .outdent()
            .write("}\n\n")
        ;
    }

    compileIsTraitable(compiler: TwingCompiler) {
        // A template can be used as a trait if:
        //   * it has no parent
        //   * it has no macros
        //   * it has no body
        //
        // Put another way, a template can be used as a trait if it
        // only contains blocks and use statements.
        let traitable = !this.hasNode('parent') && this.getNode('macros').getNodes().size === 0;

        if (traitable) {
            let nodes: TwingNode;

            if (this.getNode('body').getType() === TwingNodeType.BODY) {
                nodes = this.getNode('body').getNode(0);
            }
            else {
                nodes = this.getNode('body');
            }

            if (!nodes.getNodes().size) {
                let n = new TwingMap();

                n.push(nodes);

                nodes = new TwingNode(n);
            }

            for (let [idx, node] of nodes.getNodes()) {
                if (!node.getNodes().size) {
                    continue;
                }

                if (node.getType() === TwingNodeType.TEXT && ctype_space(node.getAttribute('data'))) {
                    continue;
                }

                if (node.getType() === TwingNodeType.BLOCK_REFERENCE) {
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
            .write(`return ${traitable ? 'true' : 'false'};\n`)
            .outdent()
            .write("}\n\n")
        ;
    }

    compileDebugInfo(compiler: TwingCompiler) {
        compiler
            .write("getDebugInfo() {\n")
            .indent()
            .write('return ')
            // @see https://github.com/Microsoft/TypeScript/issues/11152
            .repr(new Map(Array.from(compiler.getDebugInfo()).reverse() as Iterable<any>))
            .raw(';\n')
            .outdent()
            .write("}\n\n")
        ;
    }

    compileGetSourceContext(compiler: TwingCompiler) {
        compiler
            .write("getSourceContext() {\n")
            .indent()
            .write('return new Twing.TwingSource(`')
            .raw(compiler.getEnvironment().isDebug() ? this.source.getCode() : '')
            .raw('`, ')
            .string(this.source.getName())
            .raw(', ')
            .string(this.source.getPath())
            .raw(");\n")
            .outdent()
            .write("}\n")
        ;
    }

    compileClassfooter(compiler: TwingCompiler) {
        compiler
            .subcompile(this.getNode('class_end'))
            .outdent()
            .write('};\n\n')
        ;
    }
}
