const TwingTokenParser = require('../lib/twing/token-parser').TwingTokenParser;
const TwingNodePrint = require('../lib/twing/node/print').TwingNodePrint;
const TwingToken = require('../lib/twing/token').TwingToken;
const TwingNodeExpressionConstant = require('../lib/twing/node/expression/constant').TwingNodeExpressionConstant;
const TwingExtension = require('../lib/twing/extension').TwingExtension;
const TwingExtensionDebug = require('../lib/twing/extension/debug').TwingExtensionDebug;
const escape = require('../lib/twing/extension/core').twingEscapeFilter;

const path = require('path');
const TwingExtensionSandbox = require('../lib/twing/extension/sandbox').TwingExtensionSandbox;
const TwingExtensionStringLoader = require('../lib/twing/extension/string-loader').TwingExtensionStringLoader;
const TwingFilter = require('../lib/twing/filter').TwingFilter;
const TwingFunction = require('../lib/twing/function').TwingFunction;
const TwingTest = require('../lib/twing/test').TwingTest;
const TwingSandboxSecurityPolicy = require('../lib/twing/sandbox/security-policy').TwingSandboxSecurityPolicy;

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing', path.resolve('./lib/runtime.js'));

class TwingTestTokenParserSection extends TwingTokenParser {
    parse(token) {
        this.parser.getStream().expect(TwingToken.BLOCK_END_TYPE);

        return new TwingNodePrint(new TwingNodeExpressionConstant('§', -1), -1);
    }

    getTag() {
        return '§';
    }
}

class TwingTestExtension extends TwingExtension {
    static staticCall(value) {
        return `*${value}*`;
    }

    static __callStatic(method, arguments_) {
        if (method !== 'magicStaticCall') {
            throw new Error('Unexpected call to __callStatic');
        }

        return 'static_magic_' + arguments_[0];
    }

    getTokenParsers() {
        return [
            new TwingTestTokenParserSection()
        ];
    }

    getFilters() {
        let self = this;
        let i = 0;

        return new Map([
            // new TwingFilter('§', array($this, '§Filter')),
            [i++, new TwingFilter('escape_and_nl2br', escape_and_nl2br, {
                'needs_environment': true,
                'is_safe': ['html']
            })],
            // name this filter "nl2br_" to allow the core "nl2br" filter to be tested
            [i++, new TwingFilter('nl2br_', nl2br, {'pre_escape': 'html', 'is_safe': ['html']})],
            [i++, new TwingFilter('§', this.sectionFilter)],
            [i++, new TwingFilter('escape_something', escape_something, {'is_safe': ['something']})],
            [i++, new TwingFilter('preserves_safety', preserves_safety, {'preserves_safety': ['html']})],
            [i++, new TwingFilter('static_call_string', TwingTestExtension.staticCall)],
            [i++, new TwingFilter('static_call_array', TwingTestExtension.staticCall)],
            [i++, new TwingFilter('magic_call', function () {
                return self.__call('magicCall', arguments);
            })],
            [i++, new TwingFilter('magic_call_string', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            })],
            [i++, new TwingFilter('magic_call_array', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            })],
            [i++, new TwingFilter('*_path', dynamic_path)],
            [i++, new TwingFilter('*_foo_*_bar', dynamic_foo)],
            [i++, new TwingFilter('anon_foo', function (name) {
                return '*' + name + '*';
            })],
            [i++, new TwingFilter('async_foo', function (name) {
                return new Promise((resolve) => {
                    resolve('*' + name + '*');
                });
            })]
        ]);
    }

    getFunctions() {
        let i = 0;

        return new Map([
            [i++, new TwingFunction('§', this.sectionFunction)],
            [i++, new TwingFunction('safe_br', this.br, {'is_safe': ['html']})],
            [i++, new TwingFunction('unsafe_br', this.br)],
            [i++, new TwingFunction('static_call_string', TwingTestExtension.staticCall)],
            [i++, new TwingFunction('static_call_array', TwingTestExtension.staticCall)],
            [i++, new TwingFunction('*_path', dynamic_path)],
            [i++, new TwingFunction('*_foo_*_bar', dynamic_foo)],
            [i++, new TwingFunction('anon_foo', function (name) {
                return '*' + name + '*';
            })],
            [i++, new TwingFunction('async_foo', function (name) {
                return new Promise((resolve) => {
                    resolve('*' + name + '*');
                })
            })]
        ]);
    }

    getTests() {
        return [
            new TwingTest('multi word', this.is_multi_word),
            new TwingTest('async_foo', function (value) {
                return new Promise((resolve) => {
                    resolve(value >= 0);
                })
            })
        ];
    }

    sectionFilter(value) {
        return `§${value}§`;
    }

    sectionFunction(value) {
        return `§${value}§`;
    }

    br() {
        return '<br />';
    }

    is_multi_word(value) {
        return value.indexOf(' ') > -1;
    }

    __call(method, arguments_) {
        if (method !== 'magicCall') {
            throw new Error('Unexpected call to __call');
        }

        return 'magic_' + arguments_[0];
    }
}

module.exports = class TwingTestIntegrationTestCaseBase {
    constructor(name) {
        this.name = name;
        this.twing = null;
    }

    setTwing(twing) {
        this.twing = twing;
    }

    getExtensions(includeSandbox = true) {
        let extensions = [
            new TwingExtensionDebug()
        ];

        if (includeSandbox) {
            let policy = new TwingSandboxSecurityPolicy([], [], new Map(), new Map(), []);

            extensions.push(new TwingExtensionSandbox(policy, false));
        }

        extensions.push(new TwingExtensionStringLoader());
        extensions.push(new TwingTestExtension());

        return extensions;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.getName();
    }

    getTemplates() {
        return new Map();
    }

    getExpected() {
        return '';
    }

    getGlobals() {
        return new Map();
    }

    getData() {
        return {};
    }

    getConfig() {
        return {};
    }

    getExpectedErrorMessage() {
        return null;
    }
};

/**
 * nl2br which also escapes, for testing escaper filters.
 */
function escape_and_nl2br(env, value, sep = '<br />') {
    let result = escape(env, value, 'html');

    return nl2br(result, sep);
}

/**
 * nl2br only, for testing filters with pre_escape.
 */
function nl2br(value, sep = '<br />') {
    // not secure if value contains html tags (not only entities)
    // don't use
    return value.replace('\n', `${sep}\n`);
}

function escape_something(value) {
    return value.toUpperCase();
}

function preserves_safety(value) {
    return value.toUpperCase();
}

function dynamic_path(element, item) {
    return element + '/' + item;
}

function dynamic_foo(foo, bar, item) {
    return foo + '/' + bar + '/' + item;
}
