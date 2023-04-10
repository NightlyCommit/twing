import * as tape from 'tape';
import {TwingTemplate} from "../../../../../../src/lib/template";
import {MockEnvironment} from "../../../../../mock/environment";
import {MockLoader} from "../../../../../mock/loader";
import {TwingSource} from "../../../../../../src/lib/source";
import {getAttribute} from "../../../../../../src/lib/helpers/get-attribute";
import {TwingEnvironment} from "../../../../../../src/lib/environment";
import {TwingLoaderNull} from "../../../../../../src/lib/loader/null";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingOutputBuffer} from "../../../../../../src/lib/output-buffer";

class Foo {
    oof: string;

    constructor() {
        this.oof = 'oof';
    }

    foo() {
        return 'foo';
    }

    getFoo() {
        return 'getFoo';
    }

    getBar() {
        return 'getBar';
    }

    isBar() {
        return 'isBar';
    }

    hasBar() {
        return 'hasBar';
    }

    isOof() {
        return 'isOof';
    }

    hasFooBar() {
        return 'hasFooBar';
    }

    __call() {

    }
}

class TwingTestExtensionCoreTemplate extends TwingTemplate {
    constructor(env: TwingEnvironment) {
        super(env);
    }

    doDisplay(context: {}, outputBuffer: TwingOutputBuffer, blocks: Map<string, Array<any>>): Promise<void> {
        return Promise.resolve();
    }

    getTemplateName(): string {
        return "";
    }
}

tape('get-attribute', (test) => {
    let env = new MockEnvironment(new MockLoader(), {
        strict_variables: true
    });

    let source = new TwingSource('', '');

    test.test('should support method calls', async (test) => {
        let foo = new Foo();

        // object property
        test.same(await getAttribute(env, new Foo(), 'oof', new Map(), TwingTemplate.ANY_CALL, true), true);
        test.same(await getAttribute(env, new Foo(), 'oof', new Map(), TwingTemplate.ANY_CALL, false, false), 'oof');

        test.same(await getAttribute(env, foo, 'foo'), 'foo', 'should resolve methods by their name');
        test.same(await getAttribute(env, foo, 'bar'), 'getBar', 'should resolve get{name} if {name} doesn\'t exist');
        test.same(await getAttribute(env, foo, 'Oof'), 'isOof', 'should resolve is{name} if {name} and get{name} don\'t exist');
        test.same(await getAttribute(env, foo, 'fooBar'), 'hasFooBar', 'should resolve has{name} if {name}, get{name} and is{name} don\'t exist');

        test.same(await getAttribute(env, foo, 'getfoo'), 'getFoo', 'should resolve method in a case-insensitive way');
        test.same(await getAttribute(env, foo, 'GeTfOo'), 'getFoo', 'should resolve method in a case-insensitive way');

        // !METHOD_CALL + boolean item
        test.same(await getAttribute(env, new Map([[0, 2], [1, 3]]), false), 2);
        test.same(await getAttribute(env, new Map([[0, 2], [1, 3]]), true), 3);

        // !METHOD_CALL + float item
        test.same(await getAttribute(env, new Map([[0, 2], [1, 3]]), 0.1), 2);
        test.same(await getAttribute(env, new Map([[0, 2], [1, 3]]), 1.1), 3);

        try {
            await getAttribute(env, new Map(), 0);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Index "0" is out of bounds as the array is empty.');
        }

        try {
            await getAttribute(env, new Map([[0, 1]]), 1);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Index "1" is out of bounds for array [1].');
        }

        try {
            await getAttribute(env, new Map(), 'foo');

            test.fail();
        } catch (e) {
            test.same(e.message, 'Index "foo" is out of bounds as the array is empty.');
        }

        try {
            await getAttribute(env, null, 'foo', new Map(), TwingTemplate.ARRAY_CALL);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Impossible to access a key ("foo") on a null variable.');
        }

        try {
            await getAttribute(env, 5, 'foo', new Map(), TwingTemplate.ARRAY_CALL);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Impossible to access a key ("foo") on a number variable ("5").');
        }

        try {
            await getAttribute(env, null, 'foo', new Map(), TwingTemplate.ANY_CALL);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Impossible to access an attribute ("foo") on a null variable.');
        }

        // METHOD_CALL
        test.equals(await getAttribute(env, 5, 'foo', new Map(), TwingTemplate.METHOD_CALL, true), false);
        test.equals(await getAttribute(env, 5, 'foo', new Map(), TwingTemplate.METHOD_CALL, false, true), undefined);

        try {
            await getAttribute(env, null, 'foo', new Map(), TwingTemplate.METHOD_CALL);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Impossible to invoke a method ("foo") on a null variable.');
        }

        try {
            await getAttribute(env, 5, 'foo', new Map(), TwingTemplate.METHOD_CALL);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Impossible to invoke a method ("foo") on a number variable ("5").');
        }

        try {
            await getAttribute(env, new Map(), 'foo', new Map(), TwingTemplate.METHOD_CALL);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Impossible to invoke a method ("foo") on an array.');
        }

        try {
            await getAttribute(env, new Foo(), 'ooof', new Map(), TwingTemplate.ANY_CALL, false, false, false);

            test.fail();
        } catch (e) {
            test.same(e.message, 'Neither the property "ooof" nor one of the methods ooof()" or "getooof()"/"isooof()"/"hasooof()" exist and have public access in class "Foo".');
        }

        // no strict_variables
        env = new MockEnvironment(new MockLoader(), {
            strict_variables: false
        });

        test.same(await getAttribute(env, new Foo(), 'oof', new Map(), TwingTemplate.ANY_CALL, false, false), 'oof');

        test.end();
    });

    test.test('sandboxed with non-allowed property', async (test) => {
        let env = new TwingEnvironmentNode(new TwingLoaderNull(), {
            sandboxed: true
        });

        class Obj {
            foo: string;

            constructor() {
                this.foo = 'foo';
            }
        }

        try {
            await getAttribute(env, new Obj(), 'foo', new Map(), TwingTemplate.ANY_CALL, false, false, true);

            test.fail('should throw a security policy error.');
        } catch (e) {
            test.same(e.message, 'Calling "foo" property on a "Obj" is not allowed.');
        }

        test.end();
    });

    test.test('sandboxed with non-allowed method', async (test) => {
        let env = new TwingEnvironmentNode(new TwingLoaderNull(), {
            sandboxed: true
        });

        class Obj {
            foo() {

            }
        }

        try {
            await getAttribute(env, new Obj(), 'foo', new Map(), TwingTemplate.METHOD_CALL, false, false, true);

            test.fail('should throw a security policy error.');
        } catch (e) {
            test.same(e.message, 'Calling "foo" method on a "Obj" is not allowed.');
        }

        test.end();
    });

    test.end();
});
