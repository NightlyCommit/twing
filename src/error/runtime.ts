import {TwingError} from "../error";
import {TwingSource} from "../source";

export class TwingErrorRuntime extends TwingError {
    constructor(message: string, lineno: number = -1, source: TwingSource | string | null = null, previous?: Error) {
        super(message, lineno, source, previous);

        this.name = 'TwingErrorRuntime';
    }
}
