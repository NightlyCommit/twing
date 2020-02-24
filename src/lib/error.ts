import {TwingSource} from "./source";

/**
 * Twing base error.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingError extends Error {
    private lineno: number | boolean;
    private rawMessage: string = null;
    private source: TwingSource = null;
    private previous: Error = null;

    protected type: string;

    constructor(message: string, lineno: number = -1, source?: TwingSource, previous?: Error) {
        super(message);

        this.name = 'TwingError';
        this.previous = previous;

        if (previous) {
            this.stack = previous.stack;
        }

        this.rawMessage = message;
        this.lineno = lineno;
        this.source = source;

        this.updateRepr();
    }

    getMessage() {
        return this.message;
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
     * @return {TwingSource}
     */
    getSourceContext() {
        return this.source;
    }

    /**
     * Sets the source context of the Twig template where the error occurred.
     */
    setSourceContext(source: TwingSource) {
        this.source = source;

        this.updateRepr();
    }

    appendMessage(rawMessage: string) {
        this.rawMessage += rawMessage;

        this.updateRepr();
    }

    private updateRepr() {
        this.message = this.rawMessage;

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

        if (this.source) {
            this.message += ` in "${this.source.getFQN()}"`;
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
