import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag takes a condition';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for i in 1..5 if i is odd -%}
    {{ loop.index }}.{{ i }}{{ foo.bar }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
1.1X
2.3X
3.5X
`;
    }


    getContext() {
        return {
            foo: {
                bar: 'X'
            }
        };
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        }
    }

    getExpectedDeprecationMessages() {
        return [
            'Using an "if" condition on "for" tag in "index.twig" at line 2 is deprecated since Twig 2.10.0, use a "filter" filter or an "if" condition inside the "for" body instead (if your condition depends on a variable updated inside the loop).'
        ];
    }
}
