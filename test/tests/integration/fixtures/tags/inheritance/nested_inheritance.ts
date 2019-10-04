import TestBase from "../../../TestBase";

export default class extends TestBase {
    getTemplates() {
        return {
            'base.twig': `
{% block body '' %}`,
            'index.twig': `
{% extends "layout.twig" %}
{% block inside %}INSIDE{% endblock inside %}`,
            'layout.twig': `
{% extends "base.twig" %}
{% block body %}
    {% block inside '' %}
{% endblock body %}`
        };
    }

    getExpected() {
        return `
INSIDE
`;
    }

}
