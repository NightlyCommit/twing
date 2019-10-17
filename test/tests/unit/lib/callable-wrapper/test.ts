import * as tape from 'tape';
import {Test} from "tape";
import {TwingCallableWrapper} from "../../../../../src/lib/callable-wrapper";
import {TwingError} from "../../../../../src/lib/error";
import {TwingSource} from "../../../../../src/lib/source";

tape('traceableCallable', (test) => {
    test.test('should update TwingError errors', async (test) => {
        class Foo extends TwingCallableWrapper<any> {
            constructor() {
                super('foo', () => {
                    return Promise.reject(new TwingError('foo error'));
                }, [])
            }
        }

        let foo = new Foo();

        try {
            await foo.traceableCallable(1, new TwingSource('', 'foo'))();

            test.fail();
        }
        catch (e) {
            test.ok(e);
            test.same(e.message, 'foo error in "foo" at line 1');
            test.same(e.constructor.name, 'TwingError');
        }

        test.end();
    });

    test.test('should let other errors untouched', async (test) => {
        class Foo extends TwingCallableWrapper<any> {
            constructor() {
                super('foo', () => {
                    throw new Error('foo error');
                }, [])
            }
        }

        let foo = new Foo();

        try {
            await foo.traceableCallable(1, null)();

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
