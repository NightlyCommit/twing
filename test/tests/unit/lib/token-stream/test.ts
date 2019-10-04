import * as tape from 'tape';
import {TwingEnvironmentNode} from "../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../src/lib/loader/array";
import {TwingSource} from "../../../../../src/lib/source";

tape('token-stream', (test) => {
    test.test('should provide textual representation', (test) => {
        let loader = new TwingLoaderArray({
            index: ''
        });
        let twing = new TwingEnvironmentNode(loader);
        let stream = twing.tokenize(new TwingSource('Hello {{ name }}', 'index'));

        test.same(stream.toString(), `TEXT(Hello )
VARIABLE_START({{)
NAME(name)
VARIABLE_END(}})
EOF()`);

        test.end();
    });

    test.end();
});