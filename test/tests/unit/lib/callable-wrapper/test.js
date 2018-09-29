const {TwingCallableWrapper} = require("../../../../../dist/lib/callable-wrapper");
const {
    TwingError,
    TwingSource
} = require("../../../../../dist");

const test = require('tape');

test('traceableCallable', (test) => {
    test.test('should update TwingError errors', (test) => {
        class Foo extends TwingCallableWrapper {
            constructor() {
                super('foo', () => {
                    throw new TwingError('foo error');
                })
            }
        }

        let foo = new Foo();

        try {
            foo.traceableCallable(1, new TwingSource('', 'foo'))();

            test.fail();
        }
        catch (e) {
            test.ok(e);
            test.same(e.message, 'foo error in "foo" at line 1');
            test.same(e.constructor.name, 'TwingError');
        }

        test.end();
    });

    test.test('should let other errors untouched', (test) => {
        class Foo extends TwingCallableWrapper {
            constructor() {
                super('foo', () => {
                    throw new Error('foo error');
                })
            }
        }

        let foo = new Foo();

        try {
            foo.traceableCallable(1, null)();

            test.fail();
        }
        catch (e) {
            test.ok(e);
            test.same(e.message, 'foo error');
            test.same(e.constructor.name, 'Error');
        }

        test.end();
    });

    test.end();
});