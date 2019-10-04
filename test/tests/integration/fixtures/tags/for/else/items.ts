import TestBase from "../../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag can use an "else" clause';
    }

    getTemplates() {
        return {
            'index.twig': `{% for item in items %}
  * {{ item }}
{% else %}
  no item
{% endfor %}
`
        }
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        }
    }

    getContext() {
        return {
            items: [
                'a',
                'b'
            ]
        };
    }

    getExpected() {
        return `
  * a
  * b`;
    }

}
