/**
 * Default base class for compiled templates.
 *
 * This class is an implementation detail of how template compilation currently
 * works, which might change. It should never be used directly. Use twig.load()
 * instead, which returns an instance of TwingTemplateWrapper.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 *
 * @internal
 */
import TwingErrorRuntime from "./error/runtime";
import TwingSource from "./source";
import TwingMap from "./map";
import TwingNodeBlock from "./node/block";
import TwingError from "./error";
import TwingEnvironment from "./environment";
import TwingTemplateWrapper from "./template-wrapper";

const array_merge = require('locutus/php/array/array_merge');

abstract class TwingTemplate {
    static ANY_CALL = 'ANY_CALL';
    static ARRAY_CALL = 'ARRAY_CALL';
    static METHOD_CALL = 'METHOD_CALL';

    /**
     * @internal
     */
    protected static cache: Array<string> = [];

    protected parent: TwingTemplate | false = null;
    protected parents: TwingMap<string, TwingTemplate> = new TwingMap();
    protected env: TwingEnvironment;
    protected blocks: TwingMap<string, Array<any>> = new TwingMap();
    protected traits: TwingMap<string, Array<any>> = new TwingMap();

    constructor(env: TwingEnvironment) {
        this.env = env;
    }

    /**
     * @internal this method will be removed in 2.0 and is only used internally to provide an upgrade path from 1.x to 2.0
     */
    toString() {
        return this.getTemplateName();
    }

    /**
     * Returns the template name.
     *
     * @returns {string} The template name
     */
    abstract getTemplateName(): string;

    /**
     * Returns debug information about the template.
     *
     * @returns {Array<any>} Debug information
     *
     * @internal
     */
    abstract getDebugInfo(): Array<any>;

    /**
     * Returns information about the original template source code.
     *
     * @return TwingSource
     */
    getSourceContext(): TwingSource {
        return new TwingSource('', this.getTemplateName());
    }

    /**
     * Returns the parent template.
     *
     * @param context
     *
     * @returns TwingTemplate|false The parent template or false if there is no parent
     */
    getParent(context: any = {}) {
        if (this.parent !== null) {
            return this.parent;
        }

        let parent: TwingTemplate | false;

        try {
            parent = this.doGetParent(context);

            if (parent === false) {
                return false;
            }

            if (parent instanceof TwingTemplate) {
                this.parents.set(parent.getTemplateName(), parent);
            }

            if (!this.parents.has(parent)) {
                this.parents.set(parent, this.loadTemplate(parent));
            }
        }
        catch (e) {
            if (e instanceof TwingError) {
                e.setSourceContext(null);
                e.guess();
            }

            throw e;
        }

        return this.parents.get(parent);
    }

    doGetParent(context: any): TwingTemplate | false {
        return false;
    }

    isTraitable() {
        return true;
    }

    /**
     * Displays a parent block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display from the parent
     * @param context The context
     * @param {Map<string, TwingNodeBlock>} blocks The current set of blocks
     * @returns {string}
     *
     * @internal
     */
    displayParentBlock(name: string, context: any, blocks: Map<string, TwingNodeBlock> = new Map()) {
        let parent;

        if (this.traits.has(name)) {
            return this.traits.get(name)[0].renderBlock(name, context, blocks, false);
        }
        else if (parent = this.getParent(context)) {
            return parent.renderBlock(name, context, blocks, false);
        }
        else {
            throw new TwingErrorRuntime(`The template has no parent and no traits defining the "${name}" block.`, -1, this.getSourceContext());
        }
    }

    /**
     * Displays a block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {TwingMap<string, Array<any>>} blocks The current set of blocks
     * @param {boolean} useBlocks Whether to use the current set of blocks
     * @returns {string}
     */
    displayBlock(name: string, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap(), useBlocks = true): string {
        // console.warn('DISPLAT BLOCK', this.getTemplateName(), name, blocks);

        let block: string;
        let template: TwingTemplate;
        let parent: TwingTemplate;

        if (useBlocks && blocks.has(name)) {
            template = blocks.get(name)[0];
            block = blocks.get(name)[1];
        }
        else if (this.blocks.has(name)) {
            template = this.blocks.get(name)[0];
            block = this.blocks.get(name)[1];
        }
        else {
            template = null;
            block = null;
        }

        // // avoid RCEs when sandbox is enabled
        // if (template !== null && !template instanceof self) {
        //     throw new Error('A block must be a method on a TwingTemplate instance.');
        // }

        if (template !== null) {
            try {
                return Reflect.get(template, block)(context, blocks);
            }
            catch (e) {
                if (e instanceof TwingError) {
                    if (!e.getSourceContext()) {
                        e.setSourceContext(template.getSourceContext());
                    }

                    // this is mostly useful for TwingErrorLoader exceptions
                    // see TwingErrorLoader
                    // see TwingErrorLoader
                    if (e.getTemplateLine() === null) {
                        e.setTemplateLine(-1);
                        e.guess();
                    }

                    throw e;
                }
                else {
                    console.warn(e);

                    throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, template.getSourceContext(), e);
                }
            }
        }
        else if ((parent = this.getParent(context)) !== false) {
            return parent.renderBlock(name, context, this.blocks.merge(blocks), false);
        }
        else if (blocks.has(name)) {
            throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${blocks.get(name)[0].getTemplateName()}" as the block does not exist in the parent template "${this.getTemplateName()}".`, -1, blocks.get(name)[0].getTemplateName());
        }
        else {
            throw new TwingErrorRuntime(`Block "${name}" on template "${this.getTemplateName()}" does not exist.`, -1, this.getTemplateName());
        }
    }

    /**
     * Renders a parent block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display from the parent
     * @param context The context
     * @param {Map<string, TwingNodeBlock>} blocks The current set of blocks
     *
     * @returns string The rendered block
     *
     * @internal
     */
    renderParentBlock(name: string, context: any, blocks: Map<string, TwingNodeBlock> = new Map()) {
        return this.displayParentBlock(name, context, blocks);
    }

    /**
     * Renders a block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {TwingMap<string, Array<any>>} blocks The current set of blocks
     * @param {boolean} useBlocks Whether to use the current set of blocks
     *
     * @return string The rendered block
     *
     * @internal
     */
    renderBlock(name: string, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap(), useBlocks = true): string {
        return this.displayBlock(name, context, blocks, useBlocks);
    }

    /**
     * Returns whether a block exists or not in the current context of the template.
     *
     * This method checks blocks defined in the current template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param {string} name The block name
     * @param context The context
     * @param {TwingMap<string, Array<any>>} blocks The current set of blocks
     *
     * @returns {boolean} true if the block exists, false otherwise
     */
    hasBlock(name: string, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()): boolean {
        if (blocks.has(name)) {
            return (blocks.get(name)[0] instanceof TwingTemplate);
        }

        if (this.blocks.has(name)) {
            return true;
        }

        let parent = this.getParent(context);

        if (parent) {
            return parent.hasBlock(name, context);
        }

        return false;
    }

    /**
     * Returns all block names in the current context of the template.
     *
     * This method checks blocks defined in the current template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param context The context
     * @param {TwingMap<string, Array<any>>} blocks The current set of blocks
     * @returns {Array<string>}
     */
    getBlockNames(context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()): Array<string> {
        let names = array_merge(
            [...blocks.keys()],
            [...this.blocks.keys()]
        );

        let parent: TwingTemplate = this.getParent(context);

        if (parent) {
            names = array_merge(names, parent.getBlockNames(context));
        }

        return names;
    }

    public loadTemplate(template: TwingTemplate | TwingTemplateWrapper | Array<TwingTemplate> | string, templateName: string = null, line: number = null, index: number = null): TwingTemplate | TwingTemplateWrapper {
        try {
            if (Array.isArray(template)) {
                return this.env.resolveTemplate(template);
            }

            if (template instanceof TwingTemplate) {
                return template;
            }

            if (template instanceof TwingTemplateWrapper) {
                return template;
            }

            return this.env.loadTemplate(template as string, index);
        }
        catch (e) {
            if (!e.getSourceContext()) {
                e.setSourceContext(templateName ? new TwingSource('', templateName) : this.getSourceContext());
            }

            if (e.getTemplateLine()) {
                throw e;
            }

            if (!line) {
                e.guess();
            }
            else {
                e.setTemplateLine(line);
            }

            throw e;
        }
    }

    /**
     * Returns all blocks.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @returns {TwingMap<string, Array<any>>} An array of blocks
     *
     * @internal
     */
    getBlocks() {
        return this.blocks;
    }

    display(context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) {
        return this.displayWithErrorHandling(this.env.mergeGlobals(context), this.blocks.merge(blocks));
    }

    render(context: any = {}): string {
        return this.display(context);
    }

    displayWithErrorHandling(context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()): string {
        try {
            return this.doDisplay(context, blocks);
        }
        catch (e) {
            if (e instanceof TwingError) {
                if (!e.getSourceContext()) {
                    e.setSourceContext(this.getSourceContext());
                }

                // this is mostly useful for TwingErrorLoader exceptions
                // see TwingErrorLoader
                if (e.getTemplateLine() === false) {
                    e.setTemplateLine(-1);
                    e.guess();
                }

                throw e;
            }

            console.warn(e);

            throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.getSourceContext(), e);
        }
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param context An array of parameters to pass to the template
     * @param {TwingMap<string, Array<any>>} blocks  An array of blocks to pass to the template
     */
    abstract doDisplay(context: any, blocks: TwingMap<string, Array<any>>): string;
}

export default TwingTemplate;