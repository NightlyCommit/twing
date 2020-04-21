import {TwingNode} from "./node";
import {TwingEnvironment} from "./environment";
import {isNullOrUndefined} from "util";
import {addcslashes} from "locutus/php/strings";

const sha256 = require('crypto-js/sha256');
const hex = require('crypto-js/enc-hex');

export class TwingCompiler {
    private lastLine: number;
    private source: string;
    private indentation: number;
    private env: TwingEnvironment;
    private varNameSalt = 0;

    constructor(env: TwingEnvironment) {
        this.env = env;
    }

    /**
     * Returns the environment instance related to this compiler.
     *
     * @returns TwingEnvironment
     */
    getEnvironment() {
        return this.env;
    }

    getSource() {
        return this.source;
    }

    compile(node: TwingNode, indentation: number = 0): TwingCompiler {
        this.lastLine = null;
        this.source = '';
        this.indentation = indentation;
        this.varNameSalt = 0;

        this.subcompile(node);

        return this;
    }

    subcompile(node: TwingNode, raw: boolean = true): TwingCompiler {
        if (raw === false) {
            this.source += ' '.repeat(this.indentation * 4);
        }

        node.compile(this);

        return this;
    }

    /**
     *
     * @param string
     * @returns
     */
    raw(string: any): TwingCompiler {
        this.source += string;

        return this;
    }

    /**
     * Writes a string to the compiled code by adding indentation.
     *
     * @returns {TwingCompiler}
     */
    write(...strings: Array<string>): TwingCompiler {
        for (let string of strings) {
            this.source += ' '.repeat(this.indentation * 4) + string;
        }

        return this;
    }

    /**
     * Adds a quoted string to the compiled code.
     *
     * @param {string} value The string
     *
     * @returns {TwingCompiler}
     */
    string(value: string): TwingCompiler {
        if (!isNullOrUndefined(value)) {
            if (typeof value === 'string') {
                value = '`' + addcslashes(value, "\0\t\\`").replace(/\${/g, '\\${') + '`';
            }
        } else {
            value = '``';
        }

        this.source += value;

        return this;
    }

    repr(value: any): any {
        if (typeof value === 'number') {
            this.raw(value);
        } else if (isNullOrUndefined(value)) {
            this.raw(`${value}`);
        } else if (typeof value === 'boolean') {
            this.raw(value ? 'true' : 'false');
        } else if (value instanceof Map) {
            this.raw('new Map([');

            let first = true;

            for (let [k, v] of value) {
                if (!first) {
                    this.raw(', ');
                }

                first = false;

                this
                    .raw('[')
                    .repr(k)
                    .raw(', ')
                    .repr(v)
                    .raw(']')
                ;
            }

            this.raw('])');
        } else if (typeof value === 'object') {
            this.raw('{');

            let first = true;

            for (let k in value) {
                if (!first) {
                    this.raw(', ');
                }

                first = false;

                this
                    .raw(`"${k}"`)
                    .raw(': ')
                    .repr(value[k])
                ;
            }

            this.raw('}');
        } else {
            this.string(value);
        }

        return this;
    }

    /**
     * Adds source-map enter call.
     *
     * @returns TwingCompiler
     */
    addSourceMapEnter(node: TwingNode) {
        if (this.getEnvironment().isSourceMap()) {
            this
                .write('this.env.enterSourceMapBlock(')
                .raw(node.getTemplateLine())
                .raw(', ')
                .raw(node.getTemplateColumn())
                .raw(', ')
                .string(node.type.toString())
                .raw(', ')
                .raw('this.getSourceContext(), outputBuffer);\n')
        }

        return this;
    }

    /**
     * Adds source-map leave call.
     *
     * @returns TwingCompiler
     */
    addSourceMapLeave() {
        if (this.getEnvironment().isSourceMap()) {
            this
                .write('this.env.leaveSourceMapBlock(outputBuffer);\n')
            ;
        }

        return this;
    }

    /**
     * Indents the generated code.
     *
     * @param {number} step The number of indentation to add
     *
     * @returns TwingCompiler
     */
    indent(step: number = 1) {
        this.indentation += step;

        return this;
    }

    /**
     * Outdents the generated code.
     *
     * @param {number} step The number of indentation to remove
     *
     * @return TwingCompiler
     *
     * @throws Error When trying to outdent too much so the indentation would become negative
     */
    outdent(step: number = 1) {
        // can't outdent by more steps than the current indentation level
        if (this.indentation < step) {
            throw new Error('Unable to call outdent() as the indentation would become negative.');
        }

        this.indentation -= step;

        return this;
    }

    getVarName(prefix: string = '__internal_'): string {
        return `${prefix}${hex.stringify(sha256('TwingCompiler::getVarName' + this.varNameSalt++))}`;
    }
}
