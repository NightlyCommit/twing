import TestBase from "../../TestBase";
import Foo from "../../../../Foo";

export default class extends TestBase {
    getDescription() {
        return 'Twing supports the in operator when using objects';
    }

    getTemplates() {
        return {
            'index.twig': `
{% if object in object_list %}
TRUE
{% endif %}`
        };
    }

    getExpected() {
        return `
TRUE
`;
    }

    getContext() {
        let foo = new Foo();
        let foo1 = new Foo();

        return {
            object: foo,
            object_list: [foo1, foo],
        };
    }
}
