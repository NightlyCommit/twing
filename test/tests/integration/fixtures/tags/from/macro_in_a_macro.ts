import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"from" tag macro in a macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from _self import another, foo %}

{{ foo() }}

{% macro foo() %}
    {{ another() }}
{% endmacro %}

{% macro another() %}
    OK
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
OK
`;
    }

}
