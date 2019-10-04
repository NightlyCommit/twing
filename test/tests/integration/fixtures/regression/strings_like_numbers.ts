import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing does not confuse strings with integers in getAttribute()';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ hash['2e2'] }}`
        };
    }

    getExpected() {
        return `
works
`;
    }

    getContext() {
        return {
            hash: {'2e2': 'works'}
        }
    }
}
