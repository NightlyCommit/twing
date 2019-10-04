import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"even" test';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 is even ? 'ko' : 'ok' }}
{{ 2 is even ? 'ok' : 'ko' }}
{{ 1 is not even ? 'ok' : 'ko' }}
{{ 2 is not even ? 'ko' : 'ok' }}`
        };
    }

    getExpected() {
        return `
ok
ok
ok
ok
`;
    }
}
