import TwingEnvironment from "../src/environment";
import TwingLoaderArray from "../src/loader/array";
import TwingTestLoaderStub from "./loader-stub";
import TwingEnvironmentOptions from "../src/environment-options";

class TwingTestEnvironmentStub extends TwingEnvironment {
    constructor(options: TwingEnvironmentOptions = {}) {
        super(new TwingTestLoaderStub(), options);
    }
}

export default TwingTestEnvironmentStub;