import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingCompiler from "../../compiler";

class TwingNodeExpressionGetAttr extends TwingNodeExpression {
    constructor(node: TwingNodeExpression, attribute: TwingNodeExpression, methodArguments: TwingNodeExpression, type: string, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('attribute', attribute);

        if (methodArguments) {
            nodes.set('arguments', methodArguments);
        }

        let nodeAttributes = new TwingMap();

        nodeAttributes.set('type', type);
        nodeAttributes.set('is_defined_test', false);
        nodeAttributes.set('ignore_strict_check', false);

        super(nodes, nodeAttributes, lineno);
    }

    compile(compiler: TwingCompiler) {
        compiler.raw('Twing.twingGetAttribute(this.env, this.getSourceContext(), ');

        if (this.getAttribute('ignore_strict_check')) {
            this.getNode('node').setAttribute('ignore_strict_check', true);
        }

        compiler.subcompile(this.getNode('node'));

        compiler.raw(', ').subcompile(this.getNode('attribute'));

        // only generate optional arguments when needed (to make generated code more readable)
        let needFourth = this.getAttribute('ignore_strict_check');
        let needThird = needFourth || this.getAttribute('is_defined_test');
        let needSecond = needThird || this.getAttribute('type') !== TwingTemplate.ANY_CALL;
        let needFirst = needSecond || this.hasNode('arguments');

        if (needFirst) {
            if (this.hasNode('arguments')) {
                compiler.raw(', ').subcompile(this.getNode('arguments'));
            }
            else {
                compiler.raw(', []');
            }
        }

        if (needSecond) {
            compiler.raw(', ').repr(this.getAttribute('type'));
        }

        if (needThird) {
            compiler.raw(', ').repr(this.getAttribute('is_defined_test'));
        }

        if (needFourth) {
            compiler.raw(', ').repr(this.getAttribute('ignore_strict_check'));
        }

        compiler.raw(')');
    };
}

export default TwingNodeExpressionGetAttr;