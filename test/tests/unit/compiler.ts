import {Test} from "tape";
import {TwingTestCompilerStub} from "../../compiler-stub";
import {TwingNode} from "../../../src/node";

const tap = require('tap');

tap.test('compiler', function (test: Test) {
    test.test('should escape all forms of line-feeds', function (test: Test) {
        let compiler = new TwingTestCompilerStub();
        let node = new TwingNode();

        compiler
            .compile(node)
            .string('\n\r')
        ;

        test.same(compiler.getSource(), '"\\n\\r"');

        test.end();
    });

    test.end();
});
