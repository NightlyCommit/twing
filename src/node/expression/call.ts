import TwingNodeExpression from "../expression";
import TwingTemplate = require("../../template");
import TwingMap from "../../map";
import TwingTemplateBlock from "../../template-block";

class TwingNodeExpressionCall extends TwingNodeExpression {
    protected callable: Function;

    compile(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): any {
        let result = null;

        if (this.callable) {
            // compile arguments
            let callableArguments = this.compileArguments(context, template, blocks);

            result = this.callable.apply(this, callableArguments);
        }

        return result;
    }

    compileArguments(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): Array<any> {
        let result: Array<any> = [];

        if (this.hasAttribute('needs_environment') && this.getAttribute('needs_environment')) {
            result.push(template.getEnvironment());
        }

        result.push(this.getNode('node').compile(context, template, blocks));

        this.getNode('arguments').getNodes().forEach(function(argNode) {
            result.push(argNode.compile(context, template, blocks));
        });

        return result;
    }

    // compileCallable(compiler: TwingCompiler) {
    //     let callable = this.getAttribute('callable');
    //
    //     let closingParenthesis = false;
    //
    //     if ((callable instanceof String || typeof callable === 'string') && (callable.indexOf('::') === -1)) {
    //         compiler.raw('' + callable);
    //     }
    //     else {
    //         // list($r, $callable) = $this->reflectCallable($callable);
    //         // if ($r instanceof ReflectionMethod && is_string($callable[0])) {
    //         //     if ($r->isStatic()) {
    //         //         $compiler->raw(sprintf('%s::%s', $callable[0], $callable[1]));
    //         //     } else {
    //         //         $compiler->raw(sprintf('$this->env->getRuntime(\'%s\')->%s', $callable[0], $callable[1]));
    //         //     }
    //         // } elseif ($r instanceof ReflectionMethod && $callable[0] instanceof Twig_ExtensionInterface) {
    //         //     $compiler->raw(sprintf('$this->env->getExtension(\'%s\')->%s', get_class($callable[0]), $callable[1]));
    //         // } else {
    //         compiler.raw(`this.env.get${ucfirst(this.getAttribute('type'))}(\'${this.getAttribute('name')}\').getCallable()`);
    //         // }
    //     }
    //
    //     this.compileArguments(compiler);
    //
    //     if (closingParenthesis) {
    //         compiler.raw(')');
    //     }
    // }
    //
    // compileArguments(compiler: TwingCompiler) {
    //     compiler.raw('(');
    //
    //     let first = true;
    //
    //     if (this.hasAttribute('needs_environment') && this.getAttribute('needs_environment')) {
    //         compiler.raw('this.env');
    //         first = false;
    //     }
    //
    //     if (this.hasAttribute('needs_context') && this.getAttribute('needs_context')) {
    //         if (!first) {
    //             compiler.raw(', ');
    //         }
    //
    //         compiler.raw('context');
    //         first = false;
    //     }
    //
    //     if (this.hasAttribute('arguments')) {
    //         this.getAttribute('arguments').forEach(function (functionArgument: string) {
    //             if (!first) {
    //                 compiler.raw(', ');
    //             }
    //
    //             compiler.string(functionArgument);
    //             first = false;
    //         });
    //     }
    //
    //     if (this.hasNode('node')) {
    //         if (!first) {
    //             compiler.raw(', ');
    //         }
    //
    //         compiler.subcompile(this.getNode('node'));
    //         first = false;
    //     }
    //
    //     if (this.hasNode('arguments')) {
    //         let callable = this.getAttribute('callable');
    //         let functionArguments = this.getArguments(callable, this.getNode('arguments'));
    //
    //         functionArguments.forEach(function (node: TwingNode) {
    //             if (!first) {
    //                 compiler.raw(', ');
    //             }
    //
    //             compiler.subcompile(node);
    //             first = false;
    //         });
    //     }
    //
    //     compiler.raw(')');
    // }
}

export default TwingNodeExpressionCall;

