import TestBase from "../../../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"for" tag can use an "else" clause with empty items';
    }

    getTemplates() {
        return {
            'index.twig': `{% for item in items %}
    * {{ item }}
{% else %}
    no item
{% endfor %}`
        }
    }

    getEnvironmentOptions() {
        return {
            strict_variables: false
        }
    }

    getContext() {
        let items: any[] = [];

        return {
            items: items
        };
    }

    getExpected() {
        return `
  no item`;
    }

}
