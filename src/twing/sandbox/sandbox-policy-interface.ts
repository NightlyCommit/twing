/**
 * Interfaces that all security policy classes must implements.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export interface TwingSandboxSecurityPolicyInterface {
    checkSecurity(tags: Array<string>, filters: Array<string>, functions: Array<string>): void;

    checkMethodAllowed(obj: any, method: string): void;

    checkPropertyAllowed(obj: any, method: string): void;
}
