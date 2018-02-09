import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeDo from "../../../../src/node/do";
import TwingMap from "../../../../src/map";
import TwingNodePrint from "../../../../src/node/print";
import TwingNodeExpressionName from "../../../../src/node/expression/name";
import TwingNode from "../../../../src/node";
import TwingNodeIf from "../../../../src/node/if";

const tap = require('tap');

tap.test('node/if', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let tNodes = new TwingMap();

        tNodes.push(new TwingNodeExpressionConstant(true, 1));
        tNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

        let t = new TwingNode(tNodes, new TwingMap(), 1);
        let else_: TwingNode = null;
        let node = new TwingNodeIf(t, else_, 1);

        test.same(node.getNode('tests'), t);
        test.false(node.hasNode('else'));

        else_ = new TwingNodePrint(new TwingNodeExpressionName('bar', 1), 1);
        node = new TwingNodeIf(t, else_, 1);

        test.same(node.getNode('else'), else_);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        test.test('without else', function(test: Test) {
            let tNodes = new TwingMap();

            tNodes.push(new TwingNodeExpressionConstant(true, 1));
            tNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

            let t = new TwingNode(tNodes, new TwingMap(), 1);
            let else_: TwingNode = null;
            let node = new TwingNodeIf(t, else_, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
if (true) {
    Twing.echo((context.has("foo") ? context.get("foo") : null));
}
`);
            test.end();
        });

        test.test('with multiple tests', function(test: Test) {
            let tNodes = new TwingMap();

            tNodes.push(new TwingNodeExpressionConstant(true, 1));
            tNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));
            tNodes.push(new TwingNodeExpressionConstant(false, 1));
            tNodes.push(new TwingNodePrint(new TwingNodeExpressionName('bar', 1), 1));

            let t = new TwingNode(tNodes, new TwingMap(), 1);
            let else_: TwingNode = null;

            let node = new TwingNodeIf(t, else_, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
if (true) {
    Twing.echo((context.has("foo") ? context.get("foo") : null));
}
else if (false) {
    Twing.echo((context.has("bar") ? context.get("bar") : null));
}
`);
            test.end();
        });

        test.test('with else', function(test: Test) {
            let tNodes = new TwingMap();

            tNodes.push(new TwingNodeExpressionConstant(true, 1));
            tNodes.push(new TwingNodePrint(new TwingNodeExpressionName('foo', 1), 1));

            let t = new TwingNode(tNodes, new TwingMap(), 1);
            let else_ = new TwingNodePrint(new TwingNodeExpressionName('bar', 1), 1);

            let node = new TwingNodeIf(t, else_, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
if (true) {
    Twing.echo((context.has("foo") ? context.get("foo") : null));
}
else {
    Twing.echo((context.has("bar") ? context.get("bar") : null));
}
`);
            test.end();
        });

        test.end();
    });

    test.end();
});