import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"import" tag macro in a macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as foo %}

{{ foo.foo() }}

{% macro foo() %}
    {{ foo.another() }}
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
