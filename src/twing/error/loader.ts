import {TwingError} from "../error";
import {TwingSource} from "../source";

/**
 * Exception thrown when an error occurs during template loading.
 *
 * Automatic template information guessing is always turned off as
 * if a template cannot be loaded, there is nothing to guess.
 * However, when a template is loaded from another one, then, we need
 * to find the current context and this is automatically done by
 * TwingTemplate::displayWithErrorHandling().
 *
 * This strategy makes TwingEnvironment::resolveTemplate() much faster.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingErrorLoader extends TwingError {
    constructor(message: string, lineno: number = -1, source: TwingSource | string | null = null, previous: Error = null) {
        super('', lineno, source, previous);

        this.appendMessage(message);
        this.setTemplateLine(false);
    }

    // @see Twig_Error_Loader::__construct for the reason to this
    init() {
    }
}
