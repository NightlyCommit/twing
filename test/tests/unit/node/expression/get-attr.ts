import {Test} from "tape";
import {TwingMap} from "../../../../../src/map";
import {TwingNodeExpressionConstant} from "../../../../../src/node/expression/constant";
import {TwingTestCompilerStub} from "../../../../compiler-stub";
import {TwingNodeExpressionName} from "../../../../../src/node/expression/name";
import {TwingNodeExpressionArray} from "../../../../../src/node/expression/array";
import {TwingNodeExpressionGetAttr} from "../../../../../src/node/expression/get-attr";
import {TwingTemplate} from "../../../../../src/template";

const tap = require('tap');

tap.test('node/expression/get-attr', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionName('foo', 1);
        let attr = new TwingNodeExpressionConstant('bar', 1);
        let args = new TwingNodeExpressionArray(new TwingMap(), 1);
        args.addElement(new TwingNodeExpressionName('foo', 1));
        args.addElement(new TwingNodeExpressionConstant('bar', 1));
        let node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ARRAY_CALL, 1);

        test.same(node.getNode('node'), expr);
        test.same(node.getNode('attribute'), attr);
        test.same(node.getNode('arguments'), args);
        test.same(node.getAttribute('type'), TwingTemplate.ARRAY_CALL);
        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let expr = new TwingNodeExpressionName('foo', 1);
        let attr = new TwingNodeExpressionConstant('bar', 1);
        let args = new TwingNodeExpressionArray(new TwingMap(), 1);
        let node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ANY_CALL, 1);

        test.same(compiler.compile(node).getSource(), `Twing.twingGetAttribute(this.env, this.getSourceContext(), // line 1
(context.has("foo") ? context.get("foo") : null), "bar", [])`);

        node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.ARRAY_CALL, 1);

        test.same(compiler.compile(node).getSource(), `Twing.twingGetAttribute(this.env, this.getSourceContext(), // line 1
(context.has("foo") ? context.get("foo") : null), "bar", [], "array")`);

        args = new TwingNodeExpressionArray(new TwingMap(), 1);
        args.addElement(new TwingNodeExpressionName('foo', 1));
        args.addElement(new TwingNodeExpressionConstant('bar', 1));
        node = new TwingNodeExpressionGetAttr(expr, attr, args, TwingTemplate.METHOD_CALL, 1);

        test.same(compiler.compile(node).getSource(), `Twing.twingGetAttribute(this.env, this.getSourceContext(), // line 1
(context.has("foo") ? context.get("foo") : null), "bar", [(context.has("foo") ? context.get("foo") : null), "bar"], "method")`);

        test.end();
    });

    test.end();
});
