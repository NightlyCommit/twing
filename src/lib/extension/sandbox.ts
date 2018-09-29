import {TwingExtension} from "../extension";
import {TwingSandboxSecurityPolicyInterface} from "../sandbox/security-policy-interface";
import {TwingTokenParserSandbox} from "../token-parser/sandbox";
import {TwingNodeVisitorSandbox} from "../node-visitor/sandbox";

export class TwingExtensionSandbox extends TwingExtension {
    private sandboxedGlobally: boolean;
    private sandboxed: boolean;
    private policy: TwingSandboxSecurityPolicyInterface;

    constructor(policy: TwingSandboxSecurityPolicyInterface, sandboxed: boolean = false) {
        super();

        this.policy = policy;
        this.sandboxedGlobally = sandboxed;
    }

    getTokenParsers() {
        return [
            new TwingTokenParserSandbox()
        ];
    }

    getNodeVisitors() {
        return [
            new TwingNodeVisitorSandbox()
        ];
    }

    enableSandbox() {
        this.sandboxed = true;
    }

    disableSandbox() {
        this.sandboxed = false;
    }

    isSandboxed() {
        return this.sandboxedGlobally || this.sandboxed;
    }

    isSandboxedGlobally() {
        return this.sandboxedGlobally;
    }

    setSecurityPolicy(policy: TwingSandboxSecurityPolicyInterface) {
        this.policy = policy;
    }

    getSecurityPolicy() {
        return this.policy;
    }

    checkSecurity(tags: Array<string>, filters: Array<string>, functions: Array<string>) {
        if (this.isSandboxed()) {
            this.policy.checkSecurity(tags, filters, functions);
        }
    }

    checkMethodAllowed(obj: any, method: string) {
        if (this.isSandboxed()) {
            this.policy.checkMethodAllowed(obj, method);
        }
    }

    checkPropertyAllowed(obj: any, method: string) {
        if (this.isSandboxed()) {
            this.policy.checkPropertyAllowed(obj, method);
        }
    }

    ensureToStringAllowed(obj: any) {
        if (this.isSandboxed() && typeof obj === 'object') {
            this.policy.checkMethodAllowed(obj, 'toString');
        }

        return obj;
    }
}
