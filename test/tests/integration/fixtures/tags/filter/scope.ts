import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"filter" tag creates a new context scope';
    }

    getTemplates() {
        return {
            'index.twig': `
{% filter upper %}
    {% set item = "foo" %}
{% endfilter %}
{{ item }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `item` does not exist in "index.twig" at line 5.';
    }
}
