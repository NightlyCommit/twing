import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"template_from_string" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{% include template_from_string(template) %}

{% include template_from_string("Hello {{ name }}") %}
{% include template_from_string('{% extends "parent.twig" %}{% block content %}Hello {{ name }}{% endblock %}') %}
{# named arguments #}
{% include template_from_string(template = "Hello {{ name }}", name = "index") %}
{% include template_from_string(name = "index", template = "Hello {{ name }}") %}
`,
            'parent.twig': `
{% block content %}{% endblock %}`
        };
    }

    getExpected() {
        return `
Hello Fabien
Hello Fabien
Hello FabienHello FabienHello Fabien
`;
    }

    getContext() {
        return {
            name: 'Fabien',
            template: 'Hello {{ name }}'
        }
    }
}
