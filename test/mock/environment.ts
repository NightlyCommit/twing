import {TwingSource} from "../../src/lib/source";
import {TwingEnvironmentNode} from "../../src/lib/environment/node";

export class MockEnvironment extends TwingEnvironmentNode {
    getTemplateHash(name: string, index: number = 0, from: TwingSource = null) {
        return Promise.resolve(`__TwingTemplate_foo${(index === 0 ? '' : '_' + index)}`);
    }
}
