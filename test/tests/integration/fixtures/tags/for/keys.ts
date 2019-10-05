import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag can iterate over keys';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for key in items|keys %}
  * {{ key }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
  * 0
  * 1
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
