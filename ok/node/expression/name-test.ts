import * as tape from 'tape';
import TestNodeTestCase from "./../test-case";
import TwingNodeExpressionName from "../../../src/node/expression/name";
import TwingLoaderFilesystem from "../../../src/loader/filesystem";
import TwingEnvironment = require("../../../src/environment");

let nodeTestCase = new TestNodeTestCase();

tape('node/expression/name', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let node = new TwingNodeExpressionName('foo', 1);

        test.equal('foo', node.getAttribute('name'));

        test.end()
    });

    test.test('testCompile', function (test) {
        let node = new TwingNodeExpressionName('foo', 1);
        let self = new TwingNodeExpressionName('_self', 1);
        let context = new TwingNodeExpressionName('_context', 1);

        let env = new TwingEnvironment(new TwingLoaderFilesystem(), {strict_variables: true});
        let env1 = new TwingEnvironment(new TwingLoaderFilesystem(), {strict_variables: false});

        let output = '(context.has(\'foo\') ? context.get(\'foo\') : (function () { throw new TwingErrorRuntime(\'Variable "foo" does not exist.\', 1, this.getSourceContext()); })())';

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\n' + output, env);
        nodeTestCase.assertNodeCompilation(test, node, nodeTestCase.getVariableGetter('foo', 1), env1);
        nodeTestCase.assertNodeCompilation(test, self, '// line 1\nthis.getTemplateName()');
        nodeTestCase.assertNodeCompilation(test, context, '// line 1\ncontext');

        test.end();
    });
});