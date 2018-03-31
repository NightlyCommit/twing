const TwingTestMockCompiler = require('../../../../../mock/compiler');
const TwingNodeExpressionName = require('../../../../../../lib/twing/node/expression/name').TwingNodeExpressionName;
const TwingTestEnvironmentStub = require('../../../../../mock/environment');
const TwingTestMockLoader = require('../../../../../mock/loader');
const TwingCompiler = require('../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../lib/twing/loader/array').TwingLoaderArray;

const tap = require('tap');

tap.test('node/expression/name', function (test) {
    test.test('constructor', function (test) {
        let node = new TwingNodeExpressionName('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.end();
    });

    test.test('compile', function (test) {
        let node = new TwingNodeExpressionName('foo', 1);
        let self = new TwingNodeExpressionName('_self', 1);
        let context = new TwingNodeExpressionName('_context', 1);

        let loader = new TwingTestMockLoader();
        let compiler = new TwingTestMockCompiler(new TwingTestEnvironmentStub(loader, {strict_variables: true}));
        let compiler1 = new TwingTestMockCompiler(new TwingTestEnvironmentStub(loader, {strict_variables: false}));

        test.same(compiler.compile(node).getSource(), `// line 1
(context.has("foo") ? context.get("foo") : (() => { throw new Twing.TwingErrorRuntime('Variable "foo" does not exist.', 1, this.getSourceContext()); })())`);
        test.same(compiler1.compile(node).getSource(), `// line 1
(context.has("foo") ? context.get("foo") : null)`);
        test.same(compiler.compile(self).getSource(), `// line 1
this.getTemplateName()`);
        test.same(compiler.compile(context).getSource(), `// line 1
context`);

        test.test('when "is_defined_test" is set to true', function(test) {
            test.test('and name is special', function(test) {
                let node = new TwingNodeExpressionName('_self', 1);

                node.setAttribute('is_defined_test', true);

                let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

                test.same(compiler.compile(node).getSource(), `// line 1
true`);

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.test('isSimple', function (test) {
        let testCases = [
            ['_self', false],
            ['_context', false],
            ['_charset', false],
            ['foo', true],
        ];

        for (let testCase of testCases) {
            test.equals(new TwingNodeExpressionName(testCase[0], 1).isSimple(), testCase[1], `should return ${testCase[1]} for "${testCase[0]}"`);
        }

        test.test('when "is_defined_test" is set to true', function(test) {
            for (let testCase of testCases) {
                let node = new TwingNodeExpressionName(testCase[0], 1);

                node.setAttribute('is_defined_test', true);

                test.false(node.isSimple(), `should return false for "${testCase[0]}"`);
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
