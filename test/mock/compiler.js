const {TwingCompiler} = require("../../dist/cjs/main");
const TwingTestMockEnvironment = require("./environment");
const TwingTestMockLoader = require("./loader");

module.exports = class extends TwingCompiler {
    constructor(env = null) {
        let loader = new TwingTestMockLoader();

        super(env ? env : new TwingTestMockEnvironment(loader));
    }
};
