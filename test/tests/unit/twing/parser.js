const TwingEnvironment = require('../../../../lib/twing/environment').TwingEnvironment;
const TwingParser = require('../../../../lib/twing/parser').TwingParser;
const TwingNode = require('../../../../lib/twing/node').TwingNode;
const TwingTokenStream = require('../../../../lib/twing/token-stream').TwingTokenStream;
const TwingTokenParser = require('../../../../lib/twing/token-parser').TwingTokenParser;
const TwingToken = require('../../../../lib/twing/token').TwingToken;

const TwingNodeText = require('../../../../lib/twing/node/text').TwingNodeText;
const TwingNodeSet = require('../../../../lib/twing/node/set').TwingNodeSet;
const TwingLoaderArray = require('../../../../lib/twing/loader/array').TwingLoaderArray;
const TwingSource = require('../../../../lib/twing/source').TwingSource;
const TwingErrorSyntax = require('../../../../lib/twing/error/syntax').TwingErrorSyntax;

const tap = require('tap');

let testEnv = new TwingEnvironment(null);

let getParser = function () {
    let parser = new TwingParser(new TwingEnvironment(null));

    parser.setParent(new TwingNode());
    // todo: stream is a private property, we use that workaround for now because this is how the property was implemented in PHP
    parser['stream'] = new TwingTokenStream([]);

    return parser;
};

class TestTokenParser extends TwingTokenParser {
    parse(token) {
        // simulate the parsing of another template right in the middle of the parsing of the active template
        this.parser.parse(new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1),
            new TwingToken(TwingToken.NAME_TYPE, 'extends', 1),
            new TwingToken(TwingToken.STRING_TYPE, 'base', 1),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1),
            new TwingToken(TwingToken.EOF_TYPE, '', 1),
        ]));

        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNode();
    }

    getTag() {
        return 'test';
    }
}

/**
 *
 * @returns Array<{input; expected}>
 */
let getFilterBodyNodesData = function () {
    let input;

    return [
        {
            input: new TwingNode(new Map([[0, new TwingNodeText('   ', 1)]])),
            expected: new TwingNode(),
        },
        {
            input: input = new TwingNode(new Map([[0, new TwingNodeSet(false, new TwingNode(), new TwingNode(), 1)]])),
            expected: input
        },
        {
            input: input = new TwingNode(new Map([
                    ['0', new TwingNodeSet(
                        true,
                        new TwingNode(),
                        new TwingNode(new Map([[
                            0, new TwingNode(new Map([[
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

tap.test('parser', function (test) {
    test.test('testUnknownTag', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1),
            new TwingToken(TwingToken.NAME_TYPE, 'foo', 1),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1),
            new TwingToken(TwingToken.EOF_TYPE, '', 1),
        ]);

        let parser = new TwingParser(testEnv);

        test.throws(function () {
            parser.parse(stream);
        }, /Unknown "foo" tag\. Did you mean "for" at line 1\?/);

        test.end();
    });

    test.test('testUnknownTagWithoutSuggestions', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1),
            new TwingToken(TwingToken.NAME_TYPE, 'foobar', 1),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1),
            new TwingToken(TwingToken.EOF_TYPE, '', 1),
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
                new Map([[0, new TwingNode(
                    new Map([[0, new TwingNodeText('foo', 1)]])
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
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1),
            new TwingToken(TwingToken.NAME_TYPE, 'test', 1),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1),
            new TwingToken(TwingToken.VAR_START_TYPE, '', 1),
            new TwingToken(TwingToken.NAME_TYPE, 'foo', 1),
            new TwingToken(TwingToken.VAR_END_TYPE, '', 1),
            new TwingToken(TwingToken.EOF_TYPE, '', 1),
        ]));

        test.isEqual(parser.getParent(), null);

        test.end();
    });

    test.test('testGetVarName', function (test) {
        let twig = new TwingEnvironment(new TwingLoaderArray(new Map()), {
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

    test.test('should throw an error on missing tag name', function (test) {
        let twig = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        twig.addTokenParser(new TestTokenParser());

        let parser = new TwingParser(twig);

        test.throws(function () {
            parser.parse(new TwingTokenStream([
                new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1),
                new TwingToken(TwingToken.VAR_START_TYPE, '', 1),
                new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1)
            ]));
        }, new TwingErrorSyntax('A block must start with a tag name.', 1, new TwingSource('', '', '')));

        test.end();
    });

    test.end();
});
