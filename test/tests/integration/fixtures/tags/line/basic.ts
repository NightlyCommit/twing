import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"line" tag is supported';
    }

    getTemplates() {
        return {
            'index.twig': `
{% line 5 %}
{{ unknown }}
`
        };
    }

    getExpectedErrorMessage(): string {
        return 'TwingErrorRuntime: Variable `unknown` does not exist in "index.twig" at line 6.';
    }
}
