import * as tape from 'tape';
import * as sinon from 'sinon';

import {Token, TokenType} from "twig-lexer";
import {TwingEnvironment} from "../../../src/lib/environment";
import {TwingTokenParser} from "../../../src/lib/token-parser";
import {TwingNodePrint} from "../../../src/lib/node/print";
import {TwingNodeExpressionConstant} from "../../../src/lib/node/expression/constant";
import {TwingExtension} from "../../../src/lib/extension";
import {TwingFilter} from "../../../src/lib/filter";
import {TwingFunction} from "../../../src/lib/function";
import {TwingTest} from "../../../src/lib/test";
import {TwingSandboxSecurityPolicy} from "../../../src/lib/sandbox/security-policy";
import {TwingLoaderArray} from "../../../src/lib/loader/array";
import {escape} from "../../../src/lib/extension/core/filters/escape";
import {TwingEnvironmentOptions} from "../../../src/lib/environment-options";
import {TwingLoaderInterface} from "../../../src/lib/loader-interface";

class TwingTestTokenParserSection extends TwingTokenParser {
    parse(token: Token) {
        this.parser.getStream().expect(TokenType.TAG_END);

        return new TwingNodePrint(new TwingNodeExpressionConstant('§', -1, -1), -1, -1);
    }

    getTag() {
        return '§';
    }
}

class TwingTestExtension extends TwingExtension {
    static staticCall(value: string) {
        return `*${value}*`;
    }

    static __callStatic(method: string, ...arguments_: any[]) {
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
        return [
            // new TwingFilter('§', array($this, '§Filter')),
            new TwingFilter('escape_and_nl2br', escape_and_nl2br, [], {
                'needs_environment': true,
                'is_safe': ['html']
            }),
            // name this filter "nl2br_" to allow the core "nl2br" filter to be tested
            new TwingFilter('nl2br_', nl2br, [], {'pre_escape': 'html', 'is_safe': ['html']}),
            new TwingFilter('§', this.sectionFilter, []),
            new TwingFilter('escape_something', escape_something, [], {'is_safe': ['something']}),
            new TwingFilter('preserves_safety', preserves_safety, [], {'preserves_safety': ['html']}),
            new TwingFilter('static_call_string', TwingTestExtension.staticCall, []),
            new TwingFilter('static_call_array', TwingTestExtension.staticCall, []),
            new TwingFilter('magic_call_string', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            }, []),
            new TwingFilter('magic_call_array', function () {
                return TwingTestExtension.__callStatic('magicStaticCall', arguments);
            }, []),
            new TwingFilter('*_path', dynamic_path, []),
            new TwingFilter('*_foo_*_bar', dynamic_foo, []),
            new TwingFilter('anon_foo', function (name: string) {
                return '*' + name + '*';
            }, []),
        ];
    }

    getFunctions() {
        return [
            new TwingFunction('§', this.sectionFunction, []),
            new TwingFunction('safe_br', this.br, [], {'is_safe': ['html']}),
            new TwingFunction('unsafe_br', this.br, []),
            new TwingFunction('static_call_string', TwingTestExtension.staticCall, []),
            new TwingFunction('static_call_array', TwingTestExtension.staticCall, []),
            new TwingFunction('*_path', dynamic_path, []),
            new TwingFunction('*_foo_*_bar', dynamic_foo, []),
            new TwingFunction('anon_foo', function (name: string) {
                return '*' + name + '*';
            }, []),
        ];
    }

    getTests() {
        return [
            new TwingTest('multi word', this.is_multi_word, []),
            new TwingTest('test_*', this.dynamic_test, [])
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

    is_multi_word(value: string) {
        return value.indexOf(' ') > -1;
    }

    dynamic_test(element: any, item: any) {
        return element === item;
    }
}

type EnvironmentConstructor = new (l: TwingLoaderInterface, o: TwingEnvironmentOptions) => TwingEnvironment;

export default abstract class {
    private _env: TwingEnvironment;
    private readonly _environmentConstructor: EnvironmentConstructor;
    private readonly _name: string;

    constructor(environmentConstructor: EnvironmentConstructor, name: string) {
        this._environmentConstructor = environmentConstructor;
        this._name = name;
    }

    protected get env() {
        return this._env;
    }

    setEnvironment(env: TwingEnvironment) {
        this._env = env;
    }

    getSandboxSecurityPolicyFilters(): string[] {
        return [];
    }

    getSandboxSecurityPolicyFunctions(): string[] {
        return [];
    }

    getSandboxSecurityPolicyTags(): string[] {
        return [];
    }

    getDescription(): string {
        return '<no description provided>';
    }

    getTemplates(): { [k: string]: string } {
        return {};
    }

    getExpected(): string {
        return '';
    }

    getGlobals(): { [k: string]: string } {
        return {};
    }

    getContext(): any {
        return {};
    }

    getEnvironmentOptions(): TwingEnvironmentOptions {
        return {};
    }

    getExpectedErrorMessage(): string {
        return null;
    }

    getExpectedDeprecationMessages(): string[] {
        return null;
    }

    run(): void {
        tape(`${this._name}`, (test) => {
            // templates
            let templates = this.getTemplates();

            // options
            let loader = new TwingLoaderArray(templates);
            let environment = new this._environmentConstructor(loader, Object.assign({}, {
                cache: false,
                sandbox_policy: new TwingSandboxSecurityPolicy(this.getSandboxSecurityPolicyTags(), this.getSandboxSecurityPolicyFilters(), new Map(), new Map(), this.getSandboxSecurityPolicyFunctions()),
                strict_variables: true
            } as TwingEnvironmentOptions, this.getEnvironmentOptions()));

            environment.addExtension(new TwingTestExtension(), 'TwingTestExtension');

            this.setEnvironment(environment);

            // globals
            let globals = this.getGlobals();

            for (let key in this.getGlobals()) {
                this.env.addGlobal(key, globals[key]);
            }

            this.env.addGlobal('global', 'global');

            let context = this.getContext();
            let expected = this.getExpected();
            let expectedErrorMessage = this.getExpectedErrorMessage();
            let expectedDeprecationMessages = this.getExpectedDeprecationMessages();
            let consoleStub = null;
            let consoleData: string[] = [];

            if (expectedDeprecationMessages) {
                consoleStub = sinon.stub(console, 'warn').callsFake((data: string, ...args: any[]) => {
                    consoleData.push(data);
                });
            }

            if (!expectedErrorMessage) {
                try {
                    let actual = this.env.render('index.twig', context);

                    test.same(actual.trim(), expected.trim(), `${this.getDescription()} renders as expected`);

                    if (consoleStub) {
                        consoleStub.restore();

                        test.same(consoleData, expectedDeprecationMessages, `${this.getDescription()} outputs deprecation warnings`);
                    }
                } catch (e) {
                    test.fail(`${this.getDescription()} should not throw an error (${e})`);
                }
            } else {
                try {
                    this.env.render('index.twig', context);

                    test.fail(`${this.getDescription()} should throw an error`);
                } catch (e) {
                    test.same(e.toString(), expectedErrorMessage, `${this.getDescription()} throws error`);
                }
            }

            test.end();
        });
    }
}

/**
 * nl2br which also escapes, for testing escaper filters.
 */
function escape_and_nl2br(env: TwingEnvironment, value: string, sep = '<br />') {
    let result = escape(env, value, 'html');

    return nl2br(result, sep);
}

/**
 * nl2br only, for testing filters with pre_escape.
 */
function nl2br(value: string, sep = '<br />') {
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
