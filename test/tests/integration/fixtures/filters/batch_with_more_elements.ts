import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"batch" filter with more elements';
    }

    getTemplates() {
        return {
            'index.twig': `{% for row in items|batch(3, 'fill') %}
  <div class=row>
  {% for key, column in row %}
    <div class={{ key }}>{{ column }}</div>
  {% endfor %}
  </div>
{% endfor %}`
        };
    }

    getExpected() {
        return `<div class=row>
      <div class=a>a</div>
      <div class=b>b</div>
      <div class=c>c</div>
    </div>
  <div class=row>
      <div class=d>d</div>
      <div class=123>e</div>
      <div class=124>fill</div>
    </div>`;
    }

    getContext() {
        return {
            items: new Map([
                ['a', 'a'],
                ['b', 'b'],
                ['c', 'c'],
                ['d', 'd'],
                ['123', 'e'],
            ])
        }
    }
}
