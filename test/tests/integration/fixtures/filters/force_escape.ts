import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"escape" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo %}
    foo<br />
{% endset %}

{{ foo|e('html') -}}
{{ foo|e('js') }}
{% autoescape true %}
    {{ foo }}
{% endautoescape %}`
        };
    }

    getExpected() {
        return `
    foo&lt;br /&gt;
\\u0020\\u0020\\u0020\\u0020foo\\u003Cbr\\u0020\\/\\u003E\\n
        foo<br />`;
    }
}
