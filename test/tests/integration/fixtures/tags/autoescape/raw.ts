import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag does not escape when raw is used as a filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape 'html' %}
{{ var|raw }}
{% endautoescape %}`
        };
    }

    getExpected() {
        return `
<br />
`;
    }


    getContext() {
        return {
            'var': '<br />'
        };
    }
}
