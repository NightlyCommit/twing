import TwingCompiler from "../src/compiler";
import TwingTestEnvironmentStub from "./environment-stub";

class TwingTestCompilerStub extends TwingCompiler {
    constructor() {
        super(new TwingTestEnvironmentStub());
    }
}

export default TwingTestCompilerStub;