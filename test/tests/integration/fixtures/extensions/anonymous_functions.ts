import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'use an anonymous function as a function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ anon_foo('bar') }}
{{ 'bar'|anon_foo }}`
        };
    }

    getExpected() {
        return `
*bar*
*bar*
`;
    }
}
