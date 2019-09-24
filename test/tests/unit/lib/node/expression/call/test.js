const {
    TwingNodeExpressionCall,
    TwingNode,
    TwingCompiler,
    TwingEnvironment,
    TwingLoaderArray
} = require('../../../../../../../build/main');

const tap = require('tape');

class TwingTestsNodeExpressionCall extends TwingNodeExpressionCall {
    getArguments(callable = null, argumentsNode, env) {
        return super.getArguments(callable, argumentsNode, env);
    }
}

function getArguments(node, args) {
    let argumentsNode = new TwingNode(args[1]);

    return node.getArguments.apply(node, [args[0], argumentsNode]);
}

function date(format, timestamp) {

}

function customFunction(arg1, arg2 = 'default', arg3 = []) {
}

class TwingTestsNodeExpressionCallTest {
    customFunctionWithArbitraryArguments() {
    }
}

function custom_Twig_Tests_Node_Expression_CallTest_function(required) {
}

class Callable extends TwingNodeExpressionCall {
    compile(compiler) {
        this.setAttribute('type', 'function');

        this.compileCallable(compiler);
    }
}

tap.test('node/expression/call', function (test) {
    test.test('getArguments', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'format'},
            {name: 'timestamp'}
        ]);

        test.same(
            getArguments(node, [date, new Map([['format', 'Y-m-d'], ['timestamp', null]])]),
            ['Y-m-d', null]
        );

        test.test('with null callable', function (test) {
            node = new TwingTestsNodeExpressionCall(new Map(), new Map([
                ['type', 'function'],
                ['name', 'date'],
                ['is_variadic', true]
            ]));

            try {
                getArguments(node, [null, new Map([[0, 'bar']])]);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Arbitrary positional arguments are not supported for function "date".')
            }

            try {
                getArguments(node, [null, new Map([['foo', 'bar']])]);

                test.fail();
            } catch (e) {
                test.same(e.message, 'Named arguments are not supported for function "date".')
            }

            test.end();
        });

        test.test('supports unset accepted_arguments attribute', function (test) {
            let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
                ['type', 'function'],
                ['name', 'anonymous']
            ]));

            node.setAttribute('is_variadic', true);

            test.same(
                getArguments(node, [() => {}, new Map()]),
                []
            );

            test.end();
        });

        test.end();
    });

    test.test('getArgumentsWhenPositionalArgumentsAfterNamedArguments', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        try {
            getArguments(node, [date, new Map([['timestamp', 123456], [0, 'Y-m-d']])]);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Positional arguments cannot be used after named arguments for function "date".')
        }

        test.end();
    });

    test.test('testGetArgumentsWhenArgumentIsDefinedTwice', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'format'},
            {name: 'timestamp'}
        ]);

        try {
            getArguments(node, [date, new Map([[0, 'Y-m-d'], ['format', 'U']])]);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Argument "format" is defined twice for function "date".')
        }

        test.end();
    });

    test.test('testGetArgumentsWithWrongNamedArgumentName', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'format'},
            {name: 'timestamp'}
        ]);

        try {
            getArguments(node, [date, new Map([[0, 'Y-m-d'], ['timestamp', null], ['unknown', '']])]);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Unknown argument "unknown" for function "date(format, timestamp)".')
        }

        test.end();
    });

    test.test('testGetArgumentsWithWrongNamedArgumentNames', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'format'},
            {name: 'timestamp'}
        ]);

        try {
            getArguments(node, [date, new Map([[0, 'Y-m-d'], ['timestamp', null], ['unknown1', ''], ['unknown2', '']])]);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Unknown arguments "unknown1", "unknown2" for function "date(format, timestamp)".')
        }

        test.end();
    });

    test.test('testResolveArgumentsOnlyNecessaryArgumentsForCustomFunction', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'custom_function']
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'arg1'},
            {name: 'arg2', defaultValue: 'default'},
            {name: 'arg3', defaultValue: []}
        ]);

        test.same(
            getArguments(node, [customFunction, new Map([['arg1', 'arg1']])]),
            ['arg1']
        );

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArguments', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'arg1'}
        ]);

        let callTest = new TwingTestsNodeExpressionCallTest();

        try {
            getArguments(node, [callTest.customFunctionWithArbitraryArguments, new Map()]);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Value for argument "arg1" is required for function "foo".')
        }

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArgumentsOnFunction', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        node.setAttribute('accepted_arguments', [
            {name: 'required'}
        ]);

        try {
            getArguments(node, [custom_Twig_Tests_Node_Expression_CallTest_function, new Map()]);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Value for argument "required" is required for function "foo".')
        }

        test.end();
    });

    test.test('compile', function (test) {
        let compiler = new TwingCompiler(new TwingEnvironment(new TwingLoaderArray({})));

        let node = new Callable(new Map(), new Map([
            ['callable', 'foo']
        ]));

        compiler.compile(node);

        test.same(compiler.getSource(), 'foo(...[])');

        test.end();
    });

    test.end();
});
