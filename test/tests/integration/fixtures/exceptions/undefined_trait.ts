import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for an undefined trait';
    }

    getTemplates() {
        return {
            'index.twig': `
{% use 'foo' with foobar as bar %}`,
            'foo': `
{% block bar %}
{% endblock %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Block `foobar` is not defined in trait `foo` in "index.twig" at line 2.';
    }
}
