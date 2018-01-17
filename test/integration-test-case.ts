import TwingEnvironmentOptions from "../src/environment-options";
import TwingEnvironment from "../src/environment";
import TwingFunction from "../src/function";
import TwingFilter from "../src/filter";
import TwingExtensionSandbox from "../src/extension/sandbox";
import TwingSandboxSecurityPolicy from "../src/sandbox/security-policy";
import TwingTokenParser from "../src/token-parser";
import TwingToken from "../src/token";
import TwingNodePrint from "../src/node/print";
import TwingTokenType from "../src/token-type";
import TwingNodeExpressionConstant from "../src/node/expression/constant";
import TwingExtension from "../src/extension";
import TwingExtensionDebug from "../src/extension/debug";
import TwingExtensionStringLoader from "../src/extension/string-loader";
import TwingTest from "../src/test";

import escape from '../src/util/escape';
import TwingExtensionProfiler from "../src/extension/profiler";
import TwingProfilerProfile from "../src/profiler/profile";

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
            new TwingFilter('escape_and_nl2br', this.escape_and_nl2br.bind(this), {
                'needs_environment': true,
                'is_safe': ['html']
            }),
            // name this filter "nl2br_" to allow the core "nl2br" filter to be tested
            new TwingFilter('nl2br_', this.nl2br.bind(this), {'pre_escape': 'html', 'is_safe': ['html']}),
            new TwingFilter('§', this.sectionFilter),
            new TwingFilter('escape_something', this.escape_something.bind(this), {'is_safe': ['something']}),
            new TwingFilter('preserves_safety', this.preserves_safety, {'preserves_safety': ['html']}),
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
            new TwingFilter('*_path', this.dynamic_path),
            new TwingFilter('*_foo_*_bar', this.dynamic_foo),
            new TwingFilter('anon_foo', function (name: string) {
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
            new TwingFunction('*_path', this.dynamic_path),
            new TwingFunction('*_foo_*_bar', this.dynamic_foo),
            new TwingFunction('anon_foo', function (name: string) {
                return '*' + name + '*';
            }),
        ];
    }

    getTests() {
        return [
            new TwingTest('multi word', this.is_multi_word)
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

    /**
     * nl2br which also escapes, for testing escaper filters.
     */
    escape_and_nl2br(env: TwingEnvironment, value: string, sep: string = '<br />') {
        let result = escape(env, value, 'html');

        return this.nl2br(result, sep);
    }

    /**
     * nl2br only, for testing filters with pre_escape.
     */
    nl2br(value: string, sep: string = '<br />') {
        // not secure if value contains html tags (not only entities)
        // don't use
        return value.replace('\n', `${sep}\n`);
    }

    dynamic_path(element: string, item: string) {
        return element + '/' + item;
    }

    dynamic_foo(foo: string, bar: string, item: string) {
        return foo + '/' + bar + '/' + item;
    }

    escape_something(value: string) {
        return value.toUpperCase();
    }

    preserves_safety(value: string) {
        return value.toUpperCase();
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

class TwingTestIntegrationTestCase {
    protected name: string;
    protected twing: TwingEnvironment;

    constructor(name: string) {
        this.name = name;
    }

    setTwing(twing: TwingEnvironment) {
        this.twing = twing;
    }

    getExtensions() {
        let policy = new TwingSandboxSecurityPolicy([], [], [], [], []);

        return [
            new TwingExtensionDebug(),
            new TwingExtensionSandbox(policy, false),
            new TwingExtensionStringLoader(),
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

export default TwingTestIntegrationTestCase;