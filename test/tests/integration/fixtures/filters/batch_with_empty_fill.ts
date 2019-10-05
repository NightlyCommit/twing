import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"batch" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
<table>
{% for row in items|batch(3, '') %}
  <tr>
  {% for column in row %}
    <td>{{ column }}</td>
  {% endfor %}
  </tr>
{% endfor %}
</table>`
        };
    }

    getExpected() {
        return `
<table>
  <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
  <tr>
      <td>d</td>
      <td>e</td>
      <td>f</td>
    </tr>
  <tr>
      <td>g</td>
      <td>h</td>
      <td>i</td>
    </tr>
  <tr>
      <td>j</td>
      <td></td>
      <td></td>
    </tr>
</table>
`;
    }

    getContext() {
        return {
            items: [
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'
            ]
        }
    }
}
