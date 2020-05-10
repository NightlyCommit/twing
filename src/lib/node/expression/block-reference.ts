import {TwingNodeExpression} from "../expression";
import {TwingNode} from "../../node";
import {TwingCompiler} from "../../compiler";
import {TwingNodeType} from "../../node-type";

export const type = new TwingNodeType('expression_block_reference');

export class TwingNodeExpressionBlockReference extends TwingNodeExpression {
    constructor(name: TwingNode, template: TwingNode, lineno: number, columnno: number, tag: string = null) {
        let nodes = new Map();

        nodes.set('name', name);

        if (template) {
            nodes.set('template', template);
        }

        let attributes = new Map([
            ['is_defined_test', false],
            ['output', false]
        ]);

        super(nodes, attributes, lineno, columnno, tag);
    }

    get type() {
        return type;
    }

    compile(compiler: TwingCompiler) {
        if (this.getAttribute('is_defined_test')) {
            this.compileTemplateCall(compiler, 'traceableHasBlock', false);
        } else {
            this.compileTemplateCall(compiler, 'traceableRenderBlock', true);
        }
    }

    compileTemplateCall(compiler: TwingCompiler, method: string, needsOutputBuffer: boolean): TwingCompiler {
        compiler.write('await ');

        if (!this.hasNode('template')) {
            compiler.raw('this');
        } else {
            compiler
                .raw('(await this.loadTemplate(')
                .subcompile(this.getNode('template'))
                .raw(', ')
                .repr(this.getTemplateLine())
                .raw('))')
            ;
        }

        compiler.raw(`.${method}(${this.getTemplateLine()}, this.source)`);

        this.compileBlockArguments(compiler, needsOutputBuffer);

        return compiler;
    }

    compileBlockArguments(compiler: TwingCompiler, needsOutputBuffer: boolean) {
        compiler
            .raw('(')
            .subcompile(this.getNode('name'))
            .raw(', context.clone()');

        if (needsOutputBuffer) {
            compiler.raw(', outputBuffer');
        }

        if (!this.hasNode('template')) {
            compiler.raw(', blocks');
        }

        return compiler.raw(')');
    }
}
