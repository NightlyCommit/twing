import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"with" tag with an expression that is not a hash';
    }

    getTemplates() {
        return {
            'index.twig': `
{% with vars %}
    {{ foo }}{{ bar }}
{% endwith %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variables passed to the "with" tag must be a hash in "index.twig" at line 2.';
    }

    getContext() {
        return {
            vars: 'no-hash'
        }
    }
}
