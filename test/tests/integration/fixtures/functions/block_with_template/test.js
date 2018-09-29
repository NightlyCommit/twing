const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getName() {
        return 'functions/block_with_template';
    }

    getDescription() {
        return '"block" function with a template argument';
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
