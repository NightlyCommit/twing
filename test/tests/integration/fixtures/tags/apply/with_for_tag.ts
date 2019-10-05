import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"apply" tag applies the filter on "for" tags';
    }

    getTemplates() {
        return {
            'index.twig': `
{% apply upper %}
{% for item in items %}
{{ item }}
{% endfor %}
{% endapply %}`
        };
    }

    getExpected() {
        return `
A
B
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
