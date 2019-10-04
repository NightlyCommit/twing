import TestBase from "../../TestBase";
import Foo from "../../../../Foo";

export default class extends TestBase {
    getDescription() {
        return '"attribute" function';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ attribute(obj, method) }}
{{ attribute(array, item) }}
{{ attribute(obj, "bar", ["a", "b"]) }}
{{ attribute(obj, "bar", arguments) }}
{{ attribute(obj, method) is defined ? 'ok' : 'ko' }}
{{ attribute(obj, nonmethod) is defined ? 'ok' : 'ko' }}`
        };
    }

    getExpected() {
        return `
foo
bar
bar_a-b
bar_a-b
ok
ko
`;
    }

    getContext() {
        return {
            obj: new Foo(),
            method: 'foo',
            array: {foo: 'bar'},
            item: 'foo',
            nonmethod: 'xxx',
            arguments: ['a', 'b']
        }
    }
}
