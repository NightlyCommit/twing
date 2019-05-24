/* istanbul ignore next */

/**
 * Interfaces that all security policy classes must implements.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export interface TwingSandboxSecurityPolicyInterface {
    TwingSandboxSecurityPolicyInterfaceImpl: TwingSandboxSecurityPolicyInterface;

    checkSecurity(tags: Map<string, number>, filters: Map<string, number>, functions: Map<string, number>): void;

    checkMethodAllowed(obj: any, method: string): void;

    checkPropertyAllowed(obj: any, method: string): void;
}
