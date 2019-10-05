import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserSet} from "../../../../../../src/lib/token-parser/set";
import {getParser} from "../../../../../mock-builder/parser";
import {TwingNode} from "../../../../../../src/lib/node";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/set', (test) => {
    test.test('parse', (test) => {
        test.test('when direct assignment', (test) => {
            test.test('when different number of variables and assignments', (test) => {
                let stream = new TwingTokenStream([
                    new Token(TokenType.OPERATOR, '=', 1, 1),
                    new Token(TokenType.TAG_END, null, 1, 1),
                    new Token(TokenType.EOF, null, 1, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = getParser(stream);

                tokenParser.setParser(parser);

                sinon.stub(parser, 'parseAssignmentExpression').returns(new TwingNode(new Map<number, any>([[0, 'foo']])));
                sinon.stub(parser, 'parseMultitargetExpression').returns(new TwingNode(new Map<number, any>([[0, 'oof'], [1, 'bar']])));

                try {
                    tokenParser.parse(new Token(TokenType.NAME, 'set', 1, 1))

                    test.fail();
                }
                catch (e) {
                    test.same(e.message, 'When using set, you must have the same number of variables and assignments at line 1.');
                }

                test.end();
            });

            test.end();
        });

        test.test('when capture', (test) => {
            test.test('when multiple targets', (test) => {
                let stream = new TwingTokenStream([
                    new Token(TokenType.TAG_END, null, 1, 1),
                    new Token(TokenType.EOF, null, 1, 1)
                ]);

                let tokenParser = new TwingTokenParserSet();
                let parser = getParser(stream);

                tokenParser.setParser(parser);

                sinon.stub(parser, 'parseAssignmentExpression').returns(new TwingNode(new Map<number, any>([[0, 'foo'], [1, 'bar']])));

                try {
                    tokenParser.parse(new Token(TokenType.NAME, 'set', 1, 1))

                    test.fail();
                }
                catch (e) {
                    test.same(e.message, 'When using set with a block, you cannot have a multi-target at line 1.');
                }

                test.end();
            });

            test.end();
        });

        test.end();
    });

    test.end();
});