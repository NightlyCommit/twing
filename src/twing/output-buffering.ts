import {isNullOrUndefined} from "util";

export class TwingOutputHandler {
    static readonly OUTPUT_HANDLER_CLEANABLE = 0x0010;
    static readonly OUTPUT_HANDLER_FLUSHABLE = 0x0020;
    static readonly OUTPUT_HANDLER_REMOVABLE = 0x0040;
    static readonly OUTPUT_HANDLER_STDFLAGS = 0x0070;

    private content: string;
    private name: string;
    private level: number;
    private flags: number;

    constructor(level: number, flags: number) {
        this.content = '';
        this.name = this.constructor.name;
        this.level = level;
        this.flags = flags;
    }

    getContent() {
        return this.content;
    }

    getName(): string {
        return this.name;
    }

    getLevel(): number {
        return this.level;
    }

    getFlags(): number {
        return this.flags;
    }

    write(value: string) {
        this.content = value;
    }

    append(value: string) {
        this.content += value;
    }
}

export class TwingOutputBuffering {
    static handlers: Array<TwingOutputHandler> = [];

    static echo(string: any) {
        if (typeof string === 'boolean') {
            string = (string === true) ? '1' : '';
        }
        else if (isNullOrUndefined(string)) {
            string = '';
        }

        return TwingOutputBuffering.outputWrite(string);
    }

    /**
     * Turn on Output Buffering (specifying an optional output handler).
     *
     * @returns {boolean}
     */
    static obStart() {
        let handler = new TwingOutputHandler(TwingOutputBuffering.obGetLevel() + 1, TwingOutputHandler.OUTPUT_HANDLER_STDFLAGS);

        TwingOutputBuffering.handlers.push(handler);

        return true;
    }

    /**
     * Flush (send) contents of the output buffer. The last buffer content is sent to next buffer
     *
     * In human terms, append the top-most buffer to the second-top-most buffer and empty the top-most buffer
     *
     * ┌─────────┐    ┌─────────┐
     * │   oof   │    │         │
     * ├─────────┤    ├─────────┤
     * │   bar   │ => │  baroof │
     * ├─────────┤    ├─────────┤
     * │   foo   │    │   foo   │ => true
     * └─────────┘    └─────────┘
     *
     */
    static obFlush() {
        let active = TwingOutputBuffering.getActive();

        if (!active) {
            console.warn('failed to flush buffer. No buffer to flush');

            return false;
        }

        if (!(active.getFlags() & TwingOutputHandler.OUTPUT_HANDLER_FLUSHABLE)) {
            console.warn(`failed to flush buffer of ${TwingOutputBuffering.getActive().getName()} (${TwingOutputBuffering.getActive().getLevel()})`);

            return false;
        }

        let orphan = TwingOutputBuffering.getActive();

        if (orphan) {
            TwingOutputBuffering.handlers.pop();
            TwingOutputBuffering.outputWrite(orphan.getContent());
        }

        active.write('');

        TwingOutputBuffering.handlers.push(active);

        return true;
    }

    /**
     * Alias for TwingOutputBuffering.obFlush
     *
     * @returns {boolean}
     */
    static flush() {
        return TwingOutputBuffering.obFlush();
    }

    /**
     * Flush (send) the output buffer, and delete current output buffer
     *
     * In human terms: append the top-most buffer to the second-top-most buffer and remove the top-most buffer
     *
     * ┌─────────┐
     * │   oof   │
     * ├─────────┤    ┌─────────┐
     * │   bar   │ -> │  baroof │
     * ├─────────┤    ├─────────┤
     * │   foo   │    │   foo   │ => true
     * └─────────┘    └─────────┘
     *
     * @returns {boolean}
     */
    static obEndFlush(): boolean {
        if (!TwingOutputBuffering.getActive()) {
            console.warn('failed to delete and flush buffer. No buffer to delete or flush');
        }

        if (TwingOutputBuffering.obFlush()) {
            TwingOutputBuffering.handlers.pop();

            return true;
        }

        return false;
    }

    /**
     * Get active buffer contents, flush (send) the output buffer, and delete active output buffer
     *
     * In human terms: append the top-most buffer to the second-top-most buffer, remove the top-most buffer and returns its content
     *
     * ┌─────────┐
     * │   oof   │
     * ├─────────┤    ┌─────────┐
     * │   bar   │ -> │  baroof │
     * ├─────────┤    ├─────────┤
     * │   foo   │    │   foo   │ => oof
     * └─────────┘    └─────────┘
     *
     * @returns {string | false}
     */
    static obGetFlush(): string | false {
        let content = TwingOutputBuffering.obGetContents();

        TwingOutputBuffering.obEndFlush();

        return content;
    }

    /**
     * Clean (erase) the output buffer
     *
     * In human terms, empty the top-most buffer
     *
     * ┌─────────┐    ┌─────────┐
     * │   oof   │    │         │
     * ├─────────┤    ├─────────┤
     * │   bar   │ => │   bar   │
     * ├─────────┤    ├─────────┤
     * │   foo   │    │   foo   │ => true
     * └─────────┘    └─────────┘
     *
     */
    static obClean() {
        let active = TwingOutputBuffering.getActive();

        if (!active) {
            console.warn('failed to clean buffer. No buffer to clean');

            return false;
        }

        if (!(active.getFlags() & TwingOutputHandler.OUTPUT_HANDLER_CLEANABLE)) {
            console.warn(`failed to clean buffer of ${active.getName()} (${active.getLevel()})`);

            return false;
        }

        active.write('');

        return true;
    }

    /**
     * Clean the output buffer, and delete active output buffer
     *
     * In human terms: clean the top-most buffer and remove the top-most buffer
     *
     * ┌─────────┐
     * │   oof   │
     * ├─────────┤    ┌─────────┐
     * │   bar   │ -> │   bar   │
     * ├─────────┤    ├─────────┤
     * │   foo   │    │   foo   │ => true
     * └─────────┘    └─────────┘
     *
     * @returns {boolean}
     */
    static obEndClean(): boolean {
        if (TwingOutputBuffering.obClean()) {
            if (TwingOutputBuffering.getActive()) {
                TwingOutputBuffering.handlers.pop();

                return true;
            }
        }

        return false;
    }

    /**
     * Get active buffer contents and delete active output buffer
     *
     * In human terms: Remove the top-most buffer and returns its content
     *
     * ┌─────────┐
     * │   oof   │
     * ├─────────┤    ┌─────────┐
     * │   bar   │ -> │   bar   │
     * ├─────────┤    ├─────────┤
     * │   foo   │    │   foo   │ => oof
     * └─────────┘    └─────────┘
     *
     * @returns {string | false}
     */
    static obGetClean(): string | false {
        let content = TwingOutputBuffering.obGetContents();

        TwingOutputBuffering.obEndClean();

        return content;
    }

    /**
     * Return the nesting level of the output buffering mechanism
     *
     * @returns {number}
     */
    static obGetLevel(): number {
        return TwingOutputBuffering.handlers ? TwingOutputBuffering.handlers.length : 0;
    }

    /**
     * Return the contents of the output buffer
     *
     * @returns {string | false}
     */
    static obGetContents(): string | false {
        return TwingOutputBuffering.getActive() ? TwingOutputBuffering.getActive().getContent() : false;
    }

    /**
     * Append the string to the top-most buffer or return  the string if there is none
     *
     * @param {string} string | void
     */
    private static outputWrite(string: string): string | void {
        let active = TwingOutputBuffering.getActive();

        if (active) {
            active.append(string);
        }
        else {
            process.stdout.write(string);
        }
    }

    private static getActive(): TwingOutputHandler {
        if (TwingOutputBuffering.handlers.length > 0) {
            return TwingOutputBuffering.handlers[TwingOutputBuffering.handlers.length - 1];
        }
        else {
            return null;
        }
    }
}

export const echo = TwingOutputBuffering.echo;
export const obStart = TwingOutputBuffering.obStart;
export const obEndClean = TwingOutputBuffering.obEndClean;
export const obGetClean = TwingOutputBuffering.obGetClean;
export const obGetContents = TwingOutputBuffering.obGetContents;
export const flush = TwingOutputBuffering.flush;
