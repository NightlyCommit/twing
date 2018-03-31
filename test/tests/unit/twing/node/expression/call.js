const TwingNodeExpressionCall = require('../../../../../../lib/twing/node/expression/call').TwingNodeExpressionCall;
const TwingNode = require('../../../../../../lib/twing/node').TwingNode;
const TwingCompiler = require('../../../../../../lib/twing/compiler').TwingCompiler;
const TwingEnvironment = require('../../../../../../lib/twing/environment').TwingEnvironment;
const TwingLoaderArray = require('../../../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingErrorSyntax = require('../../../../../../lib/twing/error/syntax').TwingErrorSyntax;
const TwingExtension = require('../../../../../../lib/twing/extension').TwingExtension;

const tap = require('tap');
const sinon = require('sinon');

class TwingTestsNodeExpressionCall extends TwingNodeExpressionCall {
    getArguments(callable = null, argumentsNode) {
        return super.getArguments(callable, argumentsNode);
    }
}

function getArguments(node, args) {
    let argumentsNode = new TwingNode(args[1]);

    return node.getArguments.apply(node, [args[0], argumentsNode]);
}

function date(format, timestamp) {

}

function substr_compare(main_str, str, offset, length, case_sensitivity) {

}

function customFunction(arg1, arg2 = 'default', arg3 = []) {
}

class TwingTestsNodeExpressionCallTest {
    customFunctionWithArbitraryArguments() {
    }
}

function custom_Twig_Tests_Node_Expression_CallTest_function(required) {
}

class CallableTestClass {
    __invoke(required) {
    }
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

            test.throws(function () {
                getArguments(node, [null, new Map([[0, 'bar']])]);
            }, new Error('Arbitrary positional arguments are not supported for function "date".'));

            test.throws(function () {
                getArguments(node, [null, new Map([['foo', 'bar']])]);
            }, new Error('Named arguments are not supported for function "date".'));

            test.end();
        });

        test.end();
    });

    test.test('getArgumentsWhenPositionalArgumentsAfterNamedArguments', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new Map([['timestamp', 123456], [0, 'Y-m-d']])])
            }, new TwingErrorSyntax('Positional arguments cannot be used after named arguments for function "date".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    test.test('testGetArgumentsWhenArgumentIsDefinedTwice', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new Map([[0, 'Y-m-d'], ['format', 'U']])])
            }, new TwingErrorSyntax('Argument "format" is defined twice for function "date".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    test.test('testGetArgumentsWithWrongNamedArgumentName', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new Map([[0, 'Y-m-d'], ['timestamp', null], ['unknown', '']])])
            }, new TwingErrorSyntax('Unknown argument "unknown" for function "date(format, timestamp)".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    test.test('testGetArgumentsWithWrongNamedArgumentNames', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new Map([[0, 'Y-m-d'], ['timestamp', null], ['unknown1', ''], ['unknown2', '']])])
            }, new TwingErrorSyntax('Unknown arguments "unknown1", "unknown2" for function "date(format, timestamp)".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    /**
     * This test is unreachable with JavaScript due to the nature of the language: in C, a parameter can be declared optional even without a default value; in JavaScript this is not possible.
     */
    test.test('testResolveArgumentsWithMissingValueForOptionalArgument', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'substr_compare']
        ]));

        // test.throws(
        //     function() {
        //         getArguments(node, [substr_compare, new Map([[0, 'abcd'], [1, 'bc'], ['offset', 1], ['case_sensitivity', true]])])
        //     }, new TwingErrorSyntax('Argument "case_sensitivity" could not be assigned for function "substr_compare(main_str, str, offset, length, case_sensitivity)" because it is mapped to an internal PHP function which cannot determine default value for optional argument "length".'), 'should throw a TwingErrorSyntax'
        // );
        test.pass();

        test.end();
    });

    test.test('testResolveArgumentsOnlyNecessaryArgumentsForCustomFunction', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'custom_function']
        ]));

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

        let callTest = new TwingTestsNodeExpressionCallTest();

        test.throws(
            function () {
                getArguments(node, [callTest.customFunctionWithArbitraryArguments, new Map()])
            }, new Error('The last parameter of "customFunctionWithArbitraryArguments" for function "foo" must be an array with default value, eg. "arg = []".'), 'should throw an Error'
        );

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArgumentsOnFunction', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        test.throws(
            function () {
                getArguments(node, [custom_Twig_Tests_Node_Expression_CallTest_function, new Map()])
            }, new Error('The last parameter of "custom_Twig_Tests_Node_Expression_CallTest_function" for function "foo" must be an array with default value, eg. "arg = []".'), 'should throw an Error'
        );

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArgumentsOnObject', function (test) {
        let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        test.throws(
            function () {
                getArguments(node, [new CallableTestClass(), new Map()])
            }, new Error('The last parameter of "CallableTestClass::__invoke" for function "foo" must be an array with default value, eg. "arg = []".'), 'should throw an Error'
        );

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

    test.test('getCallableParameters', function (test) {
        test.test('with unregistered runtime', function (test) {
            let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
                ['type', 'function'],
                ['name', 'date']
            ]));

            node.setAttribute('arguments', ['foo']);

            let getCallableParameters = Reflect.get(node, 'getCallableParameters').bind(node);
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            sinon.stub(env, 'getRuntime').returns({
                bar: 1
            });

            test.same(getCallableParameters(['foo', 'bar'], false, env), []);
            test.same(getCallableParameters('foo::bar', false, env), []);

            test.end();
        });

        test.test('with included arguments', function (test) {
            let node = new TwingTestsNodeExpressionCall(new Map(), new Map([
                ['type', 'function'],
                ['name', 'date']
            ]));

            node.setAttribute('arguments', ['foo']);

            let getCallableParameters = Reflect.get(node, 'getCallableParameters').bind(node);
            let env = new TwingEnvironment(new TwingLoaderArray({}));

            test.same(getCallableParameters((foo, bar) => {
            }, false, env), [
                {
                    defaultValue: null,
                    name: "bar",
                    optional: false
                }
            ]);

            test.end();
        });

        test.end();
    });

    test.end();
});
