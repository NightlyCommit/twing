import {TwingEnvironment} from "../src/environment";
import {TwingEnvironmentOptions} from "../src/environment-options";
import {TwingLoaderInterface} from "../src/loader-interface";

export class TwingTestEnvironmentStub extends TwingEnvironment {
    constructor(loader: TwingLoaderInterface, options: TwingEnvironmentOptions = {}) {
        super(loader, options);
    }

    getTemplateClass(name: string, index: number = null) {
        return '__TwingTemplate_foo';
    }
}