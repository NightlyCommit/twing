import TestBase from "../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag iterates over iterable objects';
    }

    getTemplates() {
        return {
            'index.twig': `
{% for item in items %}
  * {{ item }}
  * {{ loop.index }}/{{ loop.index0 }}
  * {{ loop.first }}

{% endfor %}

{% for key, value in items %}
  * {{ key }}/{{ value }}
{% endfor %}

{% for key in items|keys %}
  * {{ key }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
  * bar
  * 1/0
  * 1

  * foo
  * 2/1
  * 


  * foo/bar
  * bar/foo

  * foo
  * bar
`;
    }

    getContext() {
        return {
            items: new Map([
                ['foo', 'bar'],
                ['bar', 'foo']
            ])
        };
    }
}
