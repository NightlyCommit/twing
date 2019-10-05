import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"with" tag with expression and only';
    }

    getTemplates() {
        return {
            'index.twig': `
{% with {foo: 'foo', bar: 'BAZ'} only %}
    {{ foo }}{{ bar }}{{ baz }}
{% endwith %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `baz` does not exist in "index.twig" at line 3.';
    }

    getContext() {
        return {
            foo: 'baz',
            baz: 'baz'
        }
    }
}
