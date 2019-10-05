import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports method calls';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ items.foo }}
{{ items['foo'] }}
{{ items[foo] }}
{{ items[items[foo]] }}`
        };
    }

    getExpected() {
        return `
bar
bar
foo
bar
`;
    }

    getContext() {
        return {
            foo: 'bar',
            items: {
                foo: 'bar',
                bar: 'foo'
            }
        }
    }
}
