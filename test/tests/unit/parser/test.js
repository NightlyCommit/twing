const {TwingEnvironment} = require('../../../../build/environment');
const {TwingParser} = require('../../../../build/parser');
const {TwingNodeType, TwingNode} = require('../../../../build/node');
const {TwingTokenParser} = require('../../../../build/token-parser');
const {TwingToken} = require('../../../../build/token');
const {TwingTokenStream} = require('../../../../build/token-stream');
const {TwingNodeText} = require('../../../../build/node/text');
const {TwingNodeSet} = require('../../../../build/node/set');
const {TwingLoaderArray} = require('../../../../build/loader/array');
const {TwingSource} = require('../../../../build/source');
const {TwingErrorSyntax} = require('../../../../build/error/syntax');

const tap = require('tape');
const sinon = require('sinon');

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
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1, 0),
            new TwingToken(TwingToken.NAME_TYPE, 'extends', 1, 0),
            new TwingToken(TwingToken.STRING_TYPE, 'base', 1, 0),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1, 0),
            new TwingToken(TwingToken.EOF_TYPE, '', 1, 0),
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
            input: new TwingNode(new Map([[0, new TwingNodeText('   ', 1, 0)]])),
            expected: new TwingNode(),
        },
        {
            input: input = new TwingNode(new Map([[0, new TwingNodeSet(false, new TwingNode(), new TwingNode(), 1, 0)]])),
            expected: input
        },
        {
            input: input = new TwingNode(new Map([
                    ['0', new TwingNodeSet(
                        true,
                        new TwingNode(),
                        new TwingNode(new Map([[
                            0, new TwingNode(new Map([[
                                0, new TwingNodeText('foo', 1, 0)
                            ]]))
                        ]])),
                        1, 0
                    )]
                ])
            ),
            expected: input
        },
    ];
};

let getFilterBodyNodesWithBOMData = function () {
    return [
        ' ',
        "\t",
        "\n",
        "\n\t\n   ",
    ];
};

tap.test('parser', function (test) {
    test.test('testUnknownTag', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1, 0),
            new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 0),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1, 0),
            new TwingToken(TwingToken.EOF_TYPE, '', 1, 0),
        ]);

        let parser = new TwingParser(testEnv);

        test.throws(function () {
            parser.parse(stream);
        }, /Unknown "foo" tag\. Did you mean "for" at line 1\?/);

        test.end();
    });

    test.test('testUnknownTagWithoutSuggestions', function (test) {
        let stream = new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1, 0),
            new TwingToken(TwingToken.NAME_TYPE, 'foobar', 1, 0),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1, 0),
            new TwingToken(TwingToken.EOF_TYPE, '', 1, 0),
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
            new TwingNodeText('foo', 1, 0),
            new TwingNode(
                new Map([[0, new TwingNode(
                    new Map([[0, new TwingNodeText('foo', 1, 0)]])
                )]])
            )
        ];

        test.throws(function () {
            fixtures.forEach(function (fixture) {
                parser.filterBodyNodes(fixture);
            });
        }, /A template that extends another one cannot include content outside Twig blocks\. Did you forget to put the content inside a {% block %} tag at line 1\?/);

        test.end();
    });

    test.test('testFilterBodyNodesWithBOM', function (test) {
        let parser = getParser();

        let bomData = String.fromCharCode(0xEF, 0xBB, 0xBF);

        test.throws(function () {
            parser.filterBodyNodes(new TwingNodeText(bomData + 'not empty', 1, 0));
        }, /A template that extends another one cannot include content outside Twig blocks. Did you forget to put the content inside a {% block %} tag at line 1\?/);

        for (let emptyNode of getFilterBodyNodesWithBOMData()) {
            test.same(null, parser.filterBodyNodes(new TwingNodeText(bomData + emptyNode, 1, 0)));
        }

        test.end();
    });

    test.test('testParseIsReentrant', function (test) {
        let twing = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        twing.addTokenParser(new TestTokenParser());

        let parser = new TwingParser(twing);

        parser.parse(new TwingTokenStream([
            new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1, 0),
            new TwingToken(TwingToken.NAME_TYPE, 'test', 1, 0),
            new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1, 0),
            new TwingToken(TwingToken.VAR_START_TYPE, '', 1, 0),
            new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 0),
            new TwingToken(TwingToken.VAR_END_TYPE, '', 1, 0),
            new TwingToken(TwingToken.EOF_TYPE, '', 1, 0),
        ]));

        test.isEqual(parser.getParent(), null);

        test.end();
    });

    test.test('testGetVarName', function (test) {
        let twing = new TwingEnvironment(new TwingLoaderArray(new Map()), {
            autoescape: false,
            optimizations: 0
        });

        // The getVarName() must not depend on the template loaders,
        // If this test does not throw any exception, that's good.
        // see https://github.com/symfony/symfony/issues/4218
        try {
            let ast = twing.parse(twing.tokenize(new TwingSource('{% from _self import foo %}\n\n{% macro foo() %}\n{{ foo }}\n{% endmacro %}', 'index')));

            test.ok(ast);
        } catch (err) {
            test.fail(err);
        }

        test.end();
    });

    test.test('should throw an error on missing tag name', function (test) {
        let twing = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        twing.addTokenParser(new TestTokenParser());

        let parser = new TwingParser(twing);

        test.throws(function () {
            parser.parse(new TwingTokenStream([
                new TwingToken(TwingToken.BLOCK_START_TYPE, '', 1, 0),
                new TwingToken(TwingToken.VAR_START_TYPE, '', 1, 0),
                new TwingToken(TwingToken.BLOCK_END_TYPE, '', 1, 0)
            ]));
        }, new TwingErrorSyntax('A block must start with a tag name.', 1, new TwingSource('', '', '')));

        test.end();
    });

    test.test('parse', function (test) {
        let twing = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        let parser = new TwingParser(twing);

        let stub = sinon.stub(parser, 'subparse');

        stub.throws(new Error('foo'));

        test.throws(function () {
            parser.parse(new TwingTokenStream([]));
        }, new Error('foo'));

        stub.throws(new TwingErrorSyntax('foo.'));

        test.throws(function () {
            parser.parse(new TwingTokenStream([]));
        }, new TwingErrorSyntax('foo.', -1, new TwingSource('', '')));

        test.end();
    });

    test.test('subparse', function (test) {
        let twing = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        let parser = new TwingParser(twing);

        test.throws(function () {
            parser.parse(new TwingTokenStream([
                new TwingToken(TwingToken.BLOCK_START_TYPE, '{%', 1, 0),
                new TwingToken(TwingToken.NAME_TYPE, 'foo', 1, 0),
                new TwingToken(TwingToken.BLOCK_END_TYPE, '{', 1, 0)
            ]), [false, () => {
                return false;
            }]);
        }, new TwingErrorSyntax('Unexpected "foo" tag', 1, new TwingSource('', '')));

        test.throws(function () {
            parser.parse(new TwingTokenStream([
                new TwingToken(-999, null, 1, 0)
            ]), ['foo', () => {
                return false;
            }]);
        }, new TwingErrorSyntax('Lexer or parser ended up in unsupported state.', 1, new TwingSource('', '')));

        test.end();
    });

    test.test('getImportedSymbol', function (test) {
        let twing = new TwingEnvironment(null);
        let parser = new TwingParser(twing);

        Reflect.set(parser, 'importedSymbols', [new Map()]);
        parser.addImportedSymbol('foo', null);

        test.equals(parser.getImportedSymbol('foo', 'bar'), null);

        test.end();
    });

    test.test('hasMacro', function (test) {
        let twing = new TwingEnvironment(null);
        let parser = new TwingParser(twing);

        Reflect.set(parser, 'macros', new Map([['foo', 'bar']]));

        test.true(parser.hasMacro('foo'));

        test.end();
    });

    test.test('supports comment tokens', function (test) {
        let twing = new TwingEnvironment(null, {
            autoescape: false,
            optimizations: 0
        });

        let parser = new TwingParser(twing);

        let node = parser.parse(new TwingTokenStream([
            new TwingToken(TwingToken.COMMENT_START_TYPE, '', 1, 0),
            new TwingToken(TwingToken.TEXT_TYPE, 'test', 1, 0),
            new TwingToken(TwingToken.COMMENT_END_TYPE, '', 1, 0),
            new TwingToken(TwingToken.EOF_TYPE, '', 1, 0),
        ]));

        let body = node.getNode('body');

        test.same(body.getNode(0).getType(), TwingNodeType.COMMENT);
        test.same(body.getNode(0).getAttribute('data'), 'test');

        test.end();
    });

    test.end();
});
