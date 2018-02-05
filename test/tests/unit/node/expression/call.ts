import {Test} from "tape";
import TwingNodeExpressionCall from "../../../../../src/node/expression/call";
import TwingNode from "../../../../../src/node";
import TwingMap from "../../../../../src/map";

const tap = require('tap');

class TwingTestsNodeExpressionCall extends TwingNodeExpressionCall {
    getArguments(callable: Function = null, argumentsNode: TwingNode) {
        return super.getArguments(callable, argumentsNode);
    }
}

function getArguments(node: TwingTestsNodeExpressionCall, args: Array<any>) {
    let t = new TwingMap();

    for (let k in args[1]) {
        t.set(k, args[1][k]);
    }

    let argumentsNode = new TwingNode(t);

    return node.getArguments.apply(node, [args[0], argumentsNode]);
}

function parseIntProxy(string: string, radix: number) {
    return parseInt(string, radix);
}

tap.test('node/expression/call', function (test: Test) {
    test.test('getArguments', function (test: Test) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'parseInt']
        ]));

        test.same(
            getArguments(node, [parseIntProxy, {'string': 'foo', 'radix': null}]),
            ['foo', null]
        );

        test.end();
    });

    test.end();
});