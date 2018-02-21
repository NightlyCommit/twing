import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeDo from "../../../../src/node/do";
import TwingMap from "../../../../src/map";
import TwingNodeExpressionAssignName from "../../../../src/node/expression/assign-name";
import TwingNodeSet from "../../../../src/node/set";
import TwingNode from "../../../../src/node";
import TwingNodePrint from "../../../../src/node/print";
import TwingNodeText from "../../../../src/node/text";
import TwingNodeType from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/set', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let namesNodes = new TwingMap();

        namesNodes.push(new TwingNodeExpressionAssignName('foo', 1));

        let namesNode = new TwingNode(namesNodes, new TwingMap(), 1);

        let valuesNodes = new TwingMap();

        valuesNodes.push(new TwingNodeExpressionConstant('foo', 1));

        let valuesNode = new TwingNode(valuesNodes, new TwingMap(), 1);

        let node = new TwingNodeSet(false, namesNode, valuesNode, 1);

        test.same(node.getNode('names'), namesNode);
        test.same(node.getNode('values'), valuesNode);
        test.false(node.getAttribute('capture'));
        test.same(node.getType(), TwingNodeType.SET);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        test.test('basic', function (test: Test) {
            let namesNodes = new TwingMap();

            namesNodes.push(new TwingNodeExpressionAssignName('foo', 1));

            let namesNode = new TwingNode(namesNodes, new TwingMap(), 1);

            let valuesNodes = new TwingMap();

            valuesNodes.push(new TwingNodeExpressionConstant('foo', 1));

            let valuesNode = new TwingNode(valuesNodes, new TwingMap(), 1);

            let node = new TwingNodeSet(false, namesNode, valuesNode, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
Twing.getContextProxy(context)["foo"] = "foo";
`);

            test.end();
        });

        test.test('with capture', function (test: Test) {
            let namesNodes = new TwingMap();

            namesNodes.push(new TwingNodeExpressionAssignName('foo', 1));

            let namesNode = new TwingNode(namesNodes, new TwingMap(), 1);

            let valuesNodes = new TwingMap();

            valuesNodes.push(new TwingNodePrint(new TwingNodeExpressionConstant('foo', 1), 1));

            let valuesNode = new TwingNode(valuesNodes, new TwingMap(), 1);

            let node = new TwingNodeSet(true, namesNode, valuesNode, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
let tmp;
Twing.obStart();
Twing.echo("foo");
Twing.getContextProxy(context)["foo"] = ((tmp = Twing.obGetClean()) === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset());
`);

            test.end();
        });

        test.test('with capture and text', function (test: Test) {
            let namesNodes = new TwingMap();

            namesNodes.push(new TwingNodeExpressionAssignName('foo', 1));

            let namesNode = new TwingNode(namesNodes, new TwingMap(), 1);
            let valuesNode = new TwingNodeText('foo', 1);

            let node = new TwingNodeSet(true, namesNode, valuesNode, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
let tmp;
Twing.getContextProxy(context)["foo"] = ((tmp = "foo") === '') ? '' : new Twing.TwingMarkup(tmp, this.env.getCharset());
`);

            test.end();
        });

        test.test('with multiple names and values', function (test: Test) {
            let namesNodes = new TwingMap();

            namesNodes.push(new TwingNodeExpressionAssignName('foo', 1));
            namesNodes.push(new TwingNodeExpressionAssignName('bar', 1));

            let namesNode = new TwingNode(namesNodes, new TwingMap(), 1);

            let valuesNodes = new TwingMap();

            valuesNodes.push(new TwingNodeExpressionConstant('foo', 1));
            valuesNodes.push(new TwingNodeExpressionConstant('bar', 1));

            let valuesNode = new TwingNode(valuesNodes, new TwingMap(), 1);

            let node = new TwingNodeSet(false, namesNode, valuesNode, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
[Twing.getContextProxy(context)["foo"], Twing.getContextProxy(context)["bar"]] = ["foo", "bar"];
`);

            test.end();
        });

        test.end();
    });

    test.end();
});