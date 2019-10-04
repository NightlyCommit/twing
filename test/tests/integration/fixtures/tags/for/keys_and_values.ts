import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag can iterate over keys and values';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for key, item in items %}
  * {{ key }}/{{ item }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
  * 0/a
  * 1/b
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
