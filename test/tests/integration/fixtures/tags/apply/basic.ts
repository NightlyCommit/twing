import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"apply" tag applies a filter on its children';
    }

    getTemplates() {
        return {
            'index.twig': `
{% apply upper %}
    Some text with a {{ var }}
{% endapply %}`
        };
    }

    getExpected() {
        return `
SOME TEXT WITH A VAR
`;
    }

    getContext() {
        return {
            var: 'var'
        };
    }
}
