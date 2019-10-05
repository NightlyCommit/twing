import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"apply" tag applies the filter on "if" tags';
    }

    getTemplates() {
        return {
            'index.twig': `
{% apply upper %}
{% if items %}
{{ items|join(', ') }}
{% endif %}

{% if items.3 is defined %}
FOO
{% else %}
{{ items.1 }}
{% endif %}

{% if items.3 is defined %}
FOO
{% elseif items.1 %}
{{ items.0 }}
{% endif %}

{% endapply %}`
        };
    }

    getExpected() {
        return `
A, B

B

A
`;
    }

    getContext() {
        return {
            items: [
                'a',
                'b'
            ]
        }
    }
}
