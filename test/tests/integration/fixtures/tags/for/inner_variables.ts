import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag does not reset inner variables';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for i in 1..2 %}
  {% for j in 0..2 %}
    {{k}}{% set k = k+1 %} {{ loop.parent.loop.index }}
  {% endfor %}
{% endfor %}`
        };
    }

    getExpected() {
        return `
      0 1
      1 1
      2 1
        3 2
      4 2
      5 2
`;
    }


    getContext() {
        return {
            k: 0
        };
    }
}
