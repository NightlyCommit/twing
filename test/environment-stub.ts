import TwingEnvironment from "../src/environment";
import TwingTestLoaderStub from "./loader-stub";
import TwingEnvironmentOptions from "../src/environment-options";

class TwingTestEnvironmentStub extends TwingEnvironment {
    constructor(options: TwingEnvironmentOptions = {}) {
        super(new TwingTestLoaderStub(), options);
    }

    getTemplateClass(name: string, index: number = null) {
        return '__TwingTemplate_foo';
    }
}

export default TwingTestEnvironmentStub;