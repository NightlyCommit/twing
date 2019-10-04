import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"include" function with assignment';
    }

    getTemplates() {
        return {
            'index.twig': `
{% set tmp = include("foo.twig") %}

FOO{{ tmp }}BAR`,
            'foo.twig': `
FOOBAR`
        };
    }

    getExpected() {
        return `
FOO
FOOBARBAR
`;
    }
}
