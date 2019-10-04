import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'The === strict comparison operator is not supported';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 === 2 }}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unexpected operator of value "=". Did you try to use "===" or "!==" for strict comparison? Use "is same as(value)" instead in "index.twig" at line 2.';
    }
}
