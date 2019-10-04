import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports bitwise operations';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 b-and 5 }}
{{ 1 b-or 5 }}
{{ 1 b-xor 5 }}
{{ (1 and 0 b-or 0) is same as(1 and (0 b-or 0)) ? 'ok' : 'ko' }}`
        };
    }

    getExpected() {
        return `
1
5
4
ok
`;
    }
}
