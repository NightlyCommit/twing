import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"filter" tag applies the filter on "if" tags';
    }

    getTemplates() {
        return {
            'index.twig': `
{% filter upper %}
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

{% endfilter %}`
        };
    }

    getExpected() {
        return `
A, B

B

A
`;
    }


    getExpectedDeprecationMessages() {
        return [
            'The "filter" tag in "index.twig" at line 2 is deprecated since Twig 2.9, use the "apply" tag instead.'
        ];
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
