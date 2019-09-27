import {TwingError} from "../error";
import {TwingSource} from "../source";

/**
 * Exception thrown when an error occurs during template loading.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingErrorLoader extends TwingError {
    constructor(message: string, lineno: number, source: TwingSource) {
        super('', lineno, source);

        this.appendMessage(message);
        this.name = 'TwingErrorLoader';
    }
}
