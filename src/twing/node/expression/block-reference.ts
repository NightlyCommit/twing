import {TwingNodeExpression} from "../expression";
import {TwingNode, TwingNodeType} from "../../node";
import {TwingCompiler} from "../../compiler";

export class TwingNodeExpressionBlockReference extends TwingNodeExpression {
    constructor(name: TwingNode, template: TwingNode = null, lineno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('name', name);

        if (template) {
            nodes.set('template', template);
        }

        let attributes = new Map([
            ['is_defined_test', false],
            ['output', false]
        ]);

        super(nodes, attributes, lineno, tag);

        this.type = TwingNodeType.EXPRESSION_BLOCK_REFERENCE;
    }

    compile(compiler: TwingCompiler) {
        if (this.getAttribute('is_defined_test')) {
            this.compileTemplateCall(compiler, 'hasBlock');
        }
        else {
            if (this.getAttribute('output')) {
                compiler.addDebugInfo(this);

                this
                    .compileTemplateCall(compiler, 'displayBlock')
                    .raw(";\n");
            }
            else {
                this.compileTemplateCall(compiler, 'renderBlock');
            }
        }
    }

    compileTemplateCall(compiler: TwingCompiler, method: string): TwingCompiler {
        if (!this.hasNode('template')) {
            compiler.write('this');
        }
        else {
            compiler
                .write('this.loadTemplate(')
                .subcompile(this.getNode('template'))
                .raw(', ')
                .repr(this.getTemplateName())
                .raw(', ')
                .repr(this.getTemplateLine())
                .raw(')')
            ;
        }

        compiler.raw(`.${method}`);

        this.compileBlockArguments(compiler);

        return compiler;
    }

    compileBlockArguments(compiler: TwingCompiler) {
        compiler
            .raw('(')
            .subcompile(this.getNode('name'))
            .raw(', context');

        if (!this.hasNode('template')) {
            compiler.raw(', blocks');
        }

        return compiler.raw(')');
    }
}
