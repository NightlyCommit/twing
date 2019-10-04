import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Super globals as macro arguments';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}

{{ macros.foo('foo') }}

{% macro foo(GET) %}
    {{ GET }}
{% endmacro %}`
        };
    }

    getExpected() {
        return `
foo
`;
    }
}
