const {
    TwingTokenParserAutoEscape,
    TwingTokenStream,
    TwingToken,
    TwingParser,
    TwingEnvironment,
    TwingLoaderArray
} = require('../../../../../../build/main');
const tap = require('tape');

class Parser extends TwingParser {
    constructor() {
        super(new TwingEnvironment(new TwingLoaderArray({})));
    }

    parseExpression(precedence, allowArrow) {
        return new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1);
    }
}

tap.test('token-parser/auto-escape', function (test) {
    test.test('parse', function (test) {
        test.test('when escaping strategy is not a string of false', function(test) {
            let stream = new TwingTokenStream([
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 1)
            ]);

            let tokenParser = new TwingTokenParserAutoEscape();
            let parser = new Parser();

            Reflect.set(parser, 'stream', stream);

            tokenParser.setParser(parser);

            try {
                tokenParser.parse(new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1, 1));

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'An escaping strategy must be a string or false at line 1.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});