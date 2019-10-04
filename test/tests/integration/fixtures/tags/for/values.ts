import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag iterates over item values';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for item in items %}
  * {{ item }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
  * a
  * b
`;
    }


    getContext() {
        return {
            items: [
                'a',
                'b'
            ]
        };
    }
}
