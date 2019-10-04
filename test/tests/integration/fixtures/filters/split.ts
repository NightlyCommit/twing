import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"split" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "one,two,three,four,five"|split(',')|join('-') }}
{{ foo|split(',')|join('-') }}
{{ foo|split(',', 3)|join('-') }}
{{ baz|split('')|join('-') }}
{{ baz|split('', 1)|join('-') }}
{{ baz|split('', 2)|join('-') }}
{{ foo|split(',', -2)|join('-') }}`
        };
    }

    getExpected() {
        return `
one-two-three-four-five
one-two-three-four-five
one-two-three,four,five
1-2-3-4-5
1-2-3-4-5
12-34-5
one-two-three`;
    }

    getContext() {
        return {
            foo: 'one,two,three,four,five',
            baz: '12345'
        }
    }
}
