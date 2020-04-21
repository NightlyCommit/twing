import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserVerbatim} from "../../../../../../src/lib/token-parser/verbatim";
import {getParser} from "../../../../../mock-builder/parser";
import {type} from "../../../../../../src/lib/node/verbatim";

const {Token, TokenType} = require('twig-lexer');

tape('token-parser/verbatim', (test) => {
    test.test('parse', (test) => {
        let stream = new TwingTokenStream([
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.TEXT, 'foo', 1, 1),
            new Token(TokenType.TAG_START, null, 1, 1),
            new Token(TokenType.NAME, 'endverbatim', 1, 1),
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.EOF, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserVerbatim();
        let parser = getParser(stream);

        tokenParser.setParser(parser);

        let node = tokenParser.parse(new Token(TokenType.TAG_START, null, 1, 1));

        test.same(node.type, type);
        test.same(node.getAttribute('data'), 'foo');

        test.end();
    });

    test.end();
});
