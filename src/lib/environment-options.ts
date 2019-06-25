import {TwingCacheInterface} from "./cache-interface";
import {TwingSandboxSecurityPolicyInterface} from "./sandbox/security-policy-interface";

/**
 *  * debug: When set to true, it automatically set "auto_reload" to true as well (default to false).
 *  * charset: The charset used by the templates (default to UTF-8).
 *  * cache: An absolute path where to store the compiled templates, a TwingCacheInterface implementation, or false to disable compilation cache (default).
 *  * auto_reload: Whether to reload the template if the original source changed. If you don't provide the auto_reload option, it will be determined automatically based on the debug value.
 *  * strict_variables: Whether to ignore invalid variables in templates (default to false).
 *  * autoescape: Whether to enable auto-escaping (default to html):
 *    * false: disable auto-escaping
 *    * html, js: set the autoescaping to one of the supported strategies
 *    * name: set the autoescaping strategy based on the template name extension
 *    * callback: a callback that returns an escaping strategy based on the template "name"
 */
export type TwingEnvironmentOptions = {
    debug?: boolean;
    base_template_class: string,
    charset?: string;
    cache?: TwingCacheInterface | false | string;
    auto_reload?: boolean;
    strict_variables?: boolean;
    autoescape?: string | boolean | Function;
    source_map?: boolean | string;
    sandbox_policy?: TwingSandboxSecurityPolicyInterface;
    sandboxed?: boolean
}
