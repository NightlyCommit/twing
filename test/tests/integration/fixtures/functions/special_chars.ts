import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"§" custom function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ §('foo') }}`
        };
    }

    getExpected() {
        return `
§foo§
`;
    }
}
