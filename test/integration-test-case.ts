import {TwingEnvironmentOptions} from "../src/environment-options";
import {TwingEnvironment} from "../src/environment";
import {TwingTokenParser} from "../src/token-parser";
import {TwingToken} from "../src/token";
import {TwingNodePrint} from "../src/node/print";
import {TwingTokenType} from "../src/token-type";
import {TwingNodeExpressionConstant} from "../src/node/expression/constant";
import {TwingExtension} from "../src/extension";
import {TwingExtensionDebug} from "../src/extension/debug";
import {escape} from "../src/helper/escape";

const path = require('path');

let moduleAlias = require('module-alias');

moduleAlias.addAlias('twing', path.resolve('./build/node/twing.js'));

let Twing = require('twing');

class TwingTestTokenParserSection extends TwingTokenParser {
    parse(token: TwingToken) {
        this.parser.getStream().expect(TwingTokenType.BLOCK_END_TYPE);

        return new TwingNodePrint(new TwingNodeExpressionConstant('§', -1), -1);
    }

    getTag() {
        return '§';
    }
}

class TwingTestExtension extends TwingExtension {
    getTokenParsers() {
        return [
            new TwingTestTokenParserSection()
        ];
    }

    getFilters() {
        let self = this;

        return [
            // new TwingFilter('§', array($this, '§Filter')),
            new Twing.TwingFilter('escape_and_nl2br', escape_and_nl2br, {
                'needs_environment': true,
                'is_safe': ['html']
            }),
            // name this filter "nl2br_" to allow the core "nl2br" filter to be tested
            new Twing.TwingFilter('nl2br_', nl2br, {'pre_escape': 'html', 'is_safe': ['html']}),
            new Twing.TwingFilter('§', this.sectionFilter),
            new Twing.TwingFilter('escape_something', escape_something, {'is_safe': ['something']}),
            new Twing.TwingFilter('preserves_safety', preserves_safety, {'preserves_safety': ['html']}),
            new Twing.TwingFilter('static_call_string', TwingTestExtension.staticCall),
            new Twing.TwingFilter('static_call_array', TwingTestExtension.staticCall),
            new Twing.TwingFilter('magic_call', function () {
                return self.__call('magicCall', arguments);
            }),
            new Twing.TwingFilter('magic_call_string', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            }),
            new Twing.TwingFilter('magic_call_array', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            }),
            new Twing.TwingFilter('*_path', dynamic_path),
            new Twing.TwingFilter('*_foo_*_bar', dynamic_foo),
            new Twing.TwingFilter('anon_foo', function (name: string) {
                return '*' + name + '*';
            }),
            new Twing.TwingFilter('async_foo', function (name: string) {
                return new Promise((resolve) => {
                    resolve('*' + name + '*');
                });
            })
        ];
    }

    getFunctions() {
        return [
            new Twing.TwingFunction('§', this.sectionFunction),
            new Twing.TwingFunction('safe_br', this.br, {'is_safe': ['html']}),
            new Twing.TwingFunction('unsafe_br', this.br),
            new Twing.TwingFunction('static_call_string', TwingTestExtension.staticCall),
            new Twing.TwingFunction('static_call_array', TwingTestExtension.staticCall),
            new Twing.TwingFunction('*_path', dynamic_path),
            new Twing.TwingFunction('*_foo_*_bar', dynamic_foo),
            new Twing.TwingFunction('anon_foo', function (name: string) {
                return '*' + name + '*';
            }),
            new Twing.TwingFunction('async_foo', function (name: string) {
                return new Promise((resolve) => {
                    resolve('*' + name + '*');
                });
            })
        ];
    }

    getTests() {
        return [
            new Twing.TwingTest('multi word', this.is_multi_word),
            new Twing.TwingTest('async_foo', function (value: number) {
                return new Promise((resolve) => {
                    resolve(value >= 0);
                })
            })
        ];
    }

    sectionFilter(value: string) {
        return `§${value}§`;
    }

    sectionFunction(value: string) {
        return `§${value}§`;
    }

    br() {
        return '<br />';
    }

    static staticCall(value: string) {
        return `*${value}*`;
    }

    is_multi_word(value: string) {
        return value.indexOf(' ') > -1;
    }

    public __call(method: string, arguments_: IArguments) {
        if (method !== 'magicCall') {
            throw new Error('Unexpected call to __call');
        }

        return 'magic_' + arguments_[0];
    }

    static __callStatic(method: string, arguments_: IArguments) {
        if (method !== 'magicStaticCall') {
            throw new Error('Unexpected call to __callStatic');
        }

        return 'static_magic_' + arguments_[0];
    }
}

export class TwingTestIntegrationTestCase {
    protected name: string;
    protected twing: TwingEnvironment;

    constructor(name: string) {
        this.name = name;
    }

    setTwing(twing: TwingEnvironment) {
        this.twing = twing;
    }

    getExtensions() {
        let policy = new Twing.TwingSandboxSecurityPolicy([], [], [], [], []);

        return [
            new TwingExtensionDebug(),
            new Twing.TwingExtensionSandbox(policy, false),
            new Twing.TwingExtensionStringLoader(),
            new TwingTestExtension()
        ];
    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.getName();
    }

    getTemplates(): Map<string, string> {
        return new Map();
    }

    getExpected(): string {
        return '';
    }

    getGlobals(): Map<string, any> {
        return new Map();
    }

    getData(): any {
        return {};
    }

    getConfig(): TwingEnvironmentOptions {
        return {};
    }

    getExpectedErrorMessage(): string {
        return null;
    }
}

/**
 * nl2br which also escapes, for testing escaper filters.
 */
function escape_and_nl2br(env: TwingEnvironment, value: string, sep: string = '<br />') {
    let result = escape(env, value, 'html');

    return nl2br(result, sep);
}

/**
 * nl2br only, for testing filters with pre_escape.
 */
function nl2br(value: string, sep: string = '<br />') {
    // not secure if value contains html tags (not only entities)
    // don't use
    return value.replace('\n', `${sep}\n`);
}

function escape_something(value: string) {
    return value.toUpperCase();
}

function preserves_safety(value: string) {
    return value.toUpperCase();
}

function dynamic_path(element: string, item: string) {
    return element + '/' + item;
}

function dynamic_foo(foo: string, bar: string, item: string) {
    return foo + '/' + bar + '/' + item;
}
