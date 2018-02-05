import TwingSandboxSecurityPolicyInterface from "./sandbox-policy-interface";
import TwingSandboxSecurityNotAllowedFilterError from "./security-not-allowed-filter-error";
import TwingSandboxSecurityNotAllowedTagError from "./security-not-allowed-tag-error";
import TwingSandboxSecurityNotAllowedFunctionError from "./security-not-allowed-function-error";

export class TwingSandboxSecurityPolicy implements TwingSandboxSecurityPolicyInterface {
    private allowedTags: Array<string>;
    private allowedFilters: Array<string>;
    private allowedMethods: Array<Function>;
    private allowedProperties: Array<string>;
    private allowedFunctions: Array<string>;

    constructor(allowedTags: Array<string> = [], allowedFilters: Array<string> = [], allowedMethods: Array<Function> = [], allowedProperties: Array<string> = [], allowedFunctions: Array<string> = []) {
        this.allowedTags = allowedTags;
        this.allowedFilters = allowedFilters;
        this.setAllowedMethods(allowedMethods);
        this.allowedProperties = allowedProperties;
        this.allowedFunctions = allowedFunctions;
    }

    setAllowedMethods(methods: Array<Function>) {
        this.allowedMethods = methods;
    }

    checkSecurity(tags: string[], filters: string[], functions: string[]): void {
        let self = this;

        tags.forEach(function(tag) {
           if (!self.allowedTags.includes(tag)) {
               throw new TwingSandboxSecurityNotAllowedTagError(`Tag "${tag}" is not allowed.`, tag);
           }
        });

        filters.forEach(function(filter) {
            if (!self.allowedFilters.includes(filter)) {
                throw new TwingSandboxSecurityNotAllowedFilterError(`Filter "${filter}" is not allowed.`, filter);
            }
        });

        functions.forEach(function(function_) {
            if (!self.allowedFunctions.includes(function_)) {
                throw new TwingSandboxSecurityNotAllowedFunctionError(`Filter "${function_}" is not allowed.`, function_);
            }
        });
    }

    checkMethodAllowed(method: Function): void {
        // throw new Error("Method not implemented.");
    }

    checkPropertyAllowed(obj: any, method: string): void {
        // throw new Error("Method not implemented.");
    }
}

export default TwingSandboxSecurityPolicy;