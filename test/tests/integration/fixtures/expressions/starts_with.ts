import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the "starts with" operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'foo' starts with 'f' ? 'OK' : 'KO' }}
{{ not ('foo' starts with 'oo') ? 'OK' : 'KO' }}
{{ not ('foo' starts with 'foowaytoolong') ? 'OK' : 'KO' }}
{{ 'foo' starts      with 'f' ? 'OK' : 'KO' }}
{{ 'foo' starts
with 'f' ? 'OK' : 'KO' }}
{{ 'foo' starts with '' ? 'OK' : 'KO' }}
{{ '1' starts with true ? 'OK' : 'KO' }}
{{ '' starts with false ? 'OK' : 'KO' }}
{{ 'a' starts with false ? 'OK' : 'KO' }}
{{ false starts with '' ? 'OK' : 'KO' }}`
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
KO
KO
KO
KO
`;
    }
}
