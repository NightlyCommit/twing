import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

class SplFileInfo {
    constructor(dirname: string) {

    }
}

// opendir returns a pointer in PHP
let opendir = function (dirname: string) {
    return {};
};

export = class extends TwingTestIntegrationTestCase {
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
            resource: opendir(__dirname)
        }
    }
};
