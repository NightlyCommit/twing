/**
 * Enables usage of the deprecated Twig_Extension::getGlobals() method.
 *
 * Explicitly implement this interface if you really need to implement the
 * deprecated getGlobals() method in your extensions.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export interface TwingExtensionGlobalsInterface {
    implementsTwingExtensionGlobalsInterface: boolean,

    /**
     * Returns a list of global variables to add to the existing list.
     *
     * @return {*} A hash of global variables
     */
    getGlobals(): {};
}
