import {TwingExtensionsInitRuntimeInterface} from "./init-runtime-interface";
import {TwingEnvironment} from "../environment";
import {TwingExtension} from "../extension";

export abstract class TwingExtensionInitRuntime extends TwingExtension implements TwingExtensionsInitRuntimeInterface {
    abstract initRuntime(environment: TwingEnvironment): void;
}
