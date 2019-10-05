import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macros in parent';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from "macros" import hello %}

{{ hello() }}
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
