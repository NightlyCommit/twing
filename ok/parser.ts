import * as test from 'tape';
import TwingParser from "../src/parser";
import TwingTokenStream from "../src/token-stream";
import Token, {default as TwingToken} from "../src/token";
import TokenType, {default as TwingTokenType} from "../src/token-type";
import TwingEnvironment from "../src/environment";
import TwingSyntaxError from "../src/error/syntax";
import TwingNode from "../src/node";
import TwingNodeText from "../src/node/text";
import TwingNodeSet from "../src/node/set";
import TwingTokenParser from "../src/token-parser";
import TwingMap from "../src/map";
import TwingSource from "../src/source";
import TwingLoaderFilesystem from "../src/loader/filesystem";

let testEnv = new TwingEnvironment(null);

let getParser = function () {
    let parser = new TwingParser(new TwingEnvironment(null));

    parser.setParent(new TwingNode());
    // todo: stream is a private property, we use that workaround for now because this is how the property was implemented in PHP
    parser['stream'] = new TwingTokenStream([]);

    return parser;
};

class TestTokenParser extends TwingTokenParser {
    parse(token: TwingToken): TwingNode {
        // simulate the parsing of another template right in the middle of the parsing of the current template
        this.parser.parse(new TwingTokenStream([
            new TwingToken(TwingTokenType.BLOCK_START_TYPE, '', 1),
            new TwingToken(TwingTokenType.NAME_TYPE, 'extends', 1),
            new TwingToken(TwingTokenType.STRING_TYPE, 'base', 1),
            new TwingToken(TwingTokenType.BLOCK_END_TYPE, '', 1),
            new TwingToken(TwingTokenType.EOF_TYPE, '', 1),
        ]));

        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNode();
    }

    getTag() {
        return 'test';
    }
}

/**
 *
 * @returns Array<{input: TwingNode; expected: TwingNode}>
 */
let getFilterBodyNodesData = function () {
    let input: TwingNode;

    return [
        {
            input: new TwingNode(new TwingMap([[0, new TwingNodeText('   ', 1)]])),
            expected: new TwingNode(),
        },
        {
            input: input = new TwingNode(new TwingMap([[0, new TwingNodeSet(false, new TwingNode(), new TwingNode(), 1)]])),
            expected: input
        },
        {
            input: input = new TwingNode(new TwingMap([
                    ['0', new TwingNodeSet(
                        true,
                        new TwingNode(),
                        new TwingNode(new TwingMap([[
                            0, new TwingNode(new TwingMap([[
                                0, new TwingNodeText('foo', 1)
                            ]]))
                        ]])),
                        1
                    )]
                ])
            ),
            expected: input
        },
    ];
};

test('parser', function (test) {
    test.plan(7);

    test.test('testUnknownTag', function (test) {
        let stream = new TwingTokenStream([
            new Token(TokenType.BLOCK_START_TYPE, '', 1),
            new Token(TokenType.NAME_TYPE, 'foo', 1),
            new Token(TokenType.BLOCK_END_TYPE, '', 1),
            new Token(TokenType.EOF_TYPE, '', 1),
        ]);

        let parser = new TwingParser(testEnv);

        test.throws(function () {
            parser.parse(stream);
        }, /Unknown "foo" tag\. Did you mean "for" at line 1\?/);

        test.end();
    });

    test.test('testUnknownTagWithoutSuggestions', function (test) {
        let stream = new TwingTokenStream([
            new Token(TokenType.BLOCK_START_TYPE, '', 1),
            new Token(TokenType.NAME_TYPE, 'foobar', 1),
            new Token(TokenType.BLOCK_END_TYPE, '', 1),
            new Token(TokenType.EOF_TYPE, '', 1),
        ]);

        let parser = new TwingParser(testEnv);

        test.throws(function () {
            parser.parse(stream);
        }, /Unknown "foobar" tag at line 1\./);

        test.end();
    });

    test.test('testFilterBodyNodes', function (test) {
        let parser = new TwingParser(testEnv);

        getFilterBodyNodesData().forEach(function (data) {
            test.same(parser.filterBodyNodes(data.input), data.expected);
        });

        test.end();
    });

    test.test('testFilterBodyNodesThrowsException', function (test) {
        let parser = getParser();

        let fixtures = [
            new TwingNodeText('foo', 1),
            new TwingNode(
                new TwingMap([[0, new TwingNode(
                    new TwingMap([[0, new TwingNodeText('foo', 1)]])
                )]])
            )
        ];

        test.throws(function () {
            fixtures.forEach(function (fixture) {
                parser.filterBodyNodes(fixture);
            });
        }, /A template that extends another one cannot include contents outside Twig blocks\. Did you forget to put the contents inside a {% block %} tag at line 1\?/);

        test.end();
    });

    test.test('testFilterBodyNodesWithBOM', function (test) {
        let parser = getParser();

        let fixtures = [
            new TwingNodeText(String.fromCharCode(0xEF, 0xBB, 0xBF), 1),
        ];

        test.throws(function () {
            fixtures.forEach(function (fixture) {
                parser.filterBodyNodes(fixture);
            });
        }, /A template that extends another one cannot start with a byte order mark \(BOM\); it must be removed at line 1\./);

        test.end();
    });

    test.test('testParseIsReentrant', function (test) {
        let twig = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        twig.addTokenParser(new TestTokenParser());

        let parser = new TwingParser(twig);

        parser.parse(new TwingTokenStream([
            new TwingToken(TwingTokenType.BLOCK_START_TYPE, '', 1),
            new TwingToken(TwingTokenType.NAME_TYPE, 'test', 1),
            new TwingToken(TwingTokenType.BLOCK_END_TYPE, '', 1),
            new TwingToken(TwingTokenType.VAR_START_TYPE, '', 1),
            new TwingToken(TwingTokenType.NAME_TYPE, 'foo', 1),
            new TwingToken(TwingTokenType.VAR_END_TYPE, '', 1),
            new TwingToken(TwingTokenType.EOF_TYPE, '', 1),
        ]));

        test.isEqual(parser.getParent(), null);

        test.end();
    });

    test.test('testGetVarName', function (test) {
        let twig = new TwingEnvironment(new TwingLoaderFilesystem(), {
            autoescape: false,
            optimizations: 0
        });

        // The getVarName() must not depend on the template loaders,
        // If this test does not throw any exception, that's good.
        // see https://github.com/symfony/symfony/issues/4218
        try {
            let ast = twig.parse(twig.tokenize(new TwingSource('{% from _self import foo %}\n\n{% macro foo() %}\n{{ foo }}\n{% endmacro %}', 'index')));

            test.ok(ast);
        }
        catch (err) {
            test.fail(err);
        }

        test.end();
    });
});
