import * as tape from 'tape';
import TestNodeTestCase from "./test-case";
import TwingNodeExpressionConstant from "../../src/node/expression/constant";
import TwingNodeInclude from "../../src/node/include";
import TwingNodeExpressionArray from "../../src/node/expression/array";
import TwingMap from "../../src/map";
import TwingNodeExpressionConditional from "../../src/node/expression/conditional";

let nodeTestCase = new TestNodeTestCase();

tape('node/include', function (test) {
    test.plan(2);

    test.test('testConstructor', function (test) {
        let expr = new TwingNodeExpressionConstant('foo.twig', 1);
        let node = new TwingNodeInclude(expr, null, false, false, 1);

        test.false(node.hasNode('variables'));
        test.equal(expr, node.getNode('expr'));
        test.false(node.getAttribute('only'));

        let nodes = new TwingMap();

        nodes.push(new TwingNodeExpressionConstant('foo', 1));
        nodes.push(new TwingNodeExpressionConstant(true, 1));

        let vars = new TwingNodeExpressionArray(nodes, 1);

        node = new TwingNodeInclude(expr, vars, true, false, 1);

        test.equal(vars, node.getNode('variables'));
        test.true(node.getAttribute('only'));

        test.end();
    });

    test.test('testCompile', function (test) {
        let nodes;
        let vars;

        let expr = new TwingNodeExpressionConstant('foo.twig', 1);
        let node = new TwingNodeInclude(expr, null, false, false, 1);


        nodeTestCase.assertNodeCompilation(test, node, '// line 1\n' +
            '\$this->loadTemplate(\'foo.twig\', null, 1)->display(\$context);');

        // conditional
        expr = new TwingNodeExpressionConditional(
            new TwingNodeExpressionConstant(true, 1),
            new TwingNodeExpressionConstant('foo', 1),
            new TwingNodeExpressionConstant('foo', 1),
            0);
        node = new TwingNodeInclude(expr, null, false, false, 1);

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\n' +
            '\$this->loadTemplate(((true) ? (\'foo\') : (\'foo\')), null, 1)->display(\$context);');

        // with vars
        expr = new TwingNodeExpressionConstant('foo.twig', 1);

        nodes = new TwingMap();

        nodes.push(new TwingNodeExpressionConstant('foo', 1));
        nodes.push(new TwingNodeExpressionConstant(true, 1));

        vars = new TwingNodeExpressionArray(nodes, 1);
        node = new TwingNodeInclude(expr, vars, false, false, 1);

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\n' +
            '\$this->loadTemplate(\'foo.twig\', null, 1)->display(array_merge(\$context, array(\'foo\' => true)));');

        // with vars and only
        node = new TwingNodeInclude(expr, vars, true, false, 1);

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\n' +
            '\$this->loadTemplate(\'foo.twig\', null, 1)->display(array(\'foo\' => true));');

        // with vars and only and ignore_missing
        node = new TwingNodeInclude(expr, vars, true, true, 1);

        nodeTestCase.assertNodeCompilation(test, node, '// line 1\n' +
            'try {\n' +
            '    \$this->loadTemplate(\'foo.twig\', null, 1)->display(array(\'foo\' => true));\n' +
            '} catch (Twig_Error_Loader \$e) {\n' +
            '    // ignore missing template\n' +
            '}');

        test.end();
    });
});
