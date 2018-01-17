import TwingNode from "../node";
import TwingSource from "../source";
import TwingMap from "../map";
import TwingTemplate from "../template";
import TwingCompiler from "../compiler";
import DoDisplayHandler from "../do-display-handler";
import TwingNodeExpressionConstant from "./expression/constant";
import TwingErrorRuntime from "../error/runtime";

/**
 * Represents a module node.
 */
class TwingNodeModule extends TwingNode {
    public source: TwingSource;

    constructor(body: TwingNode, parent: TwingNode = null, blocks: TwingNode, macros: TwingNode, traits: TwingNode, embeddedTemplates: Array<{}>, source: TwingSource) {
        let nodes = new TwingMap();

        nodes.set('body', body);
        nodes.set('blocks', blocks);
        nodes.set('macros', macros);
        nodes.set('traits', traits);
        nodes.set('display_start', new TwingNode());
        nodes.set('display_end', new TwingNode());
        nodes.set('constructor_start', new TwingNode());
        nodes.set('constructor_end', new TwingNode());
        nodes.set('class_end', new TwingNode());

        if (parent !== null) {
            nodes.set('parent', parent);
        }

        // embedded templates are set as attributes so that they are only visited once by the visitors
        let attributes = new TwingMap();

        attributes.set('index', null);
        attributes.set('embedded_templates', embeddedTemplates);

        super(nodes, attributes, 1);

        this.source = source;

        // populate the template name of all node children
        this.setTemplateName(this.source.getName());
    }

    setIndex(index: number) {
        this.setAttribute('index', index);
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        this.compileTemplate(compiler);

        for (let template of this.getAttribute('embedded_templates')) {
            compiler.compile(template);
        }

        return () => {

        }
    }

    compileTemplate(compiler: TwingCompiler) {
        if (this.getNode('blocks').getNodes().size ||
            this.getNode('traits').getNodes().size ||
            !this.hasNode('parent') ||
            this.getNode('parent') instanceof TwingNodeExpressionConstant ||
            this.getNode('constructor_start').getNodes().size ||
            this.getNode('constructor_end').getNodes().size) {
            this.compileConstructor(compiler)
        }

        this.compileGetParent(compiler);
        this.compileDisplay(compiler);
        compiler.subcompile(this.getNode('blocks'));
        this.compileMacros(compiler);
        this.compileGetTemplateName(compiler);
    }

    compileGetParent(compiler: TwingCompiler) {
        if (this.hasNode('parent')) {
            let parent = this.getNode('parent');
            let doGetParent: DoDisplayHandler;

            if (parent instanceof TwingNodeExpressionConstant) {
                doGetParent = compiler.subcompile(parent);
            }
            else {
                let parentHandler = compiler.subcompile(parent);

                doGetParent = (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) => {
                    return template.loadTemplate(
                        parentHandler(template, context, blocks),
                        this.source.getName(),
                        parent.getTemplateLine()
                    );
                }
            }

            compiler.setDoGetParent((template: TwingTemplate, context: any): TwingTemplate | false => {
                return doGetParent(template, context);
            });
        }
    }

    compileConstructor(compiler: TwingCompiler) {
        let handlers: Array<DoDisplayHandler> = [];

        // constructor_start
        handlers.push(compiler.subcompile(this.getNode('constructor_start')));

        // parent
        let parent: TwingNode;

        if (!this.hasNode('parent')) {
            handlers.push((template: TwingTemplate) => {
                Reflect.set(template, 'parent', false);
            });
        }
        else if ((parent = this.getNode('parent')) && parent instanceof TwingNodeExpressionConstant) {
            let parentHandler = compiler.subcompile(parent);

            handlers.push((template: TwingTemplate) => {
                let parent = template.loadTemplate(
                    parentHandler(template, {}),
                    this.source.getName(),
                    parentHandler.node.getTemplateLine()
                );

                Reflect.set(template, 'parent', parent);
            });
        }

        /**********/
        /* blocks */
        /**********/
        handlers.push((template: TwingTemplate) => {
            let traitsBlocks: Array<TwingMap<string, Array<any>>> = [];

            // traits
            for (let [index, traitNode] of this.getNode('traits').getNodes()) {
                let templateName = compiler.subcompile(traitNode.getNode('template'))(template, {});
                let trait = template.loadTemplate(templateName, traitNode.getTemplateName(), traitNode.getTemplateLine()) as TwingTemplate;

                if (!trait.isTraitable()) {
                    throw new TwingErrorRuntime(`Template "${templateName}" cannot be used as a trait.`);
                }

                let traitBlocks = new TwingMap().merge(trait.getBlocks());

                // aliases
                traitNode.getNode('targets').getNodes().forEach(function (valueNode: TwingNodeExpressionConstant, key: string) {
                    if (!traitBlocks.has(key)) {
                        throw new TwingErrorRuntime(`Block "${key}" is not defined in trait "${templateName}".`, valueNode.getTemplateLine(), valueNode.getTemplateName());
                    }

                    let value = compiler.subcompile(valueNode)(template, {});

                    traitBlocks.set(value, traitBlocks.get(key));
                    traitBlocks.delete(key);
                });

                traitsBlocks.push(traitBlocks);
            }

            let traits: TwingMap<string, Array<any>> = new TwingMap();

            for (let traitBlocks of traitsBlocks) {
                traits = traits.merge(traitBlocks);
            }

            Reflect.set(template, 'traits', traits);

            // blocks
            let blocks = new TwingMap();

            for (let [name, node] of this.getNode('blocks').getNodes()) {
                blocks.set(name, [template, `block_${name}`]);
            }

            blocks = traits.merge(blocks);

            Reflect.set(template, 'blocks', blocks);
        });

        // constructor_end
        handlers.push(compiler.subcompile(this.getNode('constructor_end')));

        compiler.setDoConstruct((template: TwingTemplate) => {
            return handlers.map(function (handler) {
                return handler(template);
            }).join('')
        });
    }

    compileMacros(compiler: TwingCompiler) {
        compiler.subcompile(this.getNode('macros'));
    }

    compileGetTemplateName(compiler: TwingCompiler) {
        compiler.setDoGetTemplateName((): string => {
            return this.source.getName();
        });
    }

    compileDisplay(compiler: TwingCompiler) {
        let handlers: Array<DoDisplayHandler> = [];

        handlers.push(compiler.subcompile(this.getNode('display_start')));
        handlers.push(compiler.subcompile(this.getNode('body')));

        if (this.hasNode('parent')) {
            handlers.push((template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>) => {
                let parent: TwingTemplate = template.getParent(context);

                // console.warn('tPL', template);

                return parent.display(context, template.getBlocks().merge(blocks));
            });
        }

        handlers.push(compiler.subcompile(this.getNode('display_end')));

        compiler.setDoDisplay((template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()): string => {
            let result = handlers.map(function (handler) {
                return handler(template, context, blocks);
            }).join('');

            return result;
        });
    }
}

export default TwingNodeModule;