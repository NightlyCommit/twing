import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag can iterate over hashes';
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
  * b/1
`;
    }


    getContext() {
        return {
            items: {
                0: 'a',
                b: 1
            }
        };
    }
}
