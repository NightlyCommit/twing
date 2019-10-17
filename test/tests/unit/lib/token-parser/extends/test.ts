import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserExtends} from "../../../../../../src/lib/token-parser/extends";
import {getParser} from "../../../../../mock-builder/parser";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/extends', (test) => {
    test.test('parse', (test) => {
        test.test('with parent already set', function (test) {
            let stream = new TwingTokenStream([]);

            let tokenParser = new TwingTokenParserExtends();
            let parser = getParser(stream);

            tokenParser.setParser(parser);

            sinon.stub(parser, 'peekBlockStack').returns(false);
            sinon.stub(parser, 'isMainScope').returns(true);
            sinon.stub(parser, 'getParent').returns(true);

            try {
                tokenParser.parse(new Token(TokenType.NAME, 'foo', 1, 1));

                test.fail();
            } catch (e) {
                test.same(e.message, 'Multiple extends tags are forbidden in "" at line 1.');
            }

            test.end();
        });

        test.end();
    });

    test.end();
});
