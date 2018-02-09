import {Test} from "tape";
import TwingMap from "../../../../../src/map";
import TwingNodeExpressionConstant from "../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../compiler-stub";
import TwingNodeExpressionHash from "../../../../../src/node/expression/hash";
import TwingNodeExpressionAssignName from "../../../../../src/node/expression/assign-name";

const tap = require('tap');

tap.test('node/expression/assign-name', function (test: Test) {
    test.test('constructor', function(test: Test) {
        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.end();
    });

    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let node = new TwingNodeExpressionAssignName('foo', 1);

        test.same(compiler.compile(node).getSource(), 'Twing.getContextProxy(context)["foo"]');
        test.end();
    });

    test.end();
});