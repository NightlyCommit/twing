import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'unknown macro';
    }

    getTemplates() {
        return {
            'index.twig': `
{% import _self as macros %}

{{ macros.unknown() }}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Macro "unknown" is not defined in template "index.twig" in "index.twig" at line 4.';
    }
}
