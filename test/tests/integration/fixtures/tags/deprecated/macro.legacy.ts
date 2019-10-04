import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Deprecating a macro with "deprecated" tag';
    }

    getTemplates() {
        return {
            'index.twig': `{% import 'greeting.twig' as greeting %}

{{ greeting.welcome('Fabien') }}
`,
            'greeting.twig': `{% macro welcome(name) %}
    {% deprecated 'The "welcome" macro is deprecated, use "hello" instead.' %}
    {% import _self as self %}
    {{ self.hello(name) }}
{% endmacro %}

{% macro hello(name) %}
Hello {{ name }}
{% endmacro %}
`
        };
    }

    getExpected() {
        return `    Hello Fabien
`;
    }

    getExpectedDeprecationMessages() {
        return [
            'The "welcome" macro is deprecated, use "hello" instead. ("greeting.twig" at line 2)'
        ];
    }
}
