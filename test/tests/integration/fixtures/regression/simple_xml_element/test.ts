import TwingTestIntegrationTestCase from "../../../../../integration-test-case";

/**
 * Let's fake a SimpleXMLElement instance.
 */
class SimpleXMLElement {
    private image: any;

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

    children() {
        return {
            image: {
                count: function() {
                    return 2;
                }
            }
        }
    }

    [Symbol.iterator] = function* () {
        yield {
            group: 'foo'
        };
        yield {
            group: 'bar'
        };
    }
}

export = class extends TwingTestIntegrationTestCase {
    getDescription() {
        return 'Twig is able to deal with SimpleXMLElement instances as variables';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            images: new SimpleXMLElement('<images><image><group myattr="example">foo</group></image><image><group>bar</group></image></images>')
        }
    }
};