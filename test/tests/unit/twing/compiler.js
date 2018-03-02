const TwingTestCompilerStub = require('../../../compiler-stub');
const TwingNode = require('../../../../lib/twing/node').TwingNode;

const tap = require('tap');

tap.test('compiler', function (test) {
    test.test('should escape all forms of line-feeds', function (test) {
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
