import TwingCacheInterface = require("./cache-interface");

/**
 *  * Available options:
 *
 *  * debug: When set to true, it automatically set "auto_reload" to true as
 *           well (default to false).
 *
 *  * charset: The charset used by the templates (default to UTF-8).
 *
 *  * base_template_class: The base template class to use for generated
 *                         templates (default to Twig_Template).
 *
 *  * cache: An absolute path where to store the compiled templates,
 *           a Twig_Cache_Interface implementation,
 *           or false to disable compilation cache (default).
 *
 *  * auto_reload: Whether to reload the template if the original source changed.
 *                 If you don't provide the auto_reload option, it will be
 *                 determined automatically based on the debug value.
 *
 *  * strict_variables: Whether to ignore invalid variables in templates
 *                      (default to false).
 *
 *  * autoescape: Whether to enable auto-escaping (default to html):
 *                  * false: disable auto-escaping
 *                  * html, js: set the autoescaping to one of the supported strategies
 *                  * name: set the autoescaping strategy based on the template name extension
 *                  * PHP callback: a PHP callback that returns an escaping strategy based on the template "name"
 *
 *  * optimizations: A flag that indicates which optimizations to apply
 *                   (default to -1 which means that all optimizations are enabled;
 *                   set it to 0 to disable).
 */
interface TwingEnvironmentOptions {
    strict_variables?: boolean;
    base_template_class?: string;
    cache?: TwingCacheInterface;
    autoescape?: string;
    charset?: string;
}

export default TwingEnvironmentOptions;