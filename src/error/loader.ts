import {TwingError} from "../error";
import {TwingSource} from "../source";

/**
 * Exception thrown when an error occurs during template loading.
 *
 * Automatic template information guessing is always turned off as
 * if a template cannot be loaded, there is nothing to guess.
 * However, when a template is loaded from another one, then, we need
 * to find the current context and this is automatically done by
 * Twig_Template::displayWithErrorHandling().
 *
 * This strategy makes Twig_Environment::resolveTemplate() much faster.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingErrorLoader extends TwingError {
    constructor(message: string, lineno: number = -1, source: TwingSource | string | null = null, previous: Error = null) {
        super('', lineno, source, previous);

        this.appendMessage(message);
        // this.setTemplateLine(false);
    }
}
