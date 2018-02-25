import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../../compiler-stub";
import {TwingNodeExpressionConstant} from "../../../../../src/node/expression/constant";

const tap = require('tap');

tap.test('node/expression/constant', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let node = new TwingNodeExpressionConstant('foo', 1);

        test.same(node.getAttribute('value'), 'foo');

        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionConstant('foo', 1);

        test.same(compiler.compile(node).getSource(), '"foo"');
        test.end();
    });

    test.end();
});
