import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"defined* support for macros"';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}
{% from _self import hello, bar %}

{% if macros.hello is defined -%}
    OK
{% endif %}

{% if macros.foo is not defined -%}
    OK
{% endif %}

{% if hello is defined -%}
    OK
{% endif %}

{% if bar is not defined -%}
    OK
{% endif %}

{% if foo is not defined -%}
    OK
{% endif %}

{% macro hello(name) %}
    Hello {{ name }}
{% endmacro %}
`
        };
    }

    getExpected() {
        return `
OK

OK

OK

OK

OK
`;
    }
}
