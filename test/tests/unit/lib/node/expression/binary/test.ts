import * as tape from 'tape';
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {TwingNodeExpressionBinary} from "../../../../../../../src/lib/node/expression/binary";
import {TwingCompiler} from "../../../../../../../src/lib/compiler";
import {TwingEnvironmentNode} from "../../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../../src/lib/loader/array";

class BinaryExpression extends TwingNodeExpressionBinary {

}

tape('node/expression/binary', (test) => {
    test.test('compile', (test) => {
        let expr = new BinaryExpression([new TwingNodeExpressionConstant('foo', 1, 1), new TwingNodeExpressionConstant('bar', 1, 1)], 1, 1);
        let compiler = new TwingCompiler(new TwingEnvironmentNode(new TwingLoaderArray({})));

        compiler.compile(expr);

        test.same(compiler.getSource(), '(\`foo\`  \`bar\`)');

        test.end();
    });

    test.end();
});