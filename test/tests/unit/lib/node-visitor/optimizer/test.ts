import * as tape from 'tape';
import {TwingNodeVisitorOptimizer} from "../../../../../../src/lib/node-visitor/optimizer";
import {TwingNode} from "../../../../../../src/lib/node";

tape('node-visitor/optimizer', (test) => {
    test.test('enterNode', (test) => {
        let visitor = new TwingNodeVisitorOptimizer();
        let node = new TwingNode();

        test.same(visitor.enterNode(node, null), node);

        test.end();
    });

    test.test('leaveNode', (test) => {
        let visitor = new TwingNodeVisitorOptimizer();
        let node = new TwingNode();

        test.same(visitor.leaveNode(node, null), node);

        test.end();
    });

    test.test('getPriority', (test) => {
        let visitor = new TwingNodeVisitorOptimizer();

        test.same(visitor.getPriority(), 255);

        test.end();
    });

    test.end();
});
