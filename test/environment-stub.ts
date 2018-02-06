import TwingEnvironment from "../src/environment";
import TwingLoaderArray from "../src/loader/array";

class TwingTestEnvironmentStub extends TwingEnvironment {
    constructor() {
        super(new TwingLoaderArray({}));
    }
}

export default TwingTestEnvironmentStub;