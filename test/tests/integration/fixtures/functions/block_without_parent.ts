import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"block" calling parent() with no definition in parent template';
    }

    getEnvironmentOptions(): any {
        return {
            cache: 'tmp/bbb'
        };
    }

    getTemplates() {
        return {
            'index.twig': `
{% extends "parent.twig" %}
{% block label %}{{ parent() }}{% endblock %}`,
            'parent.twig': `
{{ block('label') }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Block "label" should not call parent() in "index.twig" as the block does not exist in the parent template "parent.twig" in "index.twig" at line 3.';
    }
}
