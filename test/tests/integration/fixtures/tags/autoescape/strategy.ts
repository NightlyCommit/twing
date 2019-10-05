import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag accepts an escaping strategy';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape 'js' %}{{ var }}{% endautoescape %}

{% autoescape 'html' %}{{ var }}{% endautoescape %}`
        };
    }

    getExpected() {
        return `
\\u003Cbr\\u0020\\/\\u003E\\u0022
&lt;br /&gt;&quot;
`;
    }


    getContext() {
        return {
            'var': '<br />"'
        };
    }
}
