import * as tape from 'tape';
import * as sinon from 'sinon';
import {source} from "../../../../../../../../src/lib/extension/core/functions/source";
import {TwingEnvironmentNode} from "../../../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../../../src/lib/loader/array";
import {TwingSource} from "../../../../../../../../src/lib/source";

tape('source', (test) => {
    let loader = new TwingLoaderArray({});
    let env = new TwingEnvironmentNode(loader);

    try {
        source(env, new TwingSource('', 'index'), 'foo', false);
    }
    catch (e) {
        test.same(e.name, 'TwingErrorLoader');
        test.same(e.message, 'Template "foo" is not defined in "index".');
    }

    test.equals(source(env, new TwingSource('', 'index'), 'foo', true), null);

    sinon.stub(loader, 'getSourceContext').throws(new Error('foo'));

    try {
        source(env, new TwingSource('', 'index'), 'foo', false);
    }
    catch (e) {
        test.same(e.name, 'Error');
        test.same(e.message, 'foo');
    }

    test.end();
});