import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Deprecating a block with "deprecated" tag';
    }

    getTemplates() {
        return {
            'index.twig': `{% use 'greeting.twig' %}

{{ block('welcome') }}
`,
            'greeting.twig': `{% block welcome %}
    {% deprecated 'The "welcome" block is deprecated, use "hello" instead.' %}
    {{ block('hello') }}
{% endblock %}

{% block hello %}
    Hello Fabien
{% endblock %}
`
        };
    }

    getExpected() {
        return `    Hello Fabien
`;
    }

    getExpectedDeprecationMessages() {
        return [
            'The "welcome" block is deprecated, use "hello" instead. ("greeting.twig" at line 2)'
        ];
    }
}
