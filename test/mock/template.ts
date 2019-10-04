import {TwingEnvironment} from "../../src/lib/environment";
import {MockEnvironment} from "./environment";
import {TwingTemplate} from "../../src/lib/template";
import {MockLoader} from "./loader";

export class MockTemplate extends TwingTemplate {
    constructor(env: TwingEnvironment) {
        if (!env) {
            env = new MockEnvironment(new MockLoader());
        }

        super(env);
    }

    getTemplateName() {
        return 'foo.html.twig';
    }

    doDisplay(context: {}, blocks: Map<string, Array<any>>): void {
    }
}
