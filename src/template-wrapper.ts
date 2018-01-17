/**
 * Exposes a template to userland.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import TwingEnvironment from "./environment";
import TwingTemplate from "./template";
import TwingMap from "./map";
import TwingSource from "./source";

class TwingTemplateWrapper {
    private env: TwingEnvironment;
    private template: TwingTemplate;

    /**
     * This method is for internal use only and should never be called
     * directly (use TwingEnvironment::load() instead).
     *
     * @internal
     */
    constructor(env: TwingEnvironment, template: TwingTemplate) {
        this.env = env;
        this.template = template;
    }

    /**
     * Renders the template.
     *
     * @param context An hash of parameters to pass to the template
     *
     * @returns {string} The rendered template
     */
    render(context: any = {}) {
        return this.template.render(context);
    }

    /**
     * Checks if a block is defined.
     *
     * @param {string} name    The block name
     * @param context           A hash of parameters to pass to the template
     *
     * @returns {boolean}
     */
    hasBlock(name: string, context: any = {}) {
        return this.template.hasBlock(name, context);
    }

    /**
     * Returns defined block names in the template.
     *
     * @param context A hash of parameters to pass to the template
     *
     * @returns {Array<string>} An array of defined template block names
     */
    getBlockNames(context: any = {}) {
        return this.template.getBlockNames(context);
    }

    /**
     * Renders a template block.
     *
     * @param {string} name The block name to render
     * @param context A hash of parameters to pass to the template
     * @param {TwingMap<string, TwingTemplateBlock>} blocks The current set of blocks
     *
     * @returns {string} The rendered block
     */
    renderBlock(name: string, context: any = {}, blocks: TwingMap<string, Array<any>> = new TwingMap()) {
        context = this.env.mergeGlobals(context);

        return this.template.displayBlock(name, context, blocks);
    }

    /**
     * Displays a template block.
     *
     * @param {string} name The block name to render
     * @param context An array of parameters to pass to the template
     */
    displayBlock(name: string, context: any = {}) {
        return this.template.displayBlock(name, this.env.mergeGlobals(context));
    }

    /**
     *
     * @returns {TwingSource}
     */
    getSourceContext(): TwingSource {
        return this.template.getSourceContext();
    }
}

export default TwingTemplateWrapper;