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
import {TwingErrorRuntime} from "./error/runtime";
import {TwingSource} from "./source";
import {TwingMap} from "./map";
import {TwingNodeBlock} from "./node/block";
import {TwingError} from "./error";
import {TwingEnvironment} from "./environment";
import {TwingTemplateWrapper} from "./template-wrapper";
import {TwingOutputBuffer} from './output-buffer';
import {iteratorToMap} from "./helper/iterator-to-map";

const merge = require('merge');

export abstract class TwingTemplate {
    static ANY_CALL = 'any';
    static ARRAY_CALL = 'array';
    static METHOD_CALL = 'method';

    /**
     * @internal
     */
    protected static cache: Array<string> = [];

    protected parent: TwingTemplate | false = null;
    protected parents: TwingMap<string, TwingTemplate> = new TwingMap();
    protected env: TwingEnvironment;
    protected blocks: TwingMap<string, Array<any>> = new TwingMap();
    protected traits: TwingMap<string, [string, TwingTemplate]> = new TwingMap();

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
     * @returns {Map<number, number>} Debug information
     *
     * @internal
     */
    abstract getDebugInfo(): Map<number, number>;

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
            // console.warn(e);

            if (e instanceof TwingError) {
                e.setSourceContext(null);
                e.guess();
            }

            throw e;
        }

        return this.parents.get(parent);
    }

    protected doGetParent(context: any): TwingTemplate | false {
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
     * @param {Map<string, TwingNodeBlock>} blocks The active set of blocks
     * @returns {string}
     *
     * @internal
     */
    async displayParentBlock(name: string, context: any, blocks: Map<string, TwingNodeBlock> = new Map()) {
        let parent;

        if (this.traits.has(name)) {
            this.traits.get(name)[0].displayBlock(name, context, blocks, false);
        }
        else if ((parent = this.getParent(context)) !== false) {
            await parent.displayBlock(name, context, blocks, false);
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
     * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @internal
     */
    async displayBlock(name: string, context: any, blocks: TwingMap<string, [TwingTemplate, string]> = new TwingMap(), useBlocks = true) {
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
                await Reflect.get(template, block).call(template, context, blocks);
            }
            catch (e) {
                if (e instanceof TwingError) {
                    e.setTemplate(template);

                    if (!e.getSourceContext()) {
                        e.setSourceContext(template.getSourceContext());
                    }

                    if (e.getTemplateLine() === -1) {
                        e.guess();
                    }

                    throw e;
                }
                else {
                    // console.warn(e);

                    throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.getSourceContext(), e, template);
                }
            }
        }
        else if ((parent = this.getParent(context)) !== false) {
            parent.displayBlock(name, context, this.blocks.merge(blocks), false);
        }
        else if (blocks.has(name)) {
            throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${blocks.get(name)[0].getTemplateName()}" as the block does not exist in the parent template "${this.getTemplateName()}".`, -1, blocks.get(name)[0].getTemplateName(), null);
        }
        else {
            throw new TwingErrorRuntime(`Block "${name}" on template "${this.getTemplateName()}" does not exist.`, -1, this.getTemplateName(), null);
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
     * @param {Map<string, TwingNodeBlock>} blocks The active set of blocks
     *
     * @returns string The rendered block
     *
     * @internal
     */
    async renderParentBlock(name: string, context: any, blocks: Map<string, TwingNodeBlock> = new Map()) {
        TwingOutputBuffer.obStart();

        await this.displayParentBlock(name, context, blocks);

        return TwingOutputBuffer.obGetClean() as string;
    }

    /**
     * Renders a block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @return string The rendered block
     *
     * @internal
     */
    async renderBlock(name: string, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap(), useBlocks = true): Promise<string> {
        TwingOutputBuffer.obStart();

        await this.displayBlock(name, context, blocks, useBlocks);

        return TwingOutputBuffer.obGetClean() as string;
    }

    /**
     * Returns whether a block exists or not in the active context of the template.
     *
     * This method checks blocks defined in the active template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param {string} name The block name
     * @param context The context
     * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
     *
     * @returns {boolean} true if the block exists, false otherwise
     */
    hasBlock(name: string, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()): boolean {
        if (blocks.has(name)) {
            return blocks.get(name)[0] instanceof TwingTemplate;
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
     * Returns all block names in the active context of the template.
     *
     * This method checks blocks defined in the active template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param context The context
     * @param {TwingMap<string, Array<*>>} blocks The active set of blocks
     * @returns {Array<string>}
     */
    getBlockNames(context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()): Array<string> {
        let names = merge(
            {},
            [...blocks.keys()],
            [...this.blocks.keys()]
        );

        let parent: TwingTemplate = this.getParent(context);

        if (parent) {
            names = merge({}, names, parent.getBlockNames(context));
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
            if (e instanceof TwingError) {
                if (!e.getTemplate()) {
                    e.setTemplate(this);
                }

                if (!e.getSourceContext()) {
                    e.setSourceContext(templateName ? new TwingSource('', templateName) : this.getSourceContext());
                }

                if (e.getTemplateLine() !== -1) {
                    throw e;
                }

                if (!line) {
                    e.guess();
                }
                else {
                    e.setTemplateLine(line);
                }

                // console.warn(e);

                throw e;
            }
        }
    }

    /**
     * Returns all blocks.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @returns {TwingMap<string, Array<*>>} An array of blocks
     *
     * @internal
     */
    getBlocks() {
        return this.blocks;
    }

    async display(context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) {
        if (!(context instanceof TwingMap)) {
            context = iteratorToMap(context);
        }

        await this.displayWithErrorHandling(this.env.mergeGlobals(context), this.blocks.merge(blocks));
    }

    async render(context: any): Promise<string> {
        let level = TwingOutputBuffer.obGetLevel();

        TwingOutputBuffer.obStart();

        try {
            await this.display(context);
        }
        catch (e) {
            while (TwingOutputBuffer.obGetLevel() > level) {
                TwingOutputBuffer.obEndClean();
            }

            throw e;
        }

        return TwingOutputBuffer.obGetClean() as string;
    }

    protected async displayWithErrorHandling(context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) {
        try {
            await this.doDisplay(context, blocks);
        }
        catch (e) {
            if (e instanceof TwingError) {
                if (!e.getTemplate()) {
                    e.setTemplate(this);
                }

                if (!e.getSourceContext()) {
                    e.setSourceContext(this.getSourceContext());
                }

                if (e.getTemplateLine() === -1) {
                    e.guess();
                }

                // console.warn(e);

                throw e;
            }

            console.warn(e);

            throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.getSourceContext(), e, this);
        }
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param {*} context An array of parameters to pass to the template
     * @param {TwingMap<string, Array<*>>} blocks  An array of blocks to pass to the template
     */
    async abstract doDisplay(context: {}, blocks: TwingMap<string, Array<any>>): Promise<void>;
}
