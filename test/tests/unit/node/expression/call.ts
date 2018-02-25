import {Test} from "tape";
import {TwingNodeExpressionCall} from "../../../../../src/node/expression/call";
import {TwingNode} from "../../../../../src/node";
import {TwingMap} from "../../../../../src/map";
import {TwingErrorSyntax} from "../../../../../src/error/syntax";

const tap = require('tap');

class TwingTestsNodeExpressionCall extends TwingNodeExpressionCall {
    getArguments(callable: Function = null, argumentsNode: TwingNode) {
        return super.getArguments(callable, argumentsNode);
    }
}

function getArguments(node: TwingTestsNodeExpressionCall, args: Array<any>) {
    let argumentsNode = new TwingNode(args[1]);

    return node.getArguments.apply(node, [args[0], argumentsNode]);
}

function date(format: string, timestamp: number) {

}

function substr_compare(main_str: string, str: number, offset: number, length: number, case_sensitivity: boolean) {

}

function customFunction(arg1: any, arg2: string = 'default', arg3: Array<any> = []) {
}

class TwingTestsNodeExpressionCallTest {
    public customFunctionWithArbitraryArguments() {
    }
}

function custom_Twig_Tests_Node_Expression_CallTest_function(required: any) {
}

class CallableTestClass {
    public __invoke(required: any) {
    }
}

tap.test('node/expression/call', function (test: Test) {
    test.test('getArguments', function (test: Test) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.same(
            getArguments(node, [date, new TwingMap([['format', 'Y-m-d'], ['timestamp', null]])]),
            ['Y-m-d', null]
        );

        test.end();
    });

    test.test('getArgumentsWhenPositionalArgumentsAfterNamedArguments', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new TwingMap([['timestamp', 123456], [0, 'Y-m-d']])])
            }, new TwingErrorSyntax('Positional arguments cannot be used after named arguments for function "date".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    test.test('testGetArgumentsWhenArgumentIsDefinedTwice', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new TwingMap([[0, 'Y-m-d'], ['format', 'U']])])
            }, new TwingErrorSyntax('Argument "format" is defined twice for function "date".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    test.test('testGetArgumentsWithWrongNamedArgumentName', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new TwingMap([[0, 'Y-m-d'], ['timestamp', null], ['unknown', '']])])
            }, new TwingErrorSyntax('Unknown argument "unknown" for function "date(format, timestamp)".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    test.test('testGetArgumentsWithWrongNamedArgumentNames', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'date']
        ]));

        test.throws(
            function () {
                getArguments(node, [date, new TwingMap([[0, 'Y-m-d'], ['timestamp', null], ['unknown1', ''], ['unknown2', '']])])
            }, new TwingErrorSyntax('Unknown arguments "unknown1", "unknown2" for function "date(format, timestamp)".'), 'should throw a TwingErrorSyntax'
        );

        test.end();
    });

    /**
     * This test is unreachable with JavaScript due to the nature of the language: in C, a parameter can be declared optional even without a default value; in JavaScript this is not possible.
     */
    test.test('testResolveArgumentsWithMissingValueForOptionalArgument', function (test: Test) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'substr_compare']
        ]));

        // test.throws(
        //     function() {
        //         getArguments(node, [substr_compare, new TwingMap([[0, 'abcd'], [1, 'bc'], ['offset', 1], ['case_sensitivity', true]])])
        //     }, new TwingErrorSyntax('Argument "case_sensitivity" could not be assigned for function "substr_compare(main_str, str, offset, length, case_sensitivity)" because it is mapped to an internal PHP function which cannot determine default value for optional argument "length".'), 'should throw a TwingErrorSyntax'
        // );
        test.pass();

        test.end();
    });

    test.test('testResolveArgumentsOnlyNecessaryArgumentsForCustomFunction', function (test: Test) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'custom_function']
        ]));

        test.same(
            getArguments(node, [customFunction, new TwingMap([['arg1', 'arg1']])]),
            ['arg1']
        );

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArguments', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        let callTest = new TwingTestsNodeExpressionCallTest();

        test.throws(
            function () {
                getArguments(node, [callTest.customFunctionWithArbitraryArguments, new TwingMap()])
            }, new Error('The last parameter of "customFunctionWithArbitraryArguments" for function "foo" must be an array with default value, eg. "arg = []".'), 'should throw an Error'
        );

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArgumentsOnFunction', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        test.throws(
            function () {
                getArguments(node, [custom_Twig_Tests_Node_Expression_CallTest_function, new TwingMap()])
            }, new Error('The last parameter of "custom_Twig_Tests_Node_Expression_CallTest_function" for function "foo" must be an array with default value, eg. "arg = []".'), 'should throw an Error'
        );

        test.end();
    });

    test.test('testResolveArgumentsWithMissingParameterForArbitraryArgumentsOnObject', function (test: any) {
        let node = new TwingTestsNodeExpressionCall(new TwingMap(), new TwingMap([
            ['type', 'function'],
            ['name', 'foo'],
            ['is_variadic', true]
        ]));

        test.throws(
            function () {
                getArguments(node, [new CallableTestClass(), new TwingMap()])
            }, new Error('The last parameter of "CallableTestClass::__invoke" for function "foo" must be an array with default value, eg. "arg = []".'), 'should throw an Error'
        );

        test.end();
    });

    test.end();
});
