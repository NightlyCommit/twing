import {Test} from "tape";
import TwingTestCompilerStub from "../../../compiler-stub";
import TwingNodeExpressionConstant from "../../../../src/node/expression/constant";
import TwingNodeInclude from "../../../../src/node/include";
import TwingMap from "../../../../src/map";
import TwingNodeExpressionArray from "../../../../src/node/expression/array";
import TwingNodeExpressionConditional from "../../../../src/node/expression/conditional";
import TwingNodeExpressionHash from "../../../../src/node/expression/hash";
import TwingNodeType from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/include', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant('foo.twig', 1);
        let node = new TwingNodeInclude(expr, null, false, false, 1);

        test.false(node.hasNode('variables'));
        test.same(node.getNode('expr'), expr);
        test.false(node.getAttribute('only'));

        let arrayNodes = new TwingMap();

        arrayNodes.push(new TwingNodeExpressionConstant('foo', 1));
        arrayNodes.push(new TwingNodeExpressionConstant(true, 1));

        let vars = new TwingNodeExpressionArray(arrayNodes, 1);
        node = new TwingNodeInclude(expr, vars, true, false, 1);

        test.same(node.getNode('variables'), vars);
        test.true(node.getAttribute('only'));
        test.same(node.getType(), TwingNodeType.INCLUDE);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        test.test('basic', function(test: Test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1);
            let node = new TwingNodeInclude(expr, null, false, false, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
await this.loadTemplate("foo.twig", null, 1).display(context);
`);
            test.end();
        });

        test.test('with condition', function(test: Test) {
            let expr = new TwingNodeExpressionConditional(
                new TwingNodeExpressionConstant(true, 1),
                new TwingNodeExpressionConstant('foo', 1),
                new TwingNodeExpressionConstant('foo', 1),
                0
            );
            let node = new TwingNodeInclude(expr, null, false, false, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
await this.loadTemplate(((true) ? ("foo") : ("foo")), null, 1).display(context);
`);
            test.end();
        });

        test.test('with variables', function(test: Test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1);

            let hashNodes = new TwingMap();

            hashNodes.push(new TwingNodeExpressionConstant('foo', 1));
            hashNodes.push(new TwingNodeExpressionConstant(true, 1));

            let vars = new TwingNodeExpressionHash(hashNodes, 1);
            let node = new TwingNodeInclude(expr, vars, false, false, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
await this.loadTemplate("foo.twig", null, 1).display(Twing.twingArrayMerge(context, new Twing.TwingMap([["foo", true]])));
`);
            test.end();
        });

        test.test('with variables only', function(test: Test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1);

            let hashNodes = new TwingMap();

            hashNodes.push(new TwingNodeExpressionConstant('foo', 1));
            hashNodes.push(new TwingNodeExpressionConstant(true, 1));

            let vars = new TwingNodeExpressionHash(hashNodes, 1);

            let node = new TwingNodeInclude(expr, vars, true, false, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
await this.loadTemplate("foo.twig", null, 1).display(new Twing.TwingMap([["foo", true]]));
`);
            test.end();
        });

        test.test('with only and no variables', function(test: Test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1);
            let node = new TwingNodeInclude(expr, null, true, false, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
await this.loadTemplate("foo.twig", null, 1).display(new Twing.TwingMap());
`);
            test.end();
        });

        test.test('with ignore missing', function(test: Test) {
            let expr = new TwingNodeExpressionConstant('foo.twig', 1);

            let hashNodes = new TwingMap();

            hashNodes.push(new TwingNodeExpressionConstant('foo', 1));
            hashNodes.push(new TwingNodeExpressionConstant(true, 1));

            let vars = new TwingNodeExpressionHash(hashNodes, 1);

            let node = new TwingNodeInclude(expr, vars, true, true, 1);

            test.same(compiler.compile(node).getSource(), `// line 1
try {
    await this.loadTemplate("foo.twig", null, 1).display(new Twing.TwingMap([["foo", true]]));
}
catch (e) {
    if (e instanceof Twing.TwingErrorLoader) {
        // ignore missing template
    }
    else {
        throw e;
    }
}

`);
            test.end();
        });

        test.end();
    });

    test.end();
});