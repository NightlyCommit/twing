import TestBase from "../../TestBase";

export default class extends TestBase {
    getName() {
        return 'exceptions/child_contents_outside_blocks';
    }

    getDescription() {
        return 'Exception for child templates defining content outside blocks defined by parent';
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends 'base.twig' %}

Content outside a block.

{% block sidebar %}
    Content inside a block.
{% endblock %}`,
            'base.twig': `
{% block sidebar %}
{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: A template that extends another one cannot include content outside Twig blocks. Did you forget to put the content inside a {% block %} tag in "index.twig" at line 3?';
    }
}
