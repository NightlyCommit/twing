/**
 * Interfaces that all security policy classes must implements.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
interface TwingSandboxSecurityPolicyInterface {
    checkSecurity(tags: Array<string>, filters: Array<string>, functions: Array<string>): void;

    checkMethodAllowed(method: Function): void;

    checkPropertyAllowed(obj: any, method: string): void;
}

export default TwingSandboxSecurityPolicyInterface