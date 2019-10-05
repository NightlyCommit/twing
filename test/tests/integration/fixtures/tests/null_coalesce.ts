import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"??" operator';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 'OK' ?? 'KO' }}
{{ null ?? 'OK' }}
{{ bar ?? 'KO' }}
{{ baz ?? 'OK' }}
{{ foo.bar ?? 'KO' }}
{{ foo.missing ?? 'OK' }}
{{ foo.bar.baz.missing ?? 'OK' }}
{{ foo['bar'] ?? 'KO' }}
{{ foo['missing'] ?? 'OK' }}
{{ nope ?? nada ?? 'OK' }}
{{ 1 + nope ?? nada ?? 2 }}
{{ 1 + nope ?? 3 + nada ?? 2 }}`
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
OK
OK
OK
OK
3
6
`;
    }

    getContext() {
        return {
            bar: 'OK',
            foo: new Map([['bar', 'OK']])
        }
    }
}
