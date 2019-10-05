import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserDo} from "../../../../../../src/lib/token-parser/do";
import {getParser} from "../../../../../mock-builder/parser";
import {TwingNodeType} from "../../../../../../src/lib/node";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/do', (test) => {
    test.test('parse', (test) => {
        let stream = new TwingTokenStream([
            new Token(TokenType.TAG_END, null, 1, 1),
            new Token(TokenType.EOF, null, 1, 1)
        ]);

        let tokenParser = new TwingTokenParserDo();
        let parser = getParser(stream);

        sinon.stub(parser, 'parseExpression').returns(new Token(TokenType.NAME, 'foo', 1, 1));

        tokenParser.setParser(parser);

        test.same(tokenParser.parse(new Token(TokenType.TAG_START, null, 1, 1)).getType(), TwingNodeType.DO);

        test.end();
    });

    test.end();
});