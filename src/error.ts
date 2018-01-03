/**
 * Twing base error.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
import Source, {default as TwingSource} from "./source";
import {type} from "os";

class TwingError extends Error {
    sourceName: string;
    message: string;
    stack?: string;

    private lineno: number | boolean;
    private rawMessage: string;
    private sourcePath: string;
    private sourceCode: string;

    constructor(message: string, lineno: number = -1, source: Source | string | null = null, previous: Error = null) {
        super(message);

        this.name = this.constructor.name;

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

        if (lineno === -1 || sourceName === null || this.sourcePath === null) {
            // $this->guessTemplateInfo();
        }

        this.rawMessage = message;

        this.updateRepr();
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

    guess() {
        // this.guessTemplateInfo();
        this.updateRepr();
    }

    appendMessage(rawMessage: string) {
        this.rawMessage += rawMessage;

        this.updateRepr();
    }

    updateRepr() {
        this.message = this.rawMessage;

        if (this.sourcePath && this.lineno > 0) {
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
}

export default TwingError;