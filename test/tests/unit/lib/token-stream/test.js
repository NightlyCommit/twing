const {
    TwingLoaderArray: TwingLoader,
    TwingEnvironment,
    TwingSource,
    TwingErrorSyntax,
    TwingToken,
    TwingTokenStream
} = require('../../../../../build/main');

const tap = require('tape');

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

    test.test('next', function (test) {
        let loader = new TwingLoader({
            index: ''
        });
        let twing = new TwingEnvironment(loader);
        let stream = twing.tokenize(new TwingSource('', 'index'));

        test.throws(function() {
            stream.next();
        }, new TwingErrorSyntax('Unexpected end of template.', 1, new TwingSource('', 'index')));

        test.end();
    });

    test.test('look', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.PUNCTUATION_TYPE, '{', 1),
            new TwingToken(TwingToken.NAME_TYPE, 'foo', 1),
            new TwingToken(TwingToken.EOF_TYPE, null, 1)
        ]);

        test.same(stream.look().getType(), TwingToken.NAME_TYPE);

        test.throws(function() {
            stream.look(3);
        }, new TwingErrorSyntax('Unexpected end of template.', 1, new TwingSource('', '')));

        test.end();
    });

    test.end();
});