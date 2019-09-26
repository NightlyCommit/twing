const {
    TwingLoaderArray: TwingLoader,
    TwingEnvironment,
    TwingSource,
} = require('../../../../../dist/cjs/main');

const tap = require('tape');

tap.test('token-stream', function (test) {
    test.test('should provide textual representation', function (test) {
        let loader = new TwingLoader({
            index: ''
        });
        let twing = new TwingEnvironment(loader);
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