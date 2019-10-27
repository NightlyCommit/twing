import * as tape from 'tape';
import {TwingEnvironmentNode} from "../../../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../../../src/lib/loader/array";
import {TwingSource} from "../../../../../../../../src/lib/source";
import {include} from "../../../../../../../../src/lib/extension/core/functions/include";
import {TwingLoaderRelativeFilesystem} from "../../../../../../../../src/lib/loader/relative-filesystem";
import {resolve} from "path";

tape('include', async (test) => {
    let env = new TwingEnvironmentNode(new TwingLoaderArray({}));

    try {
        await include(env, new Map(), new TwingSource('', 'index.twig'), 'foo', {}, true, false, true);

        test.fail();
    } catch (e) {
        test.same(e.name, 'TwingErrorLoader');
        test.same(e.message, 'Template "foo" is not defined in "index.twig".');
    }

    try {
        await include(env, new Map(), new TwingSource('', 'index.twig'), 'foo', 'bar', true, false, true);

        test.fail();
    } catch (e) {
        test.same(e.message, 'Variables passed to the "include" function or tag must be iterable, got "string" in "index.twig".');
    }

    env = new TwingEnvironmentNode(new TwingLoaderArray({foo: 'bar'}));
    env.enableSandbox();

    test.same(await include(env, new Map(), new TwingSource('', 'index.twig'), 'foo', {}, true, false, true), 'bar');

    test.test('supports being called with a source', async (test) => {
        env = new TwingEnvironmentNode(new TwingLoaderRelativeFilesystem());

        test.same(await include(env, new Map(), new TwingSource('code', resolve('test/tests/unit/lib/extension/core/index.twig')), 'templates/foo.twig', {}), 'foo');

        test.end();
    });

    test.end();
});
