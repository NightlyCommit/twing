import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag does not double-escape';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape 'html' %}
    {{ var|escape }}
{% endautoescape %}`
        };
    }

    getExpected() {
        return `
&lt;br /&gt;
`;
    }


    getContext() {
        return {
            'var': '<br />'
        };
    }
}
