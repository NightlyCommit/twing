import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the "ends with" operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'foo' ends with 'o' ? 'OK' : 'KO' }}
{{ not ('foo' ends with 'f') ? 'OK' : 'KO' }}
{{ not ('foo' ends with 'foowaytoolong') ? 'OK' : 'KO' }}
{{ 'foo' ends with '' ? 'OK' : 'KO' }}
{{ '1' ends with true ? 'OK' : 'KO' }}
{{ 1 ends with true ? 'OK' : 'KO' }}
{{ 0 ends with false ? 'OK' : 'KO' }}
{{ '' ends with false ? 'OK' : 'KO' }}
{{ false ends with false ? 'OK' : 'KO' }}
{{ false ends with '' ? 'OK' : 'KO' }}`
        };
    }

    getExpected() {
        return `
OK
OK
OK
OK
KO
KO
KO
KO
KO
KO
`;
    }
}
