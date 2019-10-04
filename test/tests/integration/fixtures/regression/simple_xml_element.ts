import TestBase from "../../TestBase";

/**
 * Let's fake a SimpleXMLElement instance.
 */
class SimpleXMLElement {
    image: any;

    constructor(xml: string) {
        this.image = {
            0: {
                group: {
                    toString: function () {
                        return 'foo'
                    },
                    attributes: {
                        myattr: 'example'
                    }
                }
            }
        }
    }

    * [Symbol.iterator]() {
        yield {
            group: 'foo'
        };
        yield {
            group: 'bar'
        };
    }

    children() {
        return {
            image: {
                count: function () {
                    return 2;
                }
            }
        }
    }
}

export default class extends TestBase {
    getDescription() {
        return 'Twig is able to deal with SimpleXMLElement instances as variables';
    }

    getTemplates() {
        return {
            'index.twig': `
Hello '{{ images.image.0.group }}'!
{{ images.image.0.group.attributes.myattr }}
{{ images.children().image.count() }}
{% for image in images %}
    - {{ image.group }}
{% endfor %}`
        };
    }

    getExpected() {
        return `
Hello 'foo'!
example
2
    - foo
    - bar
`;
    }

    getContext() {
        return {
            images: new SimpleXMLElement('<images><image><group myattr="example">foo</group></image><image><group>bar</group></image></images>')
        }
    }
}
