const {
    TwingProfilerNodeVisitorProfiler,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeModule,
    TwingNodeText,
    TwingNodeExpressionConstant,
    TwingNode,
    TwingSource,
    TwingNodeType,
    TwingNodeBlock,
    TwingNodeMacro
} = require("../../../../../../../dist/index");

const tap = require('tape');

tap.test('profiler/node-visitor/profiler', function (test) {
    test.test('doEnterNode', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({}));
        let visitor = new TwingProfilerNodeVisitorProfiler('foo');
        let node = new TwingNode();

        let doEnterNode = Reflect.get(visitor, 'doEnterNode').bind(visitor);

        test.equals(doEnterNode(node, env), node, 'returns the node');
        test.same(doEnterNode(node, env), node, 'returns the node untouched');

        test.end();
    });

    test.test('doLeaveNode', function (test) {
        let env = new TwingEnvironment(new TwingLoaderArray({}));
        let visitor = new TwingProfilerNodeVisitorProfiler('foo');
        let doLeaveNode = Reflect.get(visitor, 'doLeaveNode').bind(visitor);

        let node = new TwingNode();
        let leftNode = doLeaveNode(node, env);

        test.equals(leftNode, node, 'returns the node');
        test.same(leftNode, node, 'returns the node untouched');

        test.test('when the node is of type "MODULE"', function (test) {
            let body = new TwingNodeText('foo', 1);
            let parent = new TwingNodeExpressionConstant('layout.twig', 1);
            let blocks = new TwingNode();
            let macros = new TwingNode();
            let traits = new TwingNode();
            let source = new TwingSource('{{ foo }}', 'foo.twig');
            let module = new TwingNodeModule(body, parent, blocks, macros, traits, [], source);

            let leftNode = doLeaveNode(module, env);

            test.equals(leftNode.getNode('display_start').getNode(0).getType(), TwingNodeType.PROFILER_ENTER_PROFILE);
            test.equals(leftNode.getNode('display_end').getNode(0).getType(), TwingNodeType.PROFILER_LEAVE_PROFILE);

            test.end();
        });

        test.test('when the node is of type "BLOCK"', function (test) {
            let body = new TwingNodeText('foo', 1);
            let block = new TwingNodeBlock('foo', body, 1);

            let leftNode = doLeaveNode(block, env);

            test.equals(leftNode.getNode('body').getNode(0).getType(), TwingNodeType.PROFILER_ENTER_PROFILE);
            test.equals(leftNode.getNode('body').getNode(2).getType(), TwingNodeType.PROFILER_LEAVE_PROFILE);

            test.end();
        });

        test.test('when the node is of type "MACRO"', function (test) {
            let body = new TwingNodeText('foo', 1);
            let macro = new TwingNodeMacro('foo', body, new TwingNode(), 1);

            let leftNode = doLeaveNode(macro, env);

            test.equals(leftNode.getNode('body').getNode(0).getType(), TwingNodeType.PROFILER_ENTER_PROFILE);
            test.equals(leftNode.getNode('body').getNode(2).getType(), TwingNodeType.PROFILER_LEAVE_PROFILE);

            test.end();
        });

        test.end();
    });

    test.test('getVarName', function(test) {
        let visitor = new TwingProfilerNodeVisitorProfiler('foo');
        let getVarName = Reflect.get(visitor, 'getVarName').bind(visitor);

        test.true(getVarName().match(/^__internal_([0-9a-f])+$/g));

        test.end();
    });

    test.test('getPriority', function(test) {
        let visitor = new TwingProfilerNodeVisitorProfiler('foo');

        test.equal(visitor.getPriority(), 0);

        test.end();
    });

    test.end();
});