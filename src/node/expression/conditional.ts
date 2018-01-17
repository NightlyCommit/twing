import TwingNodeExpression from "../expression";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

class TwingNodeExpressionConditional extends TwingNodeExpression {
    constructor(expr1: TwingNodeExpression, expr2: TwingNodeExpression, expr3: TwingNodeExpression, lineno: number) {
        let nodes = new TwingMap();

        nodes.set('expr1', expr1);
        nodes.set('expr2', expr2);
        nodes.set('expr3', expr3);

        super(nodes, new TwingMap(), lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let expr1Handler = compiler.subcompile(this.getNode('expr1'));
        let expr2Handler = compiler.subcompile(this.getNode('expr2'));
        let expr3Handler = compiler.subcompile(this.getNode('expr3'));

        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
            if (expr1Handler(template, context, blocks)) {
                return expr2Handler(template, context, blocks);
            }
            else {
                return expr3Handler(template, context, blocks);
            }
        }
    }
}

export default TwingNodeExpressionConditional;