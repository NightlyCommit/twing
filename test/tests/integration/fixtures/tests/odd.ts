import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"odd" test';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 is odd ? 'ok' : 'ko' }}
{{ 2 is odd ? 'ko' : 'ok' }}`
        };
    }

    getExpected() {
        return `
ok
ok`;
    }
}
