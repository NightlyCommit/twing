import TwingNode from "./node";
import TwingEnvironment from "./environment";
import DoDisplayHandler from "./do-display-handler";
import TwingTemplate from "./template";
import TwingTemplateImpl from "./template/impl";
import TwingMap from "./map";
import TwingMethodDefinition from "./method-definition";
import TwingNodeModule from "./node/module";

const merge = require('merge');
const md5 = require('locutus/php/strings/md5');
const uniqid = require('locutus/php/misc/uniqid');
const mt_rand = require('locutus/php/math/mt_rand');
const addcslashes = require('locutus/php/strings/addcslashes');

class TwingCompiler {
    private lastLine: number;
    private indentation: number;
    private env: TwingEnvironment;
    private debugInfo: Array<string> = [];
    private sourceOffset: number;
    private sourceLine: number;
    private index: number;

    private doConstruct: DoDisplayHandler;
    private doDisplay: DoDisplayHandler;
    private doGetParent: DoDisplayHandler;
    private doGetTemplateName: DoDisplayHandler;
    private blocks: TwingMap<string, DoDisplayHandler> = new TwingMap();
    private macros: TwingMap<string, TwingMethodDefinition> = new TwingMap();

    private subCompilers: Array<TwingCompiler> = [];

    constructor(env: TwingEnvironment) {
        this.env = env;
    }

    setIndex(index: number) {
        this.index = index;
    }

    setDoConstruct(handler: DoDisplayHandler) {
        this.doConstruct = handler;
    }

    setDoDisplay(handler: DoDisplayHandler) {
        this.doDisplay = handler;
    }

    setDoGetParent(handler: DoDisplayHandler) {
        this.doGetParent = handler;
    }

    setDoGetTemplateName(handler: DoDisplayHandler) {
        this.doGetTemplateName = handler;
    }

    setBlock(name: string, handler: DoDisplayHandler) {
        this.blocks.set(name, handler);
    }

    setMacro(name: string, methodDefinition: TwingMethodDefinition) {
        this.macros.set(name, methodDefinition);
    }

    /**
     * Returns the environment instance related to this compiler.
     *
     * @returns TwingEnvironment
     */
    getEnvironment() {
        return this.env;
    }

    getTemplates(): Map<number, TwingTemplate> {
        let templates: Map<number, TwingTemplate> = new Map();

        templates.set(this.index, this.getTemplate());

        let flatten = function(compiler: TwingCompiler) {
          for (let [index, template] of compiler.getTemplates()) {
              templates.set(index, template);
          }
        };

        for (let subCompiler of this.subCompilers) {
            flatten(subCompiler);
        }

        return templates;
    }

    /**
     * Gets the template after compilation.
     *
     * Functionally equivalent to getSource in PHP implementation
     *
     * @return {TwingTemplate} The template
     */
    getTemplate(): TwingTemplate {
        let template = new TwingTemplateImpl(this.env, this.doConstruct);

        Reflect.set(template, 'doDisplay', (context: any, blocks: TwingMap<string, Array<any>> = new TwingMap()) => {
            return this.doDisplay(template, context, blocks);
        });

        Reflect.set(template, 'doGetParent', (context: any) => {
            return this.doGetParent(template, context);
        });

        Reflect.set(template, 'getTemplateName', () => {
            return this.doGetTemplateName(template);
        });

        for (let [name, handler] of this.blocks) {
            Reflect.set(template, `block_${name}`, (context: any, blocks: TwingMap<string, Array<any>>) => {
                return handler(template, context, blocks);
            });
        }

        for (let [name, methodDefinition] of this.macros) {
            Reflect.set(template, `macro_${name}`, methodDefinition);
        }

        return template;
    }

    compile(node: TwingNode): TwingCompiler {
        let compiler: TwingCompiler = this;

        if (node instanceof TwingNodeModule && node.getAttribute('index') !== null) {
            compiler = new TwingCompiler(this.getEnvironment());

            this.subCompilers.push(compiler);
        }

        compiler.index = node.getAttribute('index');
        compiler.subcompile(node);

        return this;
    }

    subcompile(node: TwingNode): DoDisplayHandler {
        let result = node.compile(this);

        result.node = node;

        return result;
    }

    /**
     *
     * @param value
     * @returns
     */
    raw(value: any): any {
        // as per PHP specifications, true is output as '1' and false as ''
        if (typeof value === 'boolean') {
            return value ? '1' : '';
        }

        return value;
    }

    /**
     * Adds a quoted string to the compiled code.
     *
     * @param {string} value The string
     *
     * @returns {string}
     */
    string(handler: DoDisplayHandler): DoDisplayHandler {
        return (template: TwingTemplate, context: any, blocks: TwingMap<string, Array<any>>): string => {
            return `"${addcslashes(handler(template, context, blocks), "\0\t\"\$\\")}"`
        };
    }

    repr(value: any): any {
        if (value === null) {
            return 'null';
        }
        else if (typeof value === 'boolean') {
            return this.raw(value ? 'true' : 'false');
        }
        else if (Array.isArray(value)) {
            let result: Array<any> = [];

            for (let k in value) {
                result.push(this.raw(value[k]));
            }

            return result;
        }
        else if (value === undefined) {
            return '';
        }

        return value;
    }
}

export default TwingCompiler;