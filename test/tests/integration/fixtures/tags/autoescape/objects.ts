import TestBase from "../../../TestBase";

class UserForAutoEscapeTest {
    getName() {
        return 'Fabien<br />';
    }

    toString() {
        return 'Fabien<br />';
    }
}

export default class extends TestBase {
    getDescription() {
        return '"autoescape" tag applies escaping to object method calls';
    }

    getTemplates() {
        return {
            'index.twig': `
{% autoescape 'html' %}
{{ user.name }}
{{ user.name|lower }}
{{ user }}
{% endautoescape %}`
        };
    }

    getExpected() {
        return `
Fabien&lt;br /&gt;
fabien&lt;br /&gt;
Fabien&lt;br /&gt;`;
    }


    getContext() {
        return {
            'user': new UserForAutoEscapeTest()
        };
    }
}
