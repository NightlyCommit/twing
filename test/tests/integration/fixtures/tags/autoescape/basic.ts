import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag applies escaping on its children';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape %}
    {{ var }}<br />
{% endautoescape %}
{% autoescape 'html' %}
    {{ var }}<br />
{% endautoescape %}
{% autoescape false %}
    {{ var }}<br />
{% endautoescape %}
{% autoescape false %}
    {{ var }}<br />
{% endautoescape %}`
        };
    }

    getExpected() {
        return `
    &lt;br /&gt;<br />
    &lt;br /&gt;<br />
    <br /><br />
    <br /><br />
`;
    }


    getContext() {
        return {
            'var': '<br />'
        };
    }
}
