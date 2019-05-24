const {TwingSandboxSecurityPolicy} = require('../../../../../build/sandbox/security-policy');

const tap = require('tape');

class Foo {

}

tap.test('sandbox/security-policy', function (test) {
    test.test('setAllowedMethods', function (test) {
        test.test('when passed a "Map<string, Array<string>>"', function(test) {
            let policy = new TwingSandboxSecurityPolicy();

            policy.setAllowedMethods(new Map([[Foo, ['bar', 'OOF']]]));

            test.same(Reflect.get(policy, 'allowedMethods'), new Map([[Foo, ['bar', 'oof']]]));

            test.end();
        });

        test.end();
    });

    test.test('checkMethodAllowed', function (test) {
        test.test('when method is allowed', function(test) {
            let policy = new TwingSandboxSecurityPolicy();

            policy.setAllowedMethods(new Map([[Foo, 'bar']]));

            test.doesNotThrow(function() {
                policy.checkMethodAllowed(new Foo(), 'bar');
            });

            test.end();
        });

        test.test('when method is not allowed', function(test) {
            let policy = new TwingSandboxSecurityPolicy();

            policy.setAllowedMethods(new Map([[Foo, 'bar']]));

            test.throws(function() {
                policy.checkMethodAllowed({}, 'bar');
            }, new Error('Calling "bar" method on a "Object" object is not allowed.'));

            test.end();
        });

        test.end();
    });

    test.test('checkPropertyAllowed', function (test) {
        test.test('when allowed properties is an array', function(test) {
            test.test('and property is allowed', function(test) {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map([[Foo, ['bar']]]));

                test.doesNotThrow(function() {
                    policy.checkPropertyAllowed(new Foo(), 'bar');
                });

                test.end();
            });

            test.test('and property is not allowed', function(test) {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map([[Foo, ['bar']]]));

                test.throws(function() {
                    policy.checkPropertyAllowed({}, 'bar');
                }, new Error('Calling "bar" property on a "Object" object is not allowed.'));

                test.end();
            });

            test.end();
        });

        test.test('when allowed properties is a string', function(test) {
            test.test('and property is allowed', function(test) {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map([[Foo, 'bar']]));

                test.doesNotThrow(function() {
                    policy.checkPropertyAllowed(new Foo(), 'bar');
                });

                test.end();
            });

            test.test('and property is not allowed', function (test) {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map([[Foo, 'bar']]));

                test.throws(function () {
                    policy.checkPropertyAllowed({}, 'bar');
                }, new Error('Calling "bar" property on a "Object" object is not allowed.'));

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});