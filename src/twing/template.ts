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

import {TwingNodeBlock} from "./node/block";
import {TwingError} from "./error";
import {TwingEnvironment} from "./environment";
import {TwingTemplateWrapper} from "./template-wrapper";
import {TwingOutputBuffering} from './output-buffering';
import {iteratorToMap} from "./helper/iterator-to-map";
import {merge as twingMerge} from "./helper/merge";
import {TwingExtensionInterface} from "./extension-interface";

export abstract class TwingTemplate {
    static ANY_CALL = 'any';
    static ARRAY_CALL = 'array';
    static METHOD_CALL = 'method';

    protected parent: TwingTemplate | false = null;
    protected parents: Map<TwingTemplate | string, TwingTemplate> = new Map();
    protected env: TwingEnvironment;
    protected blocks: Map<string, Array<any>> = new Map();
    protected traits: Map<string, Array<any>> = new Map();

    /**
     * @internal
     */
    protected extensions: Map<string, TwingExtensionInterface> = new Map();

    constructor(env: TwingEnvironment) {
        this.env = env;
        this.extensions = env.getExtensions();
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
     * @returns {Map<number, {line: number, column: number}>} Debug information
     *
     * @internal
     */
    abstract getDebugInfo(): Map<number, {line: number, column: number}>;

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

        let parent: TwingTemplate | string | false;

        try {
            parent = this.doGetParent(context);

            if (parent === false) {
                return false;
            }

            if (parent instanceof TwingTemplate) {
                this.parents.set(parent.getTemplateName(), parent);
            }

            if (!this.parents.has(parent)) {
                this.parents.set(parent, this.loadTemplate(parent as string) as TwingTemplate);
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
    displayParentBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map()) {
        let parent;

        if (this.traits.has(name)) {
            (this.traits.get(name)[0] as TwingTemplate).displayBlock(name, context, blocks, false);
        }
        else if ((parent = this.getParent(context) as TwingTemplate | false) !== false) {
            (<TwingTemplate>parent).displayBlock(name, context, blocks, false);
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
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @internal
     */
    displayBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map(), useBlocks = true): void {
        let block: string;
        let template: TwingTemplate;
        let parent: TwingTemplate | false;

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
                Reflect.get(template, block).call(template, context, blocks);
            }
            catch (e) {
                if (e instanceof TwingError) {
                    if (!e.getSourceContext()) {
                        e.setSourceContext(template.getSourceContext());
                    }

                    // this is mostly useful for TwingErrorLoader exceptions
                    // see TwingErrorLoader
                    if (e.getTemplateLine() === false) {
                        e.setTemplateLine(-1);
                        e.guess();
                    }

                    throw e;
                }
                else {
                    throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, template.getSourceContext(), e);
                }
            }
        }
        else if ((parent = this.getParent(context) as TwingTemplate | false) !== false) {
            parent.displayBlock(name, context, twingMerge(this.blocks, blocks), false);
        }
        else if (blocks.has(name)) {
            throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${blocks.get(name)[0].getTemplateName()}" as the block does not exist in the parent template "${this.getTemplateName()}".`, -1, blocks.get(name)[0].getTemplateName());
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
     * @param {*} context The context
     * @param {Map<string, Array<any>>} blocks The active set of blocks
     *
     * @returns string The rendered block
     *
     * @internal
     */
    renderParentBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map()) {
        TwingOutputBuffering.obStart();

        this.displayParentBlock(name, context, blocks);

        return TwingOutputBuffering.obGetClean() as string;
    }

    /**
     * Renders a block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param {string} name The block name to display
     * @param context The context
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     * @param {boolean} useBlocks Whether to use the active set of blocks
     *
     * @return string The rendered block
     *
     * @internal
     */
    renderBlock(name: string, context: any, blocks: Map<string, [TwingTemplate, string]> = new Map(), useBlocks = true): string {
        TwingOutputBuffering.obStart();

        this.displayBlock(name, context, blocks, useBlocks);

        return TwingOutputBuffering.obGetClean() as string;
    }

    /**
     * Returns whether a block exists or not in the active context of the template.
     *
     * This method checks blocks defined in the active template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param {string} name The block name
     * @param context The context
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     *
     * @returns {boolean} true if the block exists, false otherwise
     */
    hasBlock(name: string, context: any, blocks: Map<string, Array<any>> = new Map()): boolean {
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
     * @param {Map<string, Array<*>>} blocks The active set of blocks
     * @returns {Array<string>}
     */
    getBlockNames(context: any, blocks: Map<string, Array<any>> = new Map()): Array<string> {
        let names: any = new Set([...blocks.keys(), ...this.blocks.keys()]);

        let parent: TwingTemplate = this.getParent(context) as TwingTemplate;

        if (parent) {
            names = new Set([...names, ...parent.getBlockNames(context)]);
        }

        return [...names];
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
     * @returns {Map<string, Array<*>>} An array of blocks
     *
     * @internal
     */
    getBlocks() {
        return this.blocks;
    }

    display(context: any, blocks: Map<string, Array<any>> = new Map()) {
        if (!(context instanceof Map)) {
            context = iteratorToMap(context);
        }

        this.displayWithErrorHandling(this.env.mergeGlobals(context), twingMerge(this.blocks, blocks));
    }

    render(context: any): string {
        let level = TwingOutputBuffering.obGetLevel();

        TwingOutputBuffering.obStart();

        try {
            this.display(context);
        }
        catch (e) {
            while (TwingOutputBuffering.obGetLevel() > level) {
                TwingOutputBuffering.obEndClean();
            }

            throw e;
        }

        return TwingOutputBuffering.obGetClean() as string;
    }

    /**
     * Auto-generated method to display the template with the given context.
     *
     * @param {*} context An array of parameters to pass to the template
     * @param {Map<string, Array<*>>} blocks  An array of blocks to pass to the template
     */
    abstract doDisplay(context: {}, blocks: Map<string, Array<any>>): void;

    protected doGetParent(context: any): TwingTemplate | string | false {
        return false;
    }

    protected displayWithErrorHandling(context: any, blocks: Map<string, Array<any>> = new Map()) {
        try {
            this.doDisplay(context, blocks);
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

            throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, this.getSourceContext(), e);
        }
    }
}
