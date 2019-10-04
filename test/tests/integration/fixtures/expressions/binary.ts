import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports binary operations (+, -, *, /, ~, %, and, or)';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ 1 + 1 }}
{{ 2 - 1 }}
{{ 2 * 2 }}
{{ 2 / 2 }}
{{ 3 % 2 }}
{{ 1 and 1 }}
{{ 1 and 0 }}
{{ 0 and 1 }}
{{ 0 and 0 }}
{{ 1 or 1 }}
{{ 1 or 0 }}
{{ 0 or 1 }}
{{ 0 or 0 }}
{{ 0 or 1 and 0 }}
{{ 1 or 0 and 1 }}
{{ "foo" ~ "bar" }}
{{ foo ~ "bar" }}
{{ "foo" ~ bar }}
{{ foo ~ bar }}
{{ 20 // 7 }}`
        };
    }

    getExpected() {
        return `
2
1
4
1
1
1



1
1
1


1
foobar
barbar
foofoo
barfoo
2
`;
    }

    getContext() {
        return {
            foo: 'bar',
            bar: 'foo'
        }
    }
}
