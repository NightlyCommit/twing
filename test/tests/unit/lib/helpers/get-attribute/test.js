const {getAttribute} = require('../../../../../../build/lib/helpers/get-attribute');
const {TwingEnvironment, TwingLoaderNull, TwingTemplate} = require('../../../../../../build/main');

const tap = require('tape');

tap.test('get-attribute', (test) => {
    test.test('sandboxed with non-allowed property', (test) => {
        let env = new TwingEnvironment(new TwingLoaderNull(), {
            sandboxed: true
        });

        class Obj {
            constructor() {
                this.foo = 'foo';
            }
        }

        try {
            getAttribute(env, new Obj(), 'foo', [], TwingTemplate.ANY_CALL, false, false, true);

            test.fail('should throw a security policy error.');
        } catch (e) {
            test.same(e.message, 'Calling "foo" property on a "Obj" is not allowed.');
        }

        test.end();
    });

    test.test('sandboxed with non-allowed method', (test) => {
        let env = new TwingEnvironment(new TwingLoaderNull(), {
            sandboxed: true
        });

        class Obj {
            foo() {

            }
        }

        try {
            getAttribute(env, new Obj(), 'foo', [], TwingTemplate.METHOD_CALL, false, false, true);

            test.fail('should throw a security policy error.');
        } catch (e) {
            test.same(e.message, 'Calling "foo" method on a "Obj" is not allowed.');
        }

        test.end();
    });

    test.end();
});