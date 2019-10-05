import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"extends" tag';
    }

    getTemplates() {
        return {
            'foo.twig': `
{% block content %}{% endblock %}`,
            'index.twig': `
{% extends "foo.twig" %}

{% block content %}
    FOO
{% endblock %}`
        };
    }

    getExpected() {
        return `
FOO`;
    }

}
