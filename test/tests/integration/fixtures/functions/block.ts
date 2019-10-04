import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"block" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends 'base.twig' %}
{% block bar %}BAR{% endblock %}`,
            'base.twig': `
{% block foo %}{{ block('bar') }}{% endblock %}
{% block bar %}BAR_BASE{% endblock %}`
        };
    }

    getExpected() {
        return `
BARBAR
`;
    }
}
