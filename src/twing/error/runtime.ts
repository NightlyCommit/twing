import {TwingError} from "../error";
import {TwingTemplate} from "../template";
import {TwingSource} from "../source";

export class TwingErrorRuntime extends TwingError {
    constructor(message: string, template: TwingTemplate = null, lineno: number = -1, source: TwingSource | string | null = null, previous: Error = null) {
        super(message, lineno, source, previous, template);
    }
}
