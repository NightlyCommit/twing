import TwingEnvironment from "../src/environment";
import TwingTestLoaderStub from "./loader-stub";
import TwingEnvironmentOptions from "../src/environment-options";
import TwingLoaderInterface from "../src/loader-interface";

class TwingTestEnvironmentStub extends TwingEnvironment {
    constructor(loader: TwingLoaderInterface, options: TwingEnvironmentOptions = {}) {
        super(loader, options);
    }

    getTemplateClass(name: string, index: number = null) {
        return '__TwingTemplate_foo';
    }
}

export default TwingTestEnvironmentStub;