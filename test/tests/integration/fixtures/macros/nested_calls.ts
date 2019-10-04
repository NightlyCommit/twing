import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}

{% macro foo(data) %}
    {{ data }}
{% endmacro %}

{% macro bar() %}
    <br />
{% endmacro %}

{{ macros.foo(macros.bar()) }}`
        };
    }

    getExpected() {
        return `
<br />
`;
    }
}
