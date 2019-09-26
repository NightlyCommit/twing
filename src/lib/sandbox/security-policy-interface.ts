/* istanbul ignore next */

/**
 * Interfaces that all security policy classes must implements.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export interface TwingSandboxSecurityPolicyInterface {
    TwingSandboxSecurityPolicyInterfaceImpl: TwingSandboxSecurityPolicyInterface;

    checkSecurity(tags: string[], filters: string[], functions: string[]): void;

    /**
     * @param {any} obj
     * @param {string} method
     *
     * @throws TwingSandboxSecurityNotAllowedMethodError When the method is not allowed on the passed object
     */
    checkMethodAllowed(obj: any, method: string): void;

    /**
     * @param {any} obj
     * @param {string} property
     *
     * @throws TwingSandboxSecurityNotAllowedPropertyError When the property is not allowed on the passed object
     */
    checkPropertyAllowed(obj: any, property: string): void;
}
