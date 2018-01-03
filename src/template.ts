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
import TwingTemplateBlock from "./template-block";
import TwingEnvironment = require("./environment");
import TwingNodeExpressionConstant from "./node/expression/constant";
import TwingNodeModule from "./node/module";
import TwingTemplateMacro = require("./template-macro");

let merge = require('merge');

class TwingTemplate {
    static ANY_CALL = 'ANY_CALL';
    static ARRAY_CALL = 'ARRAY_CALL';
    static METHOD_CALL = 'METHOD_CALL';

    /**
     * @internal
     */
    protected static cache: Array<string> = [];

    protected parent: TwingTemplate;
    protected parents: TwingMap<string, TwingTemplate> = new TwingMap();
    protected env: TwingEnvironment;
    protected blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap();
    protected traits: TwingMap<string, TwingTemplateBlock> = new TwingMap();
    protected macros: TwingMap<string, TwingTemplateMacro> = new TwingMap();
    protected name: string;
    protected embeddedTemplates: TwingMap<number, TwingNodeModule> = new TwingMap();

    protected node: TwingNodeModule;

    constructor(env: TwingEnvironment, node: TwingNodeModule) {
        this.env = env;
        this.node = node;

        this.setTemplateName(node.getTemplateName());
    }

    getEnvironment() {
        return this.env;
    }

    getNode(): TwingNodeModule {
        return this.node;
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
     * @return string The template name
     */
    getTemplateName() {
        return this.name;
    };

    setTemplateName(name: string) {
        this.name = name;
    }

    /**
     * Returns debug information about the template.
     *
     * @return array Debug information
     *
     * @internal
     */
    getDebugInfo(): Array<string> {
        return [];
    }

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
        if (this.parent) {
            return this.parent;
        }

        let parent;

        try {
            parent = this.doGetParent(context);

            if (!parent) {
                return false;
            }

            if (typeof parent !== 'string') {
                this.parents.set(parent.getTemplateName(), parent);
            }

            if (!this.parents.has(parent)) {
                this.parents.set(parent, this.loadTemplate(parent));
            }
        }
        catch (e) {
            console.warn(e);

            e.setSourceContext(null);
            e.guess();

            throw e;
        }

        return this.parents.get(parent);
    }

    protected doGetParent(context: any = {}): TwingTemplate | string {
        if (this.node.hasNode('parent')) {
            let parentNode = this.node.getNode('parent');
            let parent = parentNode.compile(context, this);

            if (parentNode instanceof TwingNodeExpressionConstant) {
                return parent;
            }
            else {
                return this.loadTemplate(parent, this.getSourceContext().getName(), parentNode.getTemplateLine());
            }
        }

        return null;
    }

    // A template can be used as a trait if:
    //   * it has no parent
    //   * it has no macros
    //   * it has no body
    //
    // Put another way, a template can be used as a trait if it
    // only contains blocks and use statements.
    isTraitable() {
        // see compileIsTraitable
        return true;
    }

    /**
     * Displays a parent block.
     *
     * This method is for internal use only and should never be called
     * directly.
     *
     * @param string name    The block name to display from the parent
     * @param array  context The context
     * @param array  blocks  The current set of blocks
     *
     * @internal
     */
    displayParentBlock(name: string, context: any, blocks: Map<string, TwingNodeBlock> = new Map()) {
        let parent;

        // console.warn('displayParentBlock', name, this.getTemplateName());

        if (this.traits.has(name)) {
            return this.traits.get(name).template.displayBlock(name, context, blocks, false);
        }
        else if (parent = this.getParent(context)) {
            return parent.displayBlock(name, context, blocks, false);
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
     * @param {string} name     The block name to display
     * @param context           The context
     * @param {TwingMap<string, TwingTemplateBlock>} blocks The current set of blocks
     * @param {boolean} useBlocks Whether to use the current set of blocks
     */
    displayBlock(name: string, context: any, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap(), useBlocks = true): string {
        let block: Function;
        let template: TwingTemplate;
        let parent: TwingTemplate;

        if (useBlocks && blocks.has(name)) {
            template = blocks.get(name).template;
            block = blocks.get(name).block;
        }
        else if (this.blocks.has(name)) {
            template = this.blocks.get(name).template;
            block = this.blocks.get(name).block;
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
                return block(context, blocks);
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
                    throw new TwingErrorRuntime(`An exception has been thrown during the rendering of a template ("${e.message}").`, -1, template.getSourceContext(), e);
                }
            }
        }
        else if ((parent = this.getParent(context)) !== false) {
            return parent.displayBlock(name, context, this.blocks.merge(blocks),false);
        }
        else if (blocks.has(name)) {
            throw new TwingErrorRuntime(`Block "${name}" should not call parent() in "${this.getTemplateName()}" as the block does not exist in the parent template "${blocks.get('name').template.getTemplateName()}".`, -1, blocks.get('name').template.getTemplateName());
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
     * @param string name    The block name to compile from the parent
     * @param array  context The context
     * @param array  blocks  The current set of blocks
     *
     * @return string The rendered block
     *
     * @internal
     */
    // renderParentBlock(name: string, context: Map<string, {}>, blocks: TwingMap<string, TwingNodeBlock> = new TwingMap()) {
    //     return this.displayParentBlock(name, context, blocks);
    // }

    /**
     * Returns whether a block exists or not in the current context of the template.
     *
     * This method checks blocks defined in the current template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param {string} name         The block name
     * @param {TwingMap<string, TwingTemplateBlock>} blocks The current set of blocks
     * @returns boolean true if the block exists, false otherwise
     */
    hasBlock(name: string, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap()): boolean {
        if (blocks.has(name)) {
            return (blocks.get(name).template === this);
        }

        if (this.blocks.has(name)) {
            return true;
        }

        let parent = this.parent;

        if (parent) {
            return parent.hasBlock(name);
        }

        return false;
    }

    /**
     * Returns all block names in the current context of the template.
     *
     * This method checks blocks defined in the current template
     * or defined in "used" traits or defined in parent templates.
     *
     * @param {Map<string, {}>} context The context
     * @param {TwingMap<string, TwingTemplateBlock>} blocks The current set of blocks
     * @returns {[any]}
     */
    getBlockNames(context: Map<string, {}>, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap()) {
        let names = merge(blocks.keys(), this.blocks.keys());

        let parent: TwingTemplate;

        if ((parent = this.getParent(context)) !== false) {
            names = merge.recursive(names, parent.getBlockNames(context));
        }

        return [...new Set(names)];
    }

    setBlock(name: string, value: TwingTemplateBlock) {
        this.blocks.set(name, value);
    }

    getTraits() {
        return this.traits;
    }

    addTraits(traits: TwingMap<string, TwingTemplateBlock>) {
        this.traits = this.traits.merge(traits);
    }

    setEmbeddedTemplate(index: number, template: TwingTemplate) {
        this.embeddedTemplates.set(index, template);
    }

    getEmbeddedTemplate(index: number) {
        if (this.embeddedTemplates.has(index)) {
            return this.embeddedTemplates.get(index);
        }

        return null;
    }

    setMacro(name: string, value: TwingTemplateMacro) {
        this.macros.set(name, value);
    }

    getMacro(name: string): TwingTemplateMacro {
        if (this.macros.has(name)) {
            return this.macros.get(name);
        }

        return null;
    }

    public loadTemplate(template: TwingTemplate | Array<TwingTemplate> | string, templateName: string = null, line: number = null, index: number = null): TwingTemplate {
        try {
            if (Array.isArray(template)) {
                return this.env.resolveTemplate(template);
            }

            if (template instanceof TwingTemplate) {
                return template;
            }

            return this.env.loadTemplate(template, index);
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
            } else {
                e.setTemplateLine(line);
            }

            throw e;
        }
    }

    getBlocks() {
        return this.blocks;
    }

    compileBlocks(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap) {
        this.getNode().getNode('blocks').compile(context, template, blocks);
    }

    compileTraits(context: any, template: TwingTemplate, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap) {
        this.getNode().getNode('traits').compile(context, template, blocks);

        this.blocks = this.traits.merge(this.blocks);
    }

    /**
     * Compile the macros
     *
     * @param context
     * @param template
     * @param {TwingMap<string, TwingTemplateBlock>} blocks
     */
    compileMacros(context: any, template: TwingTemplate,  blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap): void {
        this.getNode().getNode('macros').compile(context, template, blocks);
    }

    compileEmbeddedTemplates() {
        let self = this;

        self.node.getAttribute('embedded_templates').forEach(function(module: TwingNodeModule) {
            self.setEmbeddedTemplate(module.getAttribute('index'), self.env.compile(module));
        });
    }

    render(context: any = {}, blocks: TwingMap<string, TwingTemplateBlock> = new TwingMap()): string {
        // compile blocks
        this.compileBlocks(context, this, blocks);

        // compile traits
        this.compileTraits(context, this, blocks);

        // macros
        this.compileMacros(context, this, blocks);

        // embedded templates
        this.compileEmbeddedTemplates();

        let parent = this.getParent(context);

        if (parent) {
            return parent.render(context, this.blocks.merge(blocks));
        }

        // console.warn('MODULE', self.node.toString());

        return this.node.compile(this.getEnvironment().mergeGlobals(context), this, this.blocks.merge(blocks));
    }
}

export = TwingTemplate;