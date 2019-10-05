import * as tape from 'tape';
import {TwingTokenStream} from "../../../../../../src/lib/token-stream";
import {TwingTokenParserAutoEscape} from "../../../../../../src/lib/token-parser/auto-escape";
import {TwingParser} from "../../../../../../src/lib/parser";
import {TwingEnvironmentNode} from "../../../../../../src/lib/environment/node";
import {TwingLoaderArray} from "../../../../../../src/lib/loader/array";
import {TwingNodeText} from "../../../../../../src/lib/node/text";

const sinon = require('sinon');
const {Token, TokenType} = require('twig-lexer');

tape('token-parser/auto-escape', (test) => {
    test.test('parse', (test) => {
        test.test('when escaping strategy is not a string of false', function(test) {
            let stream = new TwingTokenStream([
                new Token(TokenType.NAME, 'foo', 1, 1)
            ]);

            let tokenParser = new TwingTokenParserAutoEscape();
            let parser = new TwingParser(new TwingEnvironmentNode(new TwingLoaderArray({})));

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