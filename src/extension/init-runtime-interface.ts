/**
 * Enables usage of the deprecated Twig_Extension::initRuntime() method.
 *
 * Explicitly implement this interface if you really need to implement the
 * deprecated initRuntime() method in your extensions.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
import TwingEnvironment from "../environment";

interface TwingExtensionsInitRuntimeInterface {
    /**
     * Initializes the runtime environment.
     *
     * This is where you can load some file that contains filter functions for instance.
     *
     * @param {TwingEnvironment} environment The active Twig_Environment instance
     */
    initRuntime(environment: TwingEnvironment): void;
}

export default TwingExtensionsInitRuntimeInterface;