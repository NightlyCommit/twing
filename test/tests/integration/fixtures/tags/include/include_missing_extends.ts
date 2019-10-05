import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag with ignore_missing and missing extends in included template';
    }

    getTemplates() {
        return {
            'bad.twig': `
{% extends 'DOES NOT EXIST' %}
`,
            'good.twig': `
NOT DISPLAYED
`,
            'index.twig': `
{% include ['bad.twig', 'good.twig'] ignore missing %}
NOT DISPLAYED
`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "DOES NOT EXIST" is not defined in "bad.twig" at line 2.';
    }
}
