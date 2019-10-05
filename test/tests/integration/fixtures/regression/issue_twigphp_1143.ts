import TestBase from "../../TestBase";

class House {
    REGION_S: number;
    REGION_P: number;
    region: number;

    static regionChoices: any;

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

export default class extends TestBase {
    getDescription() {
        return 'error in twig extension';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ object.region is not null ? object.regionChoices[object.region] }}`
        };
    }

    getExpected() {
        return `
house.region.s
`;
    }

    getContext() {
        let object = new House();

        object.region = 1;

        return {
            object: object
        }
    }
}
