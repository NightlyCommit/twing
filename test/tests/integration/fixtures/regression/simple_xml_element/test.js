const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

/**
 * Let's fake a SimpleXMLElement instance.
 */
class SimpleXMLElement {
    constructor(xml) {
        this[Symbol.iterator] = function* () {
            yield {
                group: 'foo'
            };
            yield {
                group: 'bar'
            };
        };

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
                count: function () {
                    return 2;
                }
            }
        }
    }
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
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
