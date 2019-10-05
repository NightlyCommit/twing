import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"filter" tag applies a filter on its children';
    }

    getTemplates() {
        return {
            'index.twig': `
{% filter upper %}
    Some text with a {{ var }}
{% endfilter %}`
        };
    }

    getExpected() {
        return `
SOME TEXT WITH A VAR
`;
    }


    getExpectedDeprecationMessages() {
        return [
            'The "filter" tag in "index.twig" at line 2 is deprecated since Twig 2.9, use the "apply" tag instead.'
        ];
    }

    getContext() {
        return {
            var: 'var'
        };
    }
}
