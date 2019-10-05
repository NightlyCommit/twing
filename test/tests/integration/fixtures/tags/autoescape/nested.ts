import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tags can be nested at will';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ var }}
{% autoescape 'html' %}
    {{ var }}
    {% autoescape false %}
        {{ var }}
        {% autoescape 'html' %}
            {{ var }}
        {% endautoescape %}
        {{ var }}
    {% endautoescape %}
    {{ var }}
{% endautoescape %}
{{ var }}`
        };
    }

    getExpected() {
        return `
&lt;br /&gt;
    &lt;br /&gt;
            <br />
                    &lt;br /&gt;
                <br />
        &lt;br /&gt;
&lt;br /&gt;
`;
    }


    getContext() {
        return {
            'var': '<br />'
        };
    }
}
