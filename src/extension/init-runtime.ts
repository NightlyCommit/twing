import {TwingExtensionsInitRuntimeInterface} from "./init-runtime-interface";
import {TwingEnvironment} from "../environment";
import {TwingExtension} from "../extension";

export abstract class TwingExtensionInitRuntime extends TwingExtension implements TwingExtensionsInitRuntimeInterface {
    initRuntime(environment: TwingEnvironment) {
        throw new Error('Method not implemented.');
    }
}
