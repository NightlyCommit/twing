/**
 * Twing base error.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import {TwingSource} from "./source";
import {TwingTemplate} from "./template";
import {TwingReflectionObject} from "./reflection-object";

const stackTrace = require('stack-trace');

export class TwingError extends Error {
    sourceName: string;

    private lineno: number | boolean;
    private rawMessage: string;
    private sourcePath: string;
    private sourceCode: string;
    private fileName: string;
    private previous: Error;
    private template: TwingTemplate;

    protected type: string;

    static type: string = 'TwingError';

    constructor(message: string, lineno: number = -1, source: TwingSource | string | null = null, previous: Error = null, template: TwingTemplate = null) {
        super(message);

        this.name = this.constructor.name;
        this.previous = previous;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        if (template) {
            this.template = template;
        }

        let sourceName;

        if (source === null) {
            sourceName = null;
        }
        else if (!(source instanceof TwingSource)) {
            sourceName = source;
        }
        else {
            sourceName = source.getName();

            this.sourceCode = source.getCode();
            this.sourcePath = source.getPath();
        }

        this.lineno = lineno;
        this.sourceName = sourceName;

        if (this.template && (lineno === -1 || sourceName === null || this.sourcePath === null)) {
            this.guessTemplateInfo();
        }

        this.rawMessage = message;

        this.updateRepr();
    }

    getMessage() {
        return this.message;
    }

    getPrevious() {
        return this.previous;
    }

    /**
     *
     * @returns {StackFrame[]}
     */
    getTrace() {
        return stackTrace.parse(this);
    }

    getFile() {
        return this.fileName ? this.fileName : this.sourcePath;
    }

    getType(): string {
        return this.type;
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
        return this.sourceName ? new TwingSource(this.sourceCode, this.sourceName, this.sourcePath) : null;
    }

    /**
     * Sets the source context of the Twig template where the error occurred.
     */
    setSourceContext(source: TwingSource = null) {
        if (source === null) {
            this.sourceCode = this.sourceName = this.sourcePath = null;
        }
        else {
            this.sourceCode = source.getCode();
            this.sourceName = source.getName();
            this.sourcePath = source.getPath();
        }

        this.updateRepr();
    }

    /**
     *
     * @returns {TwingTemplate}
     */
    getTemplate() {
        return this.template;
    }

    /**
     *
     * @param {TwingTemplate} template
     */
    setTemplate(template: TwingTemplate) {
        this.template = template;
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

    updateRepr() {
        this.message = this.rawMessage;

        if (this.sourcePath && (this.lineno > 0)) {
            // this.file = this.sourcePath;
            // this.line = this.lineno;

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

        if (this.sourceName) {
            let sourceName;

            if (typeof this.sourceName === 'string' || typeof this.sourceName === 'object' && Reflect.has(this.sourceName, 'toString')) {
                sourceName = `"${this.sourceName}"`;
            }
            else {
                sourceName = JSON.stringify(this.sourceName);
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
        let template = this.template;

        // update template name
        if (template !== null && this.sourceName === null) {
            this.sourceName = template.getTemplateName();
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

        let r = new TwingReflectionObject(template);
        let file = r.getFileName();

        let e: any = this;

        let errors = [e];

        while (e.getPrevious && (e = e.getPrevious())) {
            errors.push(e);
        }

        while (e = errors.pop()) {
            let traces = stackTrace.parse(e);

            let templateToUse: TwingTemplate = template;

            while (templateToUse && (templateToUse.getTemplateName() !== this.getSourceContext().getName())) {
                templateToUse = templateToUse.getParent();
            }

            if (templateToUse) {
                for (let trace of traces) {
                    if (!trace.getFileName() || !trace.getLineNumber() || file != trace.getFileName()) {
                        continue;
                    }

                    for (let [codeLine, templateLine] of templateToUse.getDebugInfo()) {
                        if (codeLine <= trace.getLineNumber()) {
                            // update template line
                            this.lineno = templateLine;
                            this.fileName = trace.getFileName();

                            return;
                        }
                    }
                }
            }
        }
    }
}
