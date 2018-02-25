import {TwingTestIntegrationTestCase} from "../../../../../integration-test-case";

class House {
    readonly REGION_S = 1;
    readonly REGION_P = 2;

    region: number;

    static regionChoices: any = {};

    constructor() {
        House.regionChoices[this.REGION_S] = 'house.region.s';
        House.regionChoices[this.REGION_P] = 'house.region.p';
    }

    getRegionChoices() {
        return House.regionChoices;
    }
}

export = class extends TwingTestIntegrationTestCase {
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