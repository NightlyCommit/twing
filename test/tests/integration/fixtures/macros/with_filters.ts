import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'macro with a filter\n';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as test %}

{% macro test() %}
    {% filter escape %}foo<br />{% endfilter %}
{% endmacro %}

{{ test.test() }}`
        };
    }

    getExpected() {
        return `
foo&lt;br /&gt;
`;
    }
}
