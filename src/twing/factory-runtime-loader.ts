import {TwingRuntimeLoaderInterface} from "./runtime-loader-interface";

/**
 * Lazy loads the runtime implementations for a Twig element.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingFactoryRuntimeLoader implements TwingRuntimeLoaderInterface {
    private map: Map<string, Function>;

    constructor(map: Map<string, Function> = new Map()) {
        this.map = map;
    }

    load(class_: string): any | null {
       if (this.map.has(class_)) {
           let runtimeFactory = this.map.get(class_);

           return runtimeFactory();
       }
    }
}
