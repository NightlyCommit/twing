import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the "divisible by" operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 8 is divisible by(2) ? 'OK' }}
{{ 8 is not divisible by(3) ? 'OK' }}
{{ 8 is    divisible   by   (2) ? 'OK' }}
{{ 8 is not
   divisible
   by
   (3) ? 'OK' }}`
        };
    }

    getExpected() {
        return `
OK
OK
OK
OK
`;
    }
}
