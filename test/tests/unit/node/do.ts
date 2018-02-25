import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../compiler-stub";
import {TwingNodeExpressionConstant} from "../../../../src/node/expression/constant";
import {TwingNodeDo} from "../../../../src/node/do";
import {TwingNodeType} from "../../../../src/node-type";

const tap = require('tap');

tap.test('node/do', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodeDo(expr, 1);

        test.same(node.getNode('expr'), expr);
        test.same(node.getType(), TwingNodeType.DO);

        test.end();
    });

    test.test('compile', function (test: Test) {
        let expr = new TwingNodeExpressionConstant('foo', 1);
        let node = new TwingNodeDo(expr, 1);
        let compiler = new TwingTestCompilerStub();

        test.same(compiler.compile(node).getSource(), `// line 1
"foo";
`);

        test.end();
    });

    test.end();
});