import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for multiline function with undefined variable';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ include('foo',
   with_context=with_context
) }}`,
            'foo': `
Foo`
        };
    }

    getContext() {
        return {
            foobar: 'foobar'
        }
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `with_context` does not exist in "index.twig" at line 3.';
    }
}
