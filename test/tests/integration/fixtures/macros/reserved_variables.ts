import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% from _self import test %}

{% macro test(this) -%}
    {{ this }}
{%- endmacro %}

{{ test(this) }}`
        };
    }

    getExpected() {
        return `
foo
`;
    }

    getContext() {
        return {
            'this': 'foo'
        }
    }
}
