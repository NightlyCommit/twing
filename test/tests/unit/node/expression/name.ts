import {Test} from "tape";
import {TwingTestCompilerStub} from "../../../../compiler-stub";
import {TwingNodeExpressionName} from "../../../../../src/node/expression/name";
import {TwingTestEnvironmentStub} from "../../../../environment-stub";
import {TwingTestLoaderStub} from "../../../../loader-stub";

const tap = require('tap');

tap.test('node/expression/name', function (test: Test) {
    test.test('constructor', function (test: Test) {
        let node = new TwingNodeExpressionName('foo', 1);

        test.same(node.getAttribute('name'), 'foo');
        test.end();
    });

    test.test('compile', function (test: Test) {
        let node = new TwingNodeExpressionName('foo', 1);
        let self = new TwingNodeExpressionName('_self', 1);
        let context = new TwingNodeExpressionName('_context', 1);

        let loader = new TwingTestLoaderStub();
        let compiler = new TwingTestCompilerStub(new TwingTestEnvironmentStub(loader, {strict_variables: true}));
        let compiler1 = new TwingTestCompilerStub(new TwingTestEnvironmentStub(loader, {strict_variables: false}));

        test.same(compiler.compile(node).getSource(), `// line 1
(context.has("foo") ? context.get("foo") : (() => { throw new Twing.TwingErrorRuntime('Variable "foo" does not exist.', 1, this.getSourceContext()); })())`);
        test.same(compiler1.compile(node).getSource(), `// line 1
(context.has("foo") ? context.get("foo") : null)`);
        test.same(compiler.compile(self).getSource(), `// line 1
this.getTemplateName()`);
        test.same(compiler.compile(context).getSource(), `// line 1
context`);

        test.end();
    });

    test.end();
});
