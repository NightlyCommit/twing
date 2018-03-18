const tap = require('tap');
const TwingLoader = require('../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingEnvironment = require('../../../../lib/twing/environment').TwingEnvironment;
const TwingSource = require('../../../../lib/twing/source').TwingSource;

tap.test('token-stream', function (test) {
    test.test('should provide textual representation', function (test) {
        let loader = new TwingLoader({
            index: ''
        });
        let twing = new TwingEnvironment(loader);
        let stream = twing.tokenize(new TwingSource('Hello {{ name }}', 'index'));

        test.same(stream.toString(), `TEXT_TYPE(Hello )
VAR_START_TYPE()
NAME_TYPE(name)
VAR_END_TYPE()
EOF_TYPE()`);

        test.end();
    });

    test.end();
});