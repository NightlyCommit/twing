import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"column" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ array|column('foo')|join }}
{{ traversable|column('foo')|join }}
`
        };
    }

    getExpected() {
        return `
barfoo
barfoo
`;
    }

    getContext() {
        return {
            array: [
                {
                    bar: 'foo',
                    foo: 'bar'
                },
                {
                    foo: 'foo',
                    bar: 'bar'
                }
            ],
            traversable: new Map([
                [0, new Map([
                    ['bar', 'foo'],
                    ['foo', 'bar']
                ])],
                [1, new Map([
                    ['foo', 'foo'],
                    ['bar', 'bar']
                ])],
            ])
        }
    }
}
