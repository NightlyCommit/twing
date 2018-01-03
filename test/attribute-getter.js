const TwingEnvironment = require('../dist/environment');
const TwingLoaderArray = require('../dist/loader/array');
const TwingSource = require('../dist/source').default;
const TwingAttributeGetter = require('../dist/attribute-getter');
const TwingTemplate = require('../dist/template');

const tap = require('tap');

let loader = new TwingLoaderArray();
let env = new TwingEnvironment(loader, {
    strict_variables: true
});
let source = new TwingSource('foo bar', null);
let attributeGetter = new TwingAttributeGetter();

let object = {
    foo: 'foo',
    getBar: function () {
        return 'bar';
    },
    bar: function (param1 = null, param2 = null) {
        return 'bar' + (param1 ? '_' + param1 : '') + (param2 ? '-' + param2 : '');
    },
    getFooGet: function () {
        return 'getFooGet';
    },
    isFooGet: function () {
        return 'isFooGet';
    },
    hasFooGet: function () {
        return 'hasFooGet';
    },
    isFooIs: function () {
        return 'isFooIs';
    },
    hasFooIs: function () {
        return 'hasFooIs';
    },
    hasFooHas: function () {
        return 'hasFooHas';
    }
};

let anyCall = function (object, item, strictVariables = true, definedTest = false) {
    return attributeGetter.getAttribute(env, source, object, item, [], TwingTemplate.ANY_CALL, definedTest, !strictVariables);
};

let arrayCall = function (object, item, strictVariables = true, definedTest = false) {
    return attributeGetter.getAttribute(env, source, object, item, [], TwingTemplate.ARRAY_CALL, definedTest, !strictVariables);
};

let methodCall = function (object, item, methodArguments = [], strictVariables = true, definedTest = false) {
    return attributeGetter.getAttribute(env, source, object, item, methodArguments, TwingTemplate.METHOD_CALL, definedTest, !strictVariables);
};

tap.test('attribute-getter', function (test) {
    test.test('getAttribute should support default arguments', function (test) {
        let actual = attributeGetter.getAttribute(env, source, ['foo'], 0);

        test.equal(actual, 'foo');

        test.end();
    });

    test.test('should support', function (test) {
        test.test('null', function (test) {
            try {
                anyCall(null, 'undefined');

                test.fail('should throw an exception when trying to access an attribute on a null variable');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Impossible to access an attribute ("undefined") on a null variable.');
            }

            test.end();
        });

        test.test('arrays', function (test) {
            test.equal(anyCall(['foo', 'bar'], 0), 'foo');
            test.equal(anyCall(['foo', 'bar'], 1), 'bar');
            test.equal(anyCall(['foo', 'bar'], 1.25), 'bar');
            test.equal(anyCall(['foo', 'bar'], false), 'foo');
            test.equal(anyCall(['foo', 'bar'], true), 'bar');

            // index inside of bounds and isDefinedTest is true
            test.equal(anyCall(['foo', 'bar'], 0, true, true), true);
            // index out of bounds and isDefinedTest is true
            test.equal(anyCall(['foo', 'bar'], 2, true, true), false);
            // index out of bounds and "strict variables" is disabled
            test.equal(anyCall(['foo', 'bar'], 2, false), undefined);

            try {
                anyCall(['foo', 'bar'], 'foo');

                test.fail('should throw an exception when index is not parsable as an integer');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Index "foo" is out of bounds for array [foo,bar].');
            }

            try {
                anyCall([], 0);

                test.fail('should throw an exception when empty array');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Index "0" is out of bounds as the array is empty.');
            }

            try {
                anyCall(['foo', 'bar'], 2);

                test.fail('should throw an exception when index is out of bounds on non-empty array');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Index "2" is out of bounds for array [foo,bar].');
            }

            test.end();
        });

        // test.test('maps', function (test) {
        //     let map = new Map([
        //         ['foo', 'foo'],
        //         ['bar', 'bar']
        //     ]);
        //
        //     test.equal(anyCall(map, 'foo'), 'foo');
        //     test.equal(anyCall(map, 'bar'), 'bar');
        //
        //     // key set and isDefinedTest is true
        //     test.equal(anyCall(map, 'foo', true, true), true);
        //     // key not set and isDefinedTest is true
        //     test.equal(anyCall(map, 'undefined', true, true), false);
        //     // key not set and "strict variables" is disabled
        //     test.equal(anyCall(map, 'undefined', false), undefined);
        //
        //     try {
        //         anyCall(map, 'undefined');
        //
        //         test.fail('should throw an exception when key is not set');
        //     }
        //     catch (e) {
        //         test.equal(e.getRawMessage(), 'Impossible to access a key ("undefined") on a object variable ("[object Map]").');
        //     }
        //
        //     test.test('method call', function(test) {
        //         test.equal(methodCall(map, 'has', ['foo']), true);
        //         test.equal(methodCall(map, 'has', ['undefined']), false);
        //         test.equal(methodCall(map, 'get', ['foo']), 'foo');
        //
        //         test.end();
        //     });
        //
        //     test.end();
        // });

        test.test('objects', function (test) {
            test.equal(anyCall(object, 'foo'), 'foo');

            // key set and isDefinedTest is true
            test.equal(anyCall(object, 'foo', true, true), true);
            // key not set and isDefinedTest is true
            test.equal(anyCall(object, 'undefined', true, true), false);
            // key not set and "strict variables" is disabled
            test.equal(anyCall(object, 'undefined', false), undefined);

            try {
                anyCall(object, 'undefined');

                test.fail('should throw an exception when the property does not exist');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Neither the property "undefined" nor one of the methods undefined()", "getUndefined()", "isUndefined()" or "hasUndefined()" exist in class "Object".');
            }

            test.equal(anyCall(object, 'fooGet'), 'getFooGet');
            test.equal(anyCall(object, 'fooIs'), 'isFooIs');
            test.equal(anyCall(object, 'fooHas'), 'hasFooHas');

            // method call
            test.equal(methodCall(object, 'bar', ['param1']), 'bar_param1');
            test.equal(methodCall(object, 'bar', ['param1', 'param2']), 'bar_param1-param2');
            // method exists and isDefinedTest is true
            test.equal(methodCall(object, 'bar', [], true, true), true);
            // method doesn't exist and isDefinedTest is true
            test.equal(methodCall(object, 'undefined', [], true, true), false);
            // method doesn't exist and "strict variables" is disabled
            test.equal(methodCall(object, 'undefined', [], false), undefined);

            // array call
            try {
                arrayCall(null, 'undefined');

                test.fail('should throw an exception when trying to access a key on a null variable');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Impossible to access a key ("undefined") on a null variable.');
            }

            try {
                arrayCall(object, 'undefined');

                test.fail('should throw an exception when the property does not exist');
            }
            catch (e) {
                test.equal(e.getRawMessage(), 'Impossible to access a key ("undefined") on a object variable ("[object Object]").');
            }

            test.end();
        });

        test.test('primitives', function (test) {
            test.test('any call', function (test) {
                // isDefinedTest is true
                test.equal(anyCall(true, 'undefined', true, true), false);
                // "strict variables" is disabled
                test.equal(anyCall(true, 'undefined', false), undefined);

                try {
                    anyCall(true, 'undefined');

                    test.fail('should throw an exception when trying to access an attribute on a primitive');
                }
                catch (e) {
                    test.equal(e.getRawMessage(), 'Impossible to access an attribute ("undefined") on a boolean variable ("true").');
                }

                test.end();
            });

            test.test('method call', function (test) {
                // isDefinedTest is true
                test.equal(methodCall(true, 'undefined', [], true, true), false);
                // "strict variables" is disabled
                test.equal(methodCall(true, 'undefined', [], false), undefined);

                try {
                    methodCall(null, 'undefined');

                    test.fail('should throw an exception when trying to invoke a method on a null variable');
                }
                catch (e) {
                    test.equal(e.getRawMessage(), 'Impossible to invoke a method ("undefined") on a null variable.');
                }

                try {
                    methodCall(true, 'undefined');

                    test.fail('should throw an exception when trying to invoke a method on a primitive');
                }
                catch (e) {
                    test.equal(e.getRawMessage(), 'Impossible to invoke a method ("undefined") on a boolean variable ("true").');
                }

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});