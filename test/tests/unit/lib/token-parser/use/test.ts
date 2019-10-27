import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserUse} from "../../../../../../src/lib/token-parser/use";
import {getParser} from "../../../../../mock-builder/parser";
import {TwingNode} from "../../../../../../src/lib/node";
import {TwingNodeExpressionConstant} from "../../../../../../src/lib/node/expression/constant";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/use', (test) => {
    test.test('parse', (test) => {
        test.test('when template name is not a "EXPRESSION_CONSTANT"', (test) => {
            let stream = new TwingTokenStream([]);
            let tokenParser = new TwingTokenParserUse();
            let parser = getParser(stream);

            tokenParser.setParser(parser);

            sinon.stub(parser, 'parseExpression').returns(new TwingNode());
            sinon.stub(stream, 'getCurrent').returns({
                line: 1
            });

            try {
                tokenParser.parse(new Token(TokenType.NAME, 'set', 1, 1));

                test.fail();
            }
            catch (e) {
                test.same(e.message, 'The template references in a "use" statement must be a string in "" at line 1.')
            }

            test.end();
        });

        test.test('when multiple aliases', (test) => {
            let stream = new TwingTokenStream([
                new Token(TokenType.NAME, 'with', 1, 1),
                new Token(TokenType.NAME, 'bar', 1, 1),
                new Token(TokenType.NAME, 'as', 1, 1),
                new Token(TokenType.NAME, 'rab', 1, 1),
                new Token(TokenType.PUNCTUATION, ',', 1, 1),
                new Token(TokenType.NAME, 'foo', 1, 1),
                new Token(TokenType.NAME, 'as', 1, 1),
                new Token(TokenType.NAME, 'oof', 1, 1),
                new Token(TokenType.TAG_END, null, 1, 1),
                new Token(TokenType.EOF, null, 1, 1)
            ]);

            let tokenParser = new TwingTokenParserUse();
            let parser = getParser(stream);

            tokenParser.setParser(parser);

            let trait: TwingNode;

            sinon.stub(parser, 'parseExpression').returns(new TwingNodeExpressionConstant('foo', 1, 1));
            sinon.stub(parser, 'addTrait').callsFake((node: TwingNode) => {
                trait = node;
            });

            tokenParser.parse(new Token(TokenType.NAME, 'set', 1, 1));

            test.equals(trait.getNode('targets').getNodes().size, 2);

            test.end();
        });

        test.end();
    });

    test.end();
});
