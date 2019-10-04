import * as tape from 'tape';
import {TwingNode} from "../../../../../../../src/lib/node";
import {TwingNodeExpressionAssignName} from "../../../../../../../src/lib/node/expression/assign-name";
import {TwingNodeExpressionArrowFunction} from "../../../../../../../src/lib/node/expression/arrow-function";
import {TwingNodeExpressionConstant} from "../../../../../../../src/lib/node/expression/constant";
import {MockCompiler} from "../../../../../../mock/compiler";

tape('node/expression/arrow-function', (test) => {
    test.test('constructor', (test) => {
        let names = new TwingNode(new Map([[0 ,new TwingNodeExpressionAssignName('a', 1, 1)]]));
        let node = new TwingNodeExpressionArrowFunction(new TwingNodeExpressionConstant('foo', 1, 1), names, 1, 1);

        test.same(node.getNode('names'), names);

        test.end();
    });

    test.test('compile', (test) => {
        let compiler = new MockCompiler();
        let expected = `($__a__, $__b__) => {context.proxy['a'] = $__a__; context.proxy['b'] = $__b__; return \`foo\`;}`;

        let names = new TwingNode(new Map([
            [0 ,new TwingNodeExpressionAssignName('a', 1, 1)],
            [1 ,new TwingNodeExpressionAssignName('b', 1, 1)]
        ]));
        let node = new TwingNodeExpressionArrowFunction(new TwingNodeExpressionConstant('foo', 1, 1), names, 1, 1);

        test.same(compiler.compile(node).getSource(), expected);
        test.end();
    });

    test.end();
});
