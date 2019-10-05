import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception with bad line number';
    }

    getTemplates() {
        return {
            'index.twig': `
{% block content %}
    {{ foo }}
    {{ include("foo") }}
{% endblock %}
index`,
            'foo': `
foo
{{ foo.bar }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Impossible to access an attribute ("bar") on a string variable ("foo") in "foo" at line 3.';
    }

    getContext() {
        return {
            foo: 'foo'
        }
    }
}
