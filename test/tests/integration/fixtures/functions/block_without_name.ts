import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"block" function without arguments';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends 'base.twig' %}
{% block bar %}BAR{% endblock %}`,
            'base.twig': `
{% block foo %}{{ block() }}{% endblock %}
{% block bar %}BAR_BASE{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: The "block" function takes one argument (the block name) in "base.twig" at line 2.';
    }
}
