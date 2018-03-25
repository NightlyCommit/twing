/* istanbul ignore next */

/**
 * Enables usage of the deprecated TwingExtension.initRuntime() method.
 *
 * Explicitly implement this interface if you really need to implement the
 * deprecated initRuntime() method in your extensions.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingEnvironment} from "../environment";

export interface TwingExtensionInitRuntimeInterface {
    TwingExtensionInitRuntimeInterfaceImpl: TwingExtensionInitRuntimeInterface;

    /**
     * Initializes the runtime environment.
     *
     * This is where you can load some file that contains filter functions for instance.
     *
     * @param {TwingEnvironment} environment The active TwingEnvironment instance
     */
    initRuntime(environment: TwingEnvironment): void;
}
