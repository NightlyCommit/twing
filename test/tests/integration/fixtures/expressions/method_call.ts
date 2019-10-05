import TestBase from "../../TestBase";
import Foo from "../../../../Foo";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports method calls';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ items.foo.foo }}
{{ items.foo.getFoo() }}
{{ items.foo.bar }}
{{ items.foo['bar'] }}
{{ items.foo.bar('a', 43) }}
{{ items.foo.bar(foo) }}
{{ items.foo.self.foo() }}
{{ items.foo.is }}
{{ items.foo.in }}
{{ items.foo.not }}`
        };
    }

    getExpected() {
        return `
foo
foo
bar

bar_a-43
bar_bar
foo
is
in
not
`;
    }

    getContext() {
        return {
            foo: 'bar',
            items: {
                foo: new Foo(),
                bar: 'foo'
            }
        }
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        }
    }
}
