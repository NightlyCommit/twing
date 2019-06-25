/**
 * Exposes a template to userland.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingEnvironment} from "./environment";
import {TwingTemplate} from "./template";

import {TwingSource} from "./source";
import {iteratorToMap} from "./helpers/iterator-to-map";
import {TwingOutputBuffering} from "./output-buffering";

export class TwingTemplateWrapper {
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
     * @param {*} context A hash of parameters to pass to the template
     *
     * @returns {string} The rendered template
     */
    render(context: any = {}) {
        return this.template.render(context);
    }

    /**
     * Checks if a block is defined.
     *
     * @param {string} name The block name
     * @param {*} context A hash of parameters to pass to the template
     *
     * @returns {boolean}
     */
    hasBlock(name: string, context: any = {}) {
        return this.template.hasBlock(name, context);
    }

    /**
     * Returns defined block names in the template.
     *
     * @param {*} context A hash of parameters to pass to the template
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
     * @param {*} context A hash of parameters to pass to the template
     *
     * @returns {string} The rendered block
     */
    renderBlock(name: string, context: any = {}): string {
        if (!(context instanceof Map)) {
            context = iteratorToMap(context);
        }

        context = this.env.mergeGlobals(context);

        let level = TwingOutputBuffering.obGetLevel();

        TwingOutputBuffering.obStart();

        try {
            this.template.displayBlock(name, context);
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
     * Displays a template block.
     *
     * @param {string} name The block name to render
     * @param {*} context A hash of parameters to pass to the template
     */
    displayBlock(name: string, context: any = {}): void {
        if (!(context instanceof Map)) {
            context = iteratorToMap(context);
        }

        return this.template.displayBlock(name, this.env.mergeGlobals(context));
    }

    /**
     *
     * @returns {TwingSource}
     */
    getSourceContext(): TwingSource {
        return this.template.getSourceContext();
    }

    public traceableDisplayBlock(lineno: number, source: TwingSource) {
        return this.template.traceableMethod(this.displayBlock.bind(this), lineno, source);
    };

    public traceableDisplayParentBlock(lineno: number, source: TwingSource) {
        return this.template.traceableDisplayParentBlock(lineno, source);
    };

    public traceableRenderBlock(lineno: number, source: TwingSource) {
        return this.template.traceableMethod(this.renderBlock.bind(this), lineno, source);
    }

    public traceableRenderParentBlock(lineno: number, source: TwingSource) {
        return this.template.traceableRenderParentBlock(lineno, source);
    }

    public traceableHasBlock(lineno: number, source: TwingSource) {
        return this.template.traceableHasBlock(lineno, source);
    }
}
