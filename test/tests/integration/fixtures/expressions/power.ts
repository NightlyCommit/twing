import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing parses power expressions';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 2**3 }}
{{ (-2)**3 }}
{{ (-2)**(-3) }}
{{ a ** a }}
{{ a ** b }}
{{ b ** a }}
{{ b ** b }}`
        };
    }

    getExpected() {
        return `
8
-8
-0.125
256
0.0625
16
0.25
`;
    }

    getContext() {
        return {
            a: 4,
            b: -2
        }
    }
}
