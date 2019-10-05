import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Exception for multiline array with undefined variable';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set foo = {
   foo: 'foo',
   bar: 'bar',


   foobar: foobar,



   foo2: foo2,
} %}`
        };
    }

    getContext() {
        return {
            foobar: 'foobar'
        }
    }

    getExpectedErrorMessage() {
        return 'TwingErrorRuntime: Variable `foo2` does not exist in "index.twig" at line 11.';
    }
}
