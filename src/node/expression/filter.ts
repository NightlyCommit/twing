import TwingNode from "../../node";
import TwingNodeExpressionConstant from "./constant";
import TwingMap from "../../map";
import TwingNodeExpressionCall from "./call";
import TwingCompiler from "../../compiler";
import TwingNodeType from "../../node-type";

class TwingNodeExpressionFilter extends TwingNodeExpressionCall {
    constructor(node: TwingNode, filterName: TwingNodeExpressionConstant, methodArguments: TwingNode, lineno: number, tag: string = null) {
        let nodes = new TwingMap();

        nodes.set('node', node);
        nodes.set('filter', filterName);
        nodes.set('arguments', methodArguments);

        super(nodes, new TwingMap(), lineno, tag);

        this.type = TwingNodeType.EXPRESSION_FILTER;
    }

    compile(compiler: TwingCompiler) {
        let name = this.getNode('filter').getAttribute('value');
        let filter = compiler.getEnvironment().getFilter(name);
        let callable = filter.getCallable();

        this.setAttribute('name', name);
        this.setAttribute('type', 'filter');
        this.setAttribute('needs_environment', filter.needsEnvironment());
        this.setAttribute('needs_context', filter.needsContext());
        this.setAttribute('arguments', filter.getArguments());
        this.setAttribute('callable', callable);
        this.setAttribute('is_variadic', filter.isVariadic());

        this.compileCallable(compiler);
    }
}

export default TwingNodeExpressionFilter;