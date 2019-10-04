import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports string interpolation';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "foo #{"foo #{bar} baz"} baz" }}
{{ "foo #{bar}#{bar} baz" }}`
        };
    }

    getExpected() {
        return `
foo foo BAR baz baz
foo BARBAR baz
`;
    }

    getContext() {
        return {
            bar: 'BAR'
        }
    }
}
