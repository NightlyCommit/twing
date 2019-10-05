import {TwingEnvironment} from "../../src/lib/environment";
import {TwingCompiler} from "../../src/lib/compiler";
import {MockLoader} from "./loader";
import {MockEnvironment} from "./environment";

export class MockCompiler extends TwingCompiler {
    constructor(env: TwingEnvironment = null) {
        let loader = new MockLoader();

        super(env ? env : new MockEnvironment(loader));
    }
}
