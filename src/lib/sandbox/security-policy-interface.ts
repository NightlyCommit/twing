/* istanbul ignore next */

/**
 * Interfaces that all security policy classes must implements.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export interface TwingSandboxSecurityPolicyInterface {
    TwingSandboxSecurityPolicyInterfaceImpl: TwingSandboxSecurityPolicyInterface;

    checkSecurity(tags: Map<string, number>, filters: Map<string, number>, functions: Map<string, number>): void;

    checkMethodAllowed(obj: any, method: string): void;

    /**
     * @param {*} obj
     * @param {string} method
     *
     * @throws TwingSandboxSecurityNotAllowedMethodError When the method is not allowed on the passed object
     */
    checkPropertyAllowed(obj: any, method: string): void;
}
