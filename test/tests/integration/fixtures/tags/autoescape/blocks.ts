import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag applies escaping on embedded blocks';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape 'html' %}
    {% block foo %}
        {{ var }}
    {% endblock %}
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
