import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing manages negative numbers correctly';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ -1 }}
{{ - 1 }}
{{ 5 - 1 }}
{{ 5-1 }}
{{ 5 + -1 }}
{{ 5 + - 1 }}`
        };
    }

    getExpected() {
        return `
-1
-1
4
4
4
4
`;
    }
}
