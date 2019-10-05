import * as tape from 'tape';
import {TwingLoaderArray} from "../../../../../../../../src/lib/loader/array";
import {length} from "../../../../../../../../src/lib/extension/core/filters/length";
import {TwingEnvironmentNode} from "../../../../../../../../src/lib/environment/node";

tape('length', (test) => {
    let env = new TwingEnvironmentNode(new TwingLoaderArray({}));

    test.same(length(env, 5), 1);
    test.same(length(env, 55), 2);
    test.same(length(env, new Map([[1, 1]])), 1);

    test.end();
});
