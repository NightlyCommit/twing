import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag macros in parent';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import "macros" as m %}

{{ m.hello() }}
`,
            'macros': `
{% extends "parent" %}
`,
            'parent': `
{% macro hello() %}
    Test
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
Test
`;
    }

}
