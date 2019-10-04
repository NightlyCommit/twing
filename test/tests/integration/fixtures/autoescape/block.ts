import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'autoescape + block';
    }

    getTemplates() {
        return {
            'index.twig': `{{ include('template.html.twig') -}}`,
            'unrelated.txt.twig': `
{% block content %}{% endblock %}`,
            'template.html.twig': `{% extends 'parent.html.twig' %}
{% block content %}
{{ br -}}
{% endblock %}`,
            'parent.html.twig': `{% set _content = block('content')|raw %}
{{ _content|raw }}`
        };
    }

    getExpected() {
        return `
&lt;br /&gt;
`;
    }

    getContext() {
        return {
            br: '<br />'
        }
    }
}
