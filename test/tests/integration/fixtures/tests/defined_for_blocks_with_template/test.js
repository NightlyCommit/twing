const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

/**
 * Note that the expected result from the original TwigPHP test is incorrect - but for some reason, the test passes successfully on TwigPHP.
 * @see * https://twigfiddle.com/22p2t1
 */
module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return '"defined" support for blocks with a template argument';
    }

    getTemplates() {
        let templates = super.getTemplates();

        templates.set('index.twig', require('./index.twig'));
        templates.set('included.twig', require('./included.twig'));

        return templates;
    }

    getExpected() {
        return require('./expected.html');
    }

    getData() {
        return {
            included_loaded: this.twing.load('included.twig'),
            included_loaded_internal: this.twing.loadTemplate('included.twig')
        }
    }
};
