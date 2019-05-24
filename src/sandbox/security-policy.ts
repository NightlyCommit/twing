import {TwingSandboxSecurityPolicyInterface} from "./security-policy-interface";
import {TwingSandboxSecurityNotAllowedFilterError} from "./security-not-allowed-filter-error";
import {TwingSandboxSecurityNotAllowedTagError} from "./security-not-allowed-tag-error";
import {TwingSandboxSecurityNotAllowedFunctionError} from "./security-not-allowed-function-error";
import {TwingSandboxSecurityNotAllowedPropertyError} from "./security-not-allowed-property-error";
import {TwingSandboxSecurityNotAllowedMethodError} from "./security-not-allowed-method-error";
import {TwingTemplate} from "../template";
import {TwingMarkup} from "../markup";

export class TwingSandboxSecurityPolicy implements TwingSandboxSecurityPolicyInterface {
    TwingSandboxSecurityPolicyInterfaceImpl: TwingSandboxSecurityPolicyInterface;

    private allowedTags: Array<string>;
    private allowedFilters: Array<string>;
    private allowedMethods: Map<ObjectConstructor, Array<string>>;
    private allowedProperties: Map<ObjectConstructor, string>;
    private allowedFunctions: Array<string>;

    constructor(allowedTags: Array<string> = [], allowedFilters: Array<string> = [], allowedMethods: Map<any, string> = new Map(), allowedProperties: Map<any, string> = new Map(), allowedFunctions: Array<string> = []) {
        this.TwingSandboxSecurityPolicyInterfaceImpl = this;
        this.allowedTags = allowedTags;
        this.allowedFilters = allowedFilters;
        this.setAllowedMethods(allowedMethods);
        this.allowedProperties = allowedProperties;
        this.allowedFunctions = allowedFunctions;
    }

    setAllowedTags(tags: Array<string>) {
        this.allowedTags = tags;
    }

    setAllowedFilters(filters: Array<string>) {
        this.allowedFilters = filters;
    }

    setAllowedMethods(methods: Map<any, string | Array<string>>) {
        this.allowedMethods = new Map();
        for (let [class_, m] of methods) {
            this.allowedMethods.set(class_, (Array.isArray(m) ? m : [m]).map(function (item) {
                return item.toLowerCase();
            }));
        }
    }

    setAllowedProperties(properties: Map<any, string>) {
        this.allowedProperties = properties;
    }

    setAllowedFunctions(functions: Array<string>) {
        this.allowedFunctions = functions;
    }

    checkSecurity(tags: Map<string, number>, filters: Map<string, number>, functions: Map<string, number>): void {
        let self = this;

        for (let [tag, line] of tags) {
            if (!self.allowedTags.includes(tag)) {
                throw new TwingSandboxSecurityNotAllowedTagError(`Tag "${tag}" is not allowed.`, tag, line);
            }
        }

        for (let [filter, line] of filters) {
            if (!self.allowedFilters.includes(filter)) {
                throw new TwingSandboxSecurityNotAllowedFilterError(`Filter "${filter}" is not allowed.`, filter, line);
            }
        }

        for (let [function_, line] of functions) {
            if (!self.allowedFunctions.includes(function_)) {
                throw new TwingSandboxSecurityNotAllowedFunctionError(`Filter "${function_}" is not allowed.`, function_, line);
            }
        }
    }

    checkMethodAllowed(obj: any, method: string): void {
        if (obj instanceof TwingTemplate || obj instanceof TwingMarkup) {
            return;
        }

        let allowed = false;
        method = method.toLowerCase();
        for (let [class_, methods] of this.allowedMethods) {
            if (obj instanceof class_) {
                allowed = methods.includes(method);

                break;
            }
        }

        if (!allowed) {
            let class_ = obj.constructor.name;
            throw new TwingSandboxSecurityNotAllowedMethodError(`Calling "${method}" method on a "${class_}" object is not allowed.`, class_, method, -1);
        }
    }

    checkPropertyAllowed(obj: any, property: string): void {
        let allowed = false;
        for (let [class_, properties] of this.allowedProperties) {
            if (obj instanceof class_) {
                allowed = (Array.isArray(properties) ? properties : [properties]).includes(property);

                break;
            }
        }

        if (!allowed) {
            let class_ = obj.constructor.name;
            throw new TwingSandboxSecurityNotAllowedPropertyError(`Calling "${property}" property on a "${class_}" object is not allowed.`, class_, property, 1);
        }
    }
}
