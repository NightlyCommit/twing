import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag keeps the context safe';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for item in items %}
  {% for item in items %}
    * {{ item }}
  {% endfor %}
  * {{ item }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
      * a
      * b
    * a
      * a
      * b
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
