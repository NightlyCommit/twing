import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing unary operators precedence';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ -1 - 1 }}
{{ -1 - -1 }}
{{ -1 * -1 }}
{{ 4 / -1 * 5 }}`
        };
    }

    getExpected() {
        return `
-2
0
1
-20
`;
    }
}
