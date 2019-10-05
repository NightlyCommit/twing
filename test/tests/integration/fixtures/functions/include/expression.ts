import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function allows expressions for the template to include';
    }

    getTemplates() {
        return {
            'index.twig': `
FOO
{{ include(foo) }}

BAR`,
            'foo.twig': `
FOOBAR`
        };
    }

    getExpected() {
        return `
FOO

FOOBAR

BAR
`;
    }

    getContext() {
        return {
            foo: 'foo.twig'
        }
    }
}
