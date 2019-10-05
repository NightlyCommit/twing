import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports unary operators (not, -, +)';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ not 1 }}/{{ not 0 }}
{{ +1 + 1 }}/{{ -1 - 1 }}
{{ not (false or true) }}`
        };
    }

    getExpected() {
        return `
/1
2/-2
`;
    }
}
