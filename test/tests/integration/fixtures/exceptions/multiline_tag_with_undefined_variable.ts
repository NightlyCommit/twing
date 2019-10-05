import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for multiline tag with undefined variable';
    }

    getTemplates() {
        return {
            'index.twig': `
{% include 'foo'
   with vars
%}`,
            'foo': `
Foo`
        };
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `vars` does not exist in "index.twig" at line 3.';
    }
}
