import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the "same as" operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 is same as(1) ? 'OK' }}
{{ 1 is not same as(true) ? 'OK' }}
{{ 1 is same as(1) ? 'OK' }}
{{ 1 is not same as(true) ? 'OK' }}
{{ 1 is   same    as   (1) ? 'OK' }}
{{ 1 is not
    same
    as
    (true) ? 'OK' }}`
        };
    }

    getExpected() {
        return `
OK
OK
OK
OK
OK
OK
`;
    }
}
