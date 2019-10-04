import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"iterable" test';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ foo is iterable ? 'ok' : 'ko' }}
{{ traversable is iterable ? 'ok' : 'ko' }}
{{ obj is iterable ? 'ok' : 'ko' }}
{{ val is iterable ? 'ok' : 'ko' }}`
        };
    }

    getExpected() {
        return `
ok
ok
ko
ko`;
    }

    getContext() {
        let foo: any[] = [];
        let traversable = new Map([[0, []]]);

        return {
            foo: foo,
            traversable: traversable,
            obj: new Object(),
            val: 'test'
        }
    }
}
