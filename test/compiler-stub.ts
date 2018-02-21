import TwingCompiler from "../src/compiler";
import TwingTestEnvironmentStub from "./environment-stub";
import TwingTestLoaderStub from "./loader-stub";

class TwingTestCompilerStub extends TwingCompiler {
    constructor(env: TwingTestEnvironmentStub = null) {
        let loader = new TwingTestLoaderStub();

        super(env ? env : new TwingTestEnvironmentStub(loader));
    }
}

export default TwingTestCompilerStub;