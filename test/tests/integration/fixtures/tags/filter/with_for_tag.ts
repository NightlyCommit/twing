import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"filter" tag applies the filter on "for" tags';
    }

    getTemplates() {
        return {
            'index.twig': `
{% filter upper %}
{% for item in items %}
{{ item }}
{% endfor %}
{% endfilter %}`
        };
    }

    getExpected() {
        return `
A
B
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
