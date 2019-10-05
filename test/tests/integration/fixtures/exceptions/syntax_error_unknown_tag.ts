import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for an unknown tag syntax error';
    }

    getTemplates() {
        return {
            'index.twig': `{% includes "foo.twig" %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorSyntax: Unknown "includes" tag. Did you mean "include" in "index.twig" at line 1?';
    }
}
