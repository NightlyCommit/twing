import TwingNode from "./node";
import TwingEnvironment from "./environment";
import TwingMap from "./map";

const substr_count = require('locutus/php/strings/substr_count');
const addcslashes = require('locutus/php/strings/addcslashes');
const md5 = require('locutus/php/strings/md5');
const uniqid = require('locutus/php/misc/uniqid');
const mt_rand = require('locutus/php/math/mt_rand');

class TwingCompiler {
    private lastLine: number;
    private source: string;
    private indentation: number;
    private env: TwingEnvironment;
    private debugInfo: TwingMap<string, string>;
    private sourceOffset: number;
    private sourceLine: number;

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
        this.debugInfo = new TwingMap();
        this.sourceOffset = 0;
        // source code starts at 1 (as we then increment it when we encounter new lines)
        this.sourceLine = 1;
        this.indentation = indentation;

        this.subcompile(node);

        return this;
    }

    subcompile(node: TwingNode, raw: boolean = true): any {
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
        if (value !== null) {
            if (typeof value === 'string') {
                value = `"${addcslashes(value, "\0\t\"\\\n\r")}"`;
            }
        }
        else {
            value = '""';
        }

        this.source += value;

        return this;
    }

    repr(value: any): any {
        if (typeof value === 'number') {
            // if (false !== $locale = setlocale(LC_NUMERIC, '0')) {
            //     setlocale(LC_NUMERIC, 'C');
            // }

            this.raw(value);

            // if (false !== $locale) {
            //     setlocale(LC_NUMERIC, $locale);
            // }
        }
        else if (value === null) {
            this.raw('null');
        }
        else if (typeof value === 'boolean') {
            this.raw(value ? 'true' : 'false');
        }
        else if (Array.isArray(value)) {
            this.raw('[');

            let first = true;

            for (let v of value) {
                if (!first) {
                    this.raw(', ');
                }

                first = false;

                this.repr(v);
            }

            this.raw(']');
        }
        else if (value instanceof Map) {
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
                    .raw(',')
                    .repr(v)
                    .raw(']')
                ;
            }

            this.raw('])');
        }
        else if (typeof value === 'object') {
            this.raw('{');

            let first = true;

            for (let k in value) {
                if (!first) {
                    this.raw(', ');
                }

                first = false;

                this
                    .repr(k)
                    .raw(': ')
                    .repr(value[k])
                ;
            }

            this.raw('}');
        }
        else if (value === undefined) {
            this.raw('');
        }
        else {
            this.string(value);
        }

        return this;
    }

    /**
     * Adds debugging information.
     *
     * @returns TwingCompiler
     */
    addDebugInfo(node: TwingNode) {
        if (node.getTemplateLine() != this.lastLine) {
            this.write(`// line ${node.getTemplateLine()}\n`);

            this.sourceLine += substr_count(this.source, "\n", this.sourceOffset);
            this.sourceOffset = this.source.length;
            this.debugInfo.set(this.sourceLine, node.getTemplateLine());

            this.lastLine = node.getTemplateLine();
        }

        return this;
    }

    getDebugInfo() {
        this.debugInfo = this.debugInfo.sortByKeys();

        return this.debugInfo;
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
        return `${prefix}${md5(uniqid(mt_rand(), true))}`;
    }
}

export default TwingCompiler;