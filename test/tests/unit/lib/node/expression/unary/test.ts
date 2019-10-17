import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionUnary} from "../../../../../../../src/lib/node/expression/unary";
import {TwingCompiler} from "../../../../../../../src/lib/compiler";
import {TwingEnvironmentNode} from "../../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../../src/lib/loader/array";

class UnaryExpression extends TwingNodeExpressionUnary {

}

tape('node/expression/unary', (test) => {
    test.test('compile', (test) => {
        let expr = new UnaryExpression(new TwingNodeExpressionConstant('foo', 1, 1), 1, 1);
        let compiler = new TwingCompiler(new TwingEnvironmentNode(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), '(\`foo\`)');

        test.end();
    });

    test.end();
});
