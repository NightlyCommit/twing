import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"set" tag';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo = 'foo' %}
{% set bar = 'foo<br />' %}

{{ foo }}
{{ bar }}

{% set foo, bar = 'foo', 'bar' %}

{{ foo }}{{ bar }}`
        };
    }

    getExpected() {
        return `
foo
foo&lt;br /&gt;


foobar
`;
    }

}
