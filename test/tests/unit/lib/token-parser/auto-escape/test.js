const {
    TwingTokenParserAutoEscape,
    TwingTokenStream,
    TwingParser,
    TwingEnvironment,
    TwingLoaderArray,
    TwingNodeText
} = require('../../../../../../build/main');
const tap = require('tape');
const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tap.test('token-parser/auto-escape', function (test) {
    test.test('parse', function (test) {
        test.test('when escaping strategy is not a string of false', function(test) {
            let stream = new TwingTokenStream([
                new Token(TokenType.NAME, 'foo', 1, 1)
            ]);

            let tokenParser = new TwingTokenParserAutoEscape();
            let parser = new TwingParser(new TwingEnvironment(new TwingLoaderArray({})));

            sinon.stub(parser, 'parseExpression').returns(new TwingNodeText('foo', 1, 1, null));

            Reflect.set(parser, 'stream', stream);

            tokenParser.setParser(parser);

            try {
                tokenParser.parse(new Token(TokenType.TAG_START, '', 1, 1));

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