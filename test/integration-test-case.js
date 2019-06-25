const {TwingTokenParser} = require('../build/lib/token-parser');
const {TwingNodePrint} = require('../build/lib/node/print');
const {TwingTokenType} = require('../build/lib/token');
const {TwingNodeExpressionConstant} = require('../build/lib/node/expression/constant');
const {TwingExtension} = require('../build/lib/extension');
const {TwingFilter} = require('../build/lib/filter');
const {TwingFunction} = require('../build/lib/function');
const {TwingTest} = require('../build/lib/test');
const {twingFilterEscape: escape} = require('../build/lib/extension/core/filters/escape');
const {TwingLoaderArray} = require('../build/lib/loader/array');

class TwingTestTokenParserSection extends TwingTokenParser {
    parse(token) {
        this.parser.getStream().expect(TwingTokenType.BLOCK_END);

        return new TwingNodePrint(new TwingNodeExpressionConstant('§', -1, -1), -1, -1);
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

        return [
            // new TwingFilter('§', array($this, '§Filter')),
            new TwingFilter('escape_and_nl2br', escape_and_nl2br, {
                'needs_environment': true,
                'is_safe': ['html']
            }),
            // name this filter "nl2br_" to allow the core "nl2br" filter to be tested
            new TwingFilter('nl2br_', nl2br, {'pre_escape': 'html', 'is_safe': ['html']}),
            new TwingFilter('§', this.sectionFilter),
            new TwingFilter('escape_something', escape_something, {'is_safe': ['something']}),
            new TwingFilter('preserves_safety', preserves_safety, {'preserves_safety': ['html']}),
            new TwingFilter('static_call_string', TwingTestExtension.staticCall),
            new TwingFilter('static_call_array', TwingTestExtension.staticCall),
            new TwingFilter('magic_call', function () {
                return self.__call('magicCall', arguments);
            }),
            new TwingFilter('magic_call_string', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            }),
            new TwingFilter('magic_call_array', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            }),
            new TwingFilter('*_path', dynamic_path),
            new TwingFilter('*_foo_*_bar', dynamic_foo),
            new TwingFilter('anon_foo', function (name) {
                return '*' + name + '*';
            }),
        ];
    }

    getFunctions() {
        return [
            new TwingFunction('§', this.sectionFunction),
            new TwingFunction('safe_br', this.br, {'is_safe': ['html']}),
            new TwingFunction('unsafe_br', this.br),
            new TwingFunction('static_call_string', TwingTestExtension.staticCall),
            new TwingFunction('static_call_array', TwingTestExtension.staticCall),
            new TwingFunction('*_path', dynamic_path),
            new TwingFunction('*_foo_*_bar', dynamic_foo),
            new TwingFunction('anon_foo', function (name) {
                return '*' + name + '*';
            }),
        ];
    }

    getTests() {
        return [
            new TwingTest('multi word', this.is_multi_word),
            new TwingTest('test_*', this.dynamic_test)
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

    dynamic_test(element, item) {
        return element === item;
    }

    __call(method, arguments_) {
        if (method !== 'magicCall') {
            throw new Error('Unexpected call to __call');
        }

        return 'magic_' + arguments_[0];
    }
}

const test = require('tape');
const merge = require('merge');
const sinon = require('sinon');

module.exports = class TwingTestIntegrationTestCaseBase {
    constructor() {
        this.twing = null;
    }

    setTwing(env) {
        this.twing = env;
    }

    getExtensions() {
        let extensions = [];

        extensions.push(new TwingTestExtension());

        return extensions;
    }

    getDescription() {
        return '<no description provided>';
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

    getExpectedDeprecationMessages() {
        return null;
    }

    run(TwingEnvironment) {
        test(this.getDescription(), (test) => {
            // templates
            let templates = this.getTemplates();

            // config
            let config = merge({
                strict_variables: true,
                cache: false
            }, this.getConfig());

            let loader = new TwingLoaderArray(templates);
            let twing = new TwingEnvironment(loader, config);

            this.setTwing(twing);

            // extensions
            this.getExtensions().forEach(function (extension) {
                twing.addExtension(extension);
            });

            // globals
            this.getGlobals().forEach(function (value, key) {
                twing.addGlobal(key, value);
            });

            twing.addGlobal('global', 'global');

            // data
            let data = this.getData();

            let expected = this.getExpected();
            let expectedErrorMessage = this.getExpectedErrorMessage();
            let expectedDeprecationMessages = this.getExpectedDeprecationMessages();
            let consoleStub = null;
            let consoleData = [];

            if (expectedDeprecationMessages) {
                consoleStub = sinon.stub(console, 'error').callsFake((data, ...args) => {
                    consoleData.push(data);
                });
            }

            if (!expectedErrorMessage) {
                try {
                    let actual = twing.render('index.twig', data);

                    test.same(actual.trim(), expected.trim(), 'should render as expected');

                    if (consoleStub) {
                        consoleStub.restore();

                        test.same(consoleData, expectedDeprecationMessages, 'should output deprecation warnings');
                    }
                } catch (e) {
                    console.warn(e);

                    test.fail(`should not throw an error (${e})`);
                }
            } else {
                try {
                    twing.render('index.twig', data);

                    test.fail(`should throw an error`);
                } catch (e) {
                    test.same(e.toString(), expectedErrorMessage, 'should throw an error');
                }
            }

            test.end();
        });
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
