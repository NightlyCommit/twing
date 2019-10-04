import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function';
    }

    getTemplates() {
        return {
            'index.twig': `
FOO
{{ include("foo.twig") }}

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
}
