import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag adds a loop variable to the context';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for item in items %}
  * {{ loop.index }}/{{ loop.index0 }}
  * {{ loop.revindex }}/{{ loop.revindex0 }}
  * {{ loop.first }}/{{ loop.last }}/{{ loop.length }}

{% endfor %}

{% for item in items_as_object %}
  * {{ loop.index }}/{{ loop.index0 }}
  * {{ loop.revindex }}/{{ loop.revindex0 }}
  * {{ loop.first }}/{{ loop.last }}/{{ loop.length }}

{% endfor %}`
        };
    }

    getExpected() {
        return `
  * 1/0
  * 2/1
  * 1//2

  * 2/1
  * 1/0
  * /1/2


  * 1/0
  * 2/1
  * 1//2

  * 2/1
  * 1/0
  * /1/2
`;
    }


    getContext() {
        return {
            items: [
                'a',
                'b'
            ],
            items_as_object: {
                a: 'a',
                b: 'b'
            }
        };
    }
}
