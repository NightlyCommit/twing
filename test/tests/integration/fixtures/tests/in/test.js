const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');
const {TwingMarkup} = require("../../../../../../dist/cjs/lib/markup");

class SplFileInfo {
    constructor(dirname) {

    }
}

// opendir returns a pointer in PHP
let opendir = function (dirname) {
    return {};
};

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'Twig supports the in operator';
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
            bar: 'bar',
            foo: {bar: 'bar'},
            dir_object: new SplFileInfo(__dirname),
            object: {},
            resource: opendir(__dirname),
            safe: new TwingMarkup('foo', 'UTF-8')
        }
    }
};
