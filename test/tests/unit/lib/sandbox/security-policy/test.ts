import * as tape from 'tape';
import {TwingSandboxSecurityPolicy} from "../../../../../../src/lib/sandbox/security-policy";

class Foo {

}

class Bar {

}

tape('sandbox/security-policy', (test) => {
    test.test('checkMethodAllowed', (test) => {
        test.test('when method is allowed', function(test) {
            let policy = new TwingSandboxSecurityPolicy();

            policy.setAllowedMethods(new Map<any, any>([
                [Foo, 'bar'],
                [Bar, ['foo', 'bar']]
            ]));

            try {
                policy.checkMethodAllowed(new Foo(), 'bar');
                policy.checkMethodAllowed(new Bar(), 'foo');
                policy.checkMethodAllowed(new Bar(), 'bar');

                test.pass();
            }
            catch (e) {
                test.fail();
            }

            test.end();
        });

        test.test('when method is not allowed', function(test) {
            let policy = new TwingSandboxSecurityPolicy();

            policy.setAllowedMethods(new Map([[Foo, 'bar']]));

            try {
                policy.checkMethodAllowed({}, 'bar');

                test.fail();
            }
            catch (e) {
                test.same(e.name, 'TwingSandboxSecurityNotAllowedMethodError');
                test.same(e.message, 'Calling "bar" method on a "Object" is not allowed.');
            }

            test.end();
        });

        test.end();
    });

    test.test('checkPropertyAllowed', (test) => {
        test.test('when allowed properties is an array', function(test) {
            test.test('and property is allowed', function(test) {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map<any, any>([[Foo, ['bar']]]));

                test.doesNotThrow(function() {
                    policy.checkPropertyAllowed(new Foo(), 'bar');
                });

                test.end();
            });

            test.test('and property is not allowed', function(test) {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map<any, any>([[Foo, ['bar']]]));

                try {
                    policy.checkPropertyAllowed({}, 'bar');

                    test.fail();
                }
                catch (e) {
                    test.same(e.message, 'Calling "bar" property on a "Object" is not allowed.');
                }

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

            test.test('and property is not allowed', (test) => {
                let policy = new TwingSandboxSecurityPolicy();

                policy.setAllowedProperties(new Map([[Foo, 'bar']]));

                try {
                    policy.checkPropertyAllowed({}, 'bar');

                    test.fail();
                }
                catch (e) {
                    test.same(e.message, 'Calling "bar" property on a "Object" is not allowed.');
                }

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.test('checkSecurity', (test) => {
        let policy = new TwingSandboxSecurityPolicy();

        test.test('tags', function(test) {
            policy.setAllowedTags(['foo']);

            try {
                policy.checkSecurity(['foo'], [], []);

                test.pass();
            }
            catch (e) {
                test.fail();
            }

            try {
                policy.checkSecurity(['bar'], [], []);

                test.fail('should throw an error on non-allowed tag');
            }
            catch (e) {
                test.same(e.name, 'TwingSandboxSecurityNotAllowedTagError');
                test.same(e.message, 'Tag "bar" is not allowed.');
            }

            test.end();
        });

        test.test('filters', function(test) {
            policy.setAllowedFilters(['foo']);

            try {
                policy.checkSecurity([], ['foo'], []);

                test.pass();
            }
            catch (e) {
                test.fail();
            }

            try {
                policy.checkSecurity([], ['bar'], []);

                test.fail('should throw an error on non-allowed filter');
            }
            catch (e) {
                test.same(e.name, 'TwingSandboxSecurityNotAllowedFilterError');
                test.same(e.message, 'Filter "bar" is not allowed.');
            }

            test.end();
        });

        test.test('functions', function(test) {
            policy.setAllowedFunctions(['foo']);

            try {
                policy.checkSecurity([], [], ['foo']);

                test.pass();
            }
            catch (e) {
                test.fail();
            }

            try {
                policy.checkSecurity([], [], ['bar']);

                test.fail('should throw an error on non-allowed function');
            }
            catch (e) {
                test.same(e.name, 'TwingSandboxSecurityNotAllowedFunctionError');
                test.same(e.message, 'Function "bar" is not allowed.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});