import TwingExtension from "../extension";

class TwingExtensionSandbox extends TwingExtension {
    private sandboxedGlobally: boolean;
    private sandboxed: boolean;
    // private policy: TwingSandboxSecurityPolicyInterface;

    // constructor(policy: TwingSandboxSecurityPolicyInterface, sandboxed: boolean = false) {
    //     super();
    //
    //     this->policy = policy;
    //     this->sandboxedGlobally = sandboxed;
    // }

    enableSandbox() {
        this.sandboxed = true;
    }

    disableSandbox() {
        this.sandboxed = false;
    }

    isSandboxed(): boolean {
        return false;
    }
}

export = TwingExtensionSandbox;