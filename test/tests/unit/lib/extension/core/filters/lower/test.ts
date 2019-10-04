import * as tape from 'tape';
import {TwingLoaderArray} from "../../../../../../../../src/lib/loader/array";
import {TwingEnvironmentNode} from "../../../../../../../../src/lib/environment/node";
import {lower} from "../../../../../../../../src/lib/extension/core/filters/lower";

tape('lower', (test) => {
    let env = new TwingEnvironmentNode(new TwingLoaderArray({}));

    test.same(lower(env, 'A'), 'a');
    test.same(lower(env, '5'), '5');

    test.end();
});
