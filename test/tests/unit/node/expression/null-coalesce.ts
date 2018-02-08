import {Test} from "tape";
import TwingMap from "../../../../../src/map";
import TwingNodeExpressionConstant from "../../../../../src/node/expression/constant";
import TwingTestCompilerStub from "../../../../compiler-stub";
import TwingNodeExpressionHash from "../../../../../src/node/expression/hash";
import TwingNodeExpressionAssignName from "../../../../../src/node/expression/assign-name";
import TwingNodeExpressionName from "../../../../../src/node/expression/name";
import TwingNodeExpressionNullCoalesce from "../../../../../src/node/expression/null-coalesce";

const tap = require('tap');

tap.test('node/expression/null-coalesce', function (test: Test) {
    test.test('compile', function (test: Test) {
        let compiler = new TwingTestCompilerStub();

        let left = new TwingNodeExpressionName('foo', 1);
        let right = new TwingNodeExpressionConstant(2, 1);
        let node = new TwingNodeExpressionNullCoalesce(left, right, 1);

        test.same(compiler.compile(node).getSource(), `((!!(// line 1
(context.has("foo")) &&  !(context.get("foo") === null))) ? (context.get("foo")) : (2))`);
        test.end();
    });

    test.end();
});