/* istanbul ignore next */

/**
 * Creates runtime implementations for Twing elements (filters/functions/tests).
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export interface TwingRuntimeLoaderInterface {
    TwingRuntimeLoaderInterfaceImpl: TwingRuntimeLoaderInterface;

    /**
     * Creates the runtime implementation of a Twing element (filter/function/test).
     *
     * @param {string} class_ A runtime class
     *
     * @return {{}|null} The runtime instance or null if the loader does not know how to create the runtime for this class
     */
    load(class_: string): any | null;
}
