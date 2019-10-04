import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" tag with missing template';
    }

    getTemplates() {
        return {
            'index.twig': `{% include "foo.twig" %}`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorLoader: Template "foo.twig" is not defined in "index.twig" at line 1.';
    }
}
