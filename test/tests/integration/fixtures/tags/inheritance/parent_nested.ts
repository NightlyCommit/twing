import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'foo.twig': `
{% block content %}
    BAR
{% endblock %}`,
            'index.twig': `
{% extends "foo.twig" %}

{% block content %}
    {% block inside %}
        INSIDE OVERRIDDEN
    {% endblock %}

    BEFORE
    {{ parent() }}
    AFTER
{% endblock %}`
        };
    }

    getExpected() {
        return `

INSIDE OVERRIDDEN
    
    BEFORE
        BAR

    AFTER
`;
    }
}
