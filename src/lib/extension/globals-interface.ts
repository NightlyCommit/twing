/* istanbul ignore next */

/**
 * Enables usage of the deprecated TwingExtension.getGlobals() method.
 *
 * Explicitly implement this interface if you really need to implement the
 * deprecated getGlobals() method in your extensions.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export interface TwingExtensionGlobalsInterface {
    TwingExtensionGlobalsInterfaceImpl: TwingExtensionGlobalsInterface;

    /**
     * Returns a list of global variables to add to the existing list.
     *
     * @return {Map} A hash of global variables
     */
    getGlobals(): Map<any, any>;
}
