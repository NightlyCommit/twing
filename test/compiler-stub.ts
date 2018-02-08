import TwingCompiler from "../src/compiler";
import TwingTestEnvironmentStub from "./environment-stub";

class TwingTestCompilerStub extends TwingCompiler {
    constructor(env: TwingTestEnvironmentStub = null) {
        super(env ? env : new TwingTestEnvironmentStub());
    }
}

export default TwingTestCompilerStub;