import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"§" custom filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'foo'|§ }}`
        };
    }

    getExpected() {
        return `
§foo§
`;
    }
}
