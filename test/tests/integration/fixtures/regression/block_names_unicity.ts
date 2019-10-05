import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Block names are unique per template';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends 'layout' %}
{% block content -%}
    {% filter title -%}
        second
    {% endfilter %}
{% endblock %}`,
            'layout': `
{% filter title -%}
    first
{% endfilter %}
{% block content %}{% endblock %}`
        };
    }

    getExpected() {
        return `
First
Second
`;
    }
}
