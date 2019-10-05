import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function with ignore_missing and missing included template in included template';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include("included.twig", ignore_missing = true) }}
NOT DISPLAYED
`,
            'included.twig': `
{{ include("DOES NOT EXIST") }}
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "DOES NOT EXIST" is not defined in "included.twig" at line 2.';
    }
}
