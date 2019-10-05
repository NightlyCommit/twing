import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"§" as a macro name';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}

{{ macros.§('foo') }}

{% macro §(foo) %}
  §{{ foo }}§
{% endmacro %}`
        };
    }

    getExpected() {
        return `
§foo§
`;
    }
}
