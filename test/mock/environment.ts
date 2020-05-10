import {TwingSource} from "../../src/lib/source";
import {TwingEnvironmentNode} from "../../src/lib/environment/node";
import {TwingLoaderInterface} from "../../src/lib/loader-interface";
import {TwingEnvironmentOptions} from "../../src/lib/environment-options";
import {TwingLoaderNull} from "../../src/lib/loader/null";

export class MockEnvironment extends TwingEnvironmentNode {
    constructor(loader?: TwingLoaderInterface, options: TwingEnvironmentOptions = null) {
        super(loader || new TwingLoaderNull(), options);
    }

    getTemplateHash(name: string, index: number = 0, from: TwingSource = null) {
        return Promise.resolve(`__TwingTemplate_foo${(index === 0 ? '' : '_' + index)}`);
    }
}
