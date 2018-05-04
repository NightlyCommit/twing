import {TwingSource} from "./source";
import {TwingTemplate} from "./template";
import {TwingReflectionObject} from "./reflection-object";
import {StackFrame} from "stack-trace";

const stackTrace = require('stack-trace');

/**
 * Twing base error.
 *
 * This error class and its children must only be used when
 * an error occurs during the loading of a template, when a syntax error
 * is detected in a template, or when rendering a template. Other
 * errors must use regular JavaScript error classes (like when the template
 * cache directory is not writable for instance).
 *
 * To help debugging template issues, this class tracks the original template
 * name and line where the error occurred.
 *
 * Whenever possible, you must set these information (original template name
 * and line number) yourself by passing them to the constructor. If some or all
 * these information are not available from where you throw the exception, then
 * this class will guess them automatically (when the line number is set to -1
 * and/or the name is set to null). As this is a costly operation, this
 * can be disabled by passing false for both the name and the line number
 * when creating a new instance of this class.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingError extends Error {
    protected static registry: Map<string, string> = new Map();
    name_: string | Object = null;
    private lineno: number | boolean;
    private rawMessage: string = null;
    private sourcePath: string = null;
    private sourceCode: string = null;
    private previous: Error = null;

    constructor(message: string, lineno: number = -1, source: TwingSource | Object | null = null, previous: Error = null) {
        super(message);

        this.name = this.constructor.name;
        this.previous = previous;

        Error.captureStackTrace(this, this.constructor);

        this.rawMessage = message;

        this.init(lineno, source)
    }

    public static register(key: string, value: string) {
        TwingError.registry.set(key, value);
    }

    getMessage() {
        return this.message;
    }

    getPrevious() {
        return this.previous;
    }

    /**
     * Gets the raw message.
     *
     * @return string The raw message
     */
    getRawMessage() {
        return this.rawMessage;
    }

    /**
     * Gets the template line where the error occurred.
     *
     * @return int The template line
     */
    getTemplateLine() {
        return this.lineno;
    }

    /**
     * Sets the template line where the error occurred.
     *
     * @param {number} lineno The template line
     */
    setTemplateLine(lineno: number | boolean) {
        this.lineno = lineno;

        this.updateRepr();
    }

    /**
     * Gets the source context of the Twig template where the error occurred.
     *
     * @return TwingSource|null
     */
    getSourceContext() {
        return this.name_ ? new TwingSource(this.sourceCode, this.name_, this.sourcePath) : null;
    }

    /**
     * Sets the source context of the Twig template where the error occurred.
     */
    setSourceContext(source: TwingSource = null) {
        if (source === null) {
            this.sourceCode = this.name_ = this.sourcePath = null;
        }
        else {
            this.sourceCode = source.getCode();
            this.name_ = source.getName();
            this.sourcePath = source.getPath();
        }

        this.updateRepr();
    }

    guess() {
        this.guessTemplateInfo();
        this.updateRepr();
    }

    appendMessage(rawMessage: string) {
        this.rawMessage += rawMessage;

        this.updateRepr();
    }

    private updateRepr() {
        this.message = this.rawMessage;

        if (this.sourcePath && (this.lineno > 0)) {
            return;
        }

        let dot = false;

        if (this.message.substr(-1) === '.') {
            this.message = this.message.slice(0, -1);
            dot = true;
        }

        let questionMark = false;

        if (this.message.substr(-1) === '?') {
            this.message = this.message.slice(0, -1);
            questionMark = true;
        }

        if (this.name_) {
            let sourceName;

            if (typeof this.name_ === 'string' || (typeof this.name_ === 'object' && Reflect.has(this.name_, 'toString'))) {
                sourceName = `"${this.name_}"`;
            }
            else {
                sourceName = JSON.stringify(this.name_);
            }

            this.message += ` in ${sourceName}`;
        }

        if (this.lineno && this.lineno >= 0) {
            this.message += ` at line ${this.lineno}`;
        }

        if (dot) {
            this.message += '.';
        }

        if (questionMark) {
            this.message += '?';
        }
    }

    guessTemplateInfo(): void {
        let TwingTemplate = require('./template').TwingTemplate;

        let template: TwingTemplate = null;
        let templateClass: string = null;

        // construct the backtrace from the errors stack traces
        // we can't rely on stackTrace.get() for this because of https://github.com/nodejs/node/issues/11865
        let e: any = this;
        let errors = [e];
        let backtrace: StackFrame[] = [];

        while (e.getPrevious && (e = e.getPrevious())) {
            errors.push(e);
        }

        while (e = errors.pop()) {
            for (let trace of stackTrace.parse(e)) {
                backtrace.push(trace);
            }
        }

        for (let trace of backtrace) {
            let templates: any;
            let currentClass = trace.getTypeName();

            if (TwingError.registry.has(currentClass)) {
                templates = TwingError.registry.get(currentClass);

                let objectConstructor = templates[trace.getTypeName()];
                let object: any;

                let safeEnvironment = {
                    loadTemplate: () => {
                        return {};
                    },
                    getExtensions: () => {
                        return new Map();
                    }
                };

                object = new objectConstructor(safeEnvironment);

                let isEmbedContainer: boolean = (!!templateClass && templateClass.indexOf(currentClass) === 0);

                if (this.name_ === null || (this.name_ == object.getTemplateName() && !isEmbedContainer)) {
                    template = object;
                    templateClass = trace.getTypeName();
                }
            }
        }

        // update template name
        if (template !== null && this.name_ === null) {
            this.name_ = template.getTemplateName();
        }

        // update template path if any
        if (template !== null && this.sourcePath === null) {
            let src = template.getSourceContext();

            this.sourceCode = src.getCode();
            this.sourcePath = src.getPath();
        }

        if (template === null || this.lineno > -1) {
            return;
        }

        let r = new TwingReflectionObject(templateClass);
        let file = r.getFileName();

        e = this;
        errors = [e];

        while (e.getPrevious && (e = e.getPrevious())) {
            errors.push(e);
        }

        while (e = errors.pop()) {
            let traces = stackTrace.parse(e);

            let templateToUse: TwingTemplate = template;

            for (let trace of traces) {
                if (!trace.getFileName() || !trace.getLineNumber() || file != trace.getFileName()) {
                    continue;
                }

                for (let [codeLine, templateLine] of templateToUse.getDebugInfo()) {
                    if (codeLine <= trace.getLineNumber()) {
                        // update template line
                        this.lineno = templateLine;

                        return;
                    }
                }
            }
        }
    }

    protected init(lineno: number, source: TwingSource | Object | null) {
        let name: string | Object;

        if (source === null) {
            name = null;
        }
        else if (!(source instanceof TwingSource)) {
            name = source;
        }
        else {
            name = source.getName();

            this.sourceCode = source.getCode();
            this.sourcePath = source.getPath();
        }

        this.lineno = lineno;
        this.name_ = name;

        if (lineno === -1 || name === null || this.sourcePath === null) {
            this.guessTemplateInfo();
        }

        this.updateRepr();
    }
}
