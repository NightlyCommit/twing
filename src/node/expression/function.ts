import TwingNodeExpression from "../expression";
import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingTemplate from "../../template";
import TwingNodeExpressionCall from "./call";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";

class TwingNodeExpressionFunction extends TwingNodeExpressionCall {
    constructor(name: string, functionArguments: TwingNode, lineno: number) {
        let nodes = new TwingMap([
            ['arguments', functionArguments]
        ]);

        let attributes = new TwingMap([
            ['name', name],
            ['is_defined_test', false]
        ]);

        super(nodes, attributes, lineno);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let name = this.getAttribute('name');
        let function_ = compiler.getEnvironment().getFunction(name);

        this.setAttribute('name', name);
        this.setAttribute('type', 'function');
        this.setAttribute('needs_environment', function_.needsEnvironment());
        this.setAttribute('needs_context', function_.needsContext());
        this.setAttribute('arguments', function_.getArguments());

        let callable = function_.getCallable();

        if (name === 'constant' && this.getAttribute('is_defined_test')) {
            //callable = 'twig_constant_is_defined';
        }

        this.setAttribute('callable', callable);
        this.setAttribute('is_variadic', function_.isVariadic());

        return this.compileCallable(compiler);
    }
}

export default TwingNodeExpressionFunction;