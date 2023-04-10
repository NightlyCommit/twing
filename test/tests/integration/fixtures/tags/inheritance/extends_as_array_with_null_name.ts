import TestBase from "../../../TestBase";

class Test extends TestBase {
    getTemplates() {
        return {
            'bar.twig': `
{% block content %}
    foo
{% endblock %}`,
            'index.twig': `
{% extends [null, "bar.twig"] %}`
        };
    }

    getExpected() {
        return `
foo
`;
    }

}

export default Test;
