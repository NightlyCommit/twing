const TwingTestIntegrationTestCaseBase = require('../../../../../integration-test-case');

class House {
    constructor() {
        this.REGION_S = 1;
        this.REGION_P = 2;
        this.region = 0;

        House.regionChoices = {};
        House.regionChoices[this.REGION_S] = 'house.region.s';
        House.regionChoices[this.REGION_P] = 'house.region.p';
    }

    getRegionChoices() {
        return House.regionChoices;
    }
}

module.exports = class extends TwingTestIntegrationTestCaseBase {
    getDescription() {
        return 'error in twig extension';
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
        let object = new House();

        object.region = 1;

        return {
            object: object
        }
    }
};
