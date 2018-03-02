const TwingCompiler = require("../lib/twing/compiler").TwingCompiler;
const TwingTestEnvironmentStub = require("./environment-stub");
const TwingTestLoaderStub = require("./loader-stub");

module.exports = class extends TwingCompiler {
    constructor(env = null) {
        let loader = new TwingTestLoaderStub();

        super(env ? env : new TwingTestEnvironmentStub(loader));
    }
}
