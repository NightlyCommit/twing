import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserMacro} from "../../../../../../src/lib/token-parser/macro";
import {getParser} from "../../../../../mock-builder/parser";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/macro', (test) => {
    test.test('parse', (test) => {
        test.test('when endmacro name doesn\'t match', function(test) {
            let stream = new TwingTokenStream([
                new Token(TokenType.NAME, 'foo', 1, 1),
                new Token(TokenType.PUNCTUATION, '(', 1, 1),
                new Token(TokenType.PUNCTUATION, ')', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1),
                new Token(TokenType.TEXT, 'FOO', 1, 1),
                new Token(TokenType.TAG_START, null, 1, 1),
                new Token(TokenType.NAME, 'endmacro', 1, 1),
                new Token(TokenType.NAME, 'bar', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserMacro();
            let parser = getParser(stream);

            sinon.stub(parser, 'parseExpression').returns(new Token(TokenType.NAME, 'foo', 1, 1));

            tokenParser.setParser(parser);

            try {
                tokenParser.parse(new Token(TokenType.NAME, 'block', 1, 1));

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'Expected endmacro for macro "foo" (but "bar" given) in "" at line 1.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
