const tap = require('tape');
const {TwingNodeExpressionFilterDefault} = require("../../../../../../../build/node/expression/filter/default");
const {TwingCompiler} = require("../../../../../../../build/compiler");
const {TwingEnvironmentNode: TwingEnvironment} = require("../../../../../../../build/environment/node");
const {TwingLoaderArray} = require("../../../../../../../build/loader/array");
const {TwingNodeExpressionName} = require("../../../../../../../build/node/expression/name");
const {TwingNodeExpressionConstant} = require("../../../../../../../build/node/expression/constant");
const {TwingNode} = require("../../../../../../../build/node");

tap.test('node/expression/filter/default', function (test) {
    test.test('compile', function (test) {
        test.test('when filter is \`default\` and \`EXPRESSION_NAME\` or \`EXPRESSION_GET_ATTR\` node', function (test) {
            let node = new TwingNodeExpressionFilterDefault(
                new TwingNodeExpressionName('foo', 1, 1),
                new TwingNodeExpressionConstant('default', 1, 1),
                new TwingNode(),
                1, 1
            );

            let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

            test.same(compiler.compile(node).getSource(), `((// line 1, column 1
(context.has(\`foo\`))) ? (this.env.getFilter('default').traceableCallable(1, this.source)(...[(context.has(\`foo\`) ? context.get(\`foo\`) : null)])) : (\`\`))`);

            test.end();
        });

        test.end();
    });

    test.end();
});
