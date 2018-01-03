import TwingEnvironmentOptions from "../environment-options";
import TwingEnvironment = require("../environment");
import TwingFunction from "../function";
import TwingFilter from "../filter";
import TwingFilterEscape = require("../filter/escape");

class TwingTestCaseIntegration {
    protected name: string;
    protected twing: TwingEnvironment;

    constructor(name: string) {
        this.name = name;
    }

    setTwing(twing: TwingEnvironment) {
        this.getFunctions().forEach(function (twingFunction) {
            twing.addFunction(twingFunction);
        });

        this.getFilters().forEach(function (twingFilter) {
            twing.addFilter(twingFilter);
        });

        this.twing = twing;
    }

    getFilters() {
        return [
            // new TwingFilter('§', array($this, '§Filter')),
            new TwingFilter('escape_and_nl2br', this.escape_and_nl2br.bind(this), {'needs_environment': true, 'is_safe': ['html']}),
            new TwingFilter('nl2br', this.nl2br.bind(this), {'pre_escape': 'html', 'is_safe': ['html']}),
            new TwingFilter('escape_something', this.escape_something.bind(this), {'is_safe': ['something']}),
            new TwingFilter('preserves_safety', this.preserves_safety, {'preserves_safety': ['html']}),
            // new TwingFilter('static_call_string', 'TwigTestExtension::staticCall'),
            // new TwingFilter('static_call_array', array('TwigTestExtension', 'staticCall')),
            // new TwingFilter('magic_call', array($this, 'magicCall')),
            // new TwingFilter('magic_call_string', 'TwigTestExtension::magicStaticCall'),
            // new TwingFilter('magic_call_array', array('TwigTestExtension', 'magicStaticCall')),
            // new TwingFilter('*_path', array($this, 'dynamic_path')),
            // new TwingFilter('*_foo_*_bar', array($this, 'dynamic_foo')),
            // new TwingFilter('anon_foo', function ($name) { return '*'.$name.'*'; })
        ]
    }

    getFunctions() {
        return [
            // new TwingFunction('§', this.sectionFunction),
            new TwingFunction('safe_br', this.br, {'is_safe': ['html']}),
            new TwingFunction('unsafe_br', this.br),
            // new TwingFunction('static_call_string', 'TwigTestExtension::staticCall'),
            // new TwingFunction('static_call_array', array('TwigTestExtension', 'staticCall')),
            // new TwingFunction('*_path', array($this, 'dynamic_path')),
            // new TwingFunction('*_foo_*_bar', array($this, 'dynamic_foo')),
            // new TwingFunction('anon_foo', function ($name) { return '*'.$name.'*'; }),
        ];
    }

    br() {
        return '<br />';
    }

    /**
     * nl2br which also escapes, for testing escaper filters.
     */
    escape_and_nl2br(env: TwingEnvironment, value: string, sep: string = '<br />') {
        let filter = new TwingFilterEscape('escape');

        let result = filter.getCallable()(env, value, 'html');

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

    escape_something(value: string) {
        return value.toUpperCase();
    }

    preserves_safety(value: string) {
        return value.toUpperCase();
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

export = TwingTestCaseIntegration;