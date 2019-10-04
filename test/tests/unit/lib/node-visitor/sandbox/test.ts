import * as tape from 'tape';
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingNodeVisitorSandbox} from "../../../../../../src/lib/node-visitor/sandbox";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";

tape('node-visitor/sandbox', (test) => {
    test.test('doEnterNode', (test) => {
        test.test('with not "module" node', function(test) {
            let env = new TwingEnvironmentNode(new TwingLoaderArray({}));
            let visitor = new TwingNodeVisitorSandbox();
            let node = new TwingNodeExpressionConstant('foo', 1, 1);

            test.equals(visitor.enterNode(node, env), node, 'returns the node untouched');

            test.end();
        });

        test.end();
    });

    test.end();
});