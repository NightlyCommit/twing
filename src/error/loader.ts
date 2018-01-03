import TwingError from "../error";
import TwingSource from "../source";

class TwingErrorLoader extends TwingError {
    constructor(message: string, lineno: number = -1, source: TwingSource | string | null = null, previous: Error = null) {
        super(message, lineno, source, previous);

        // this.appendMessage(message);
        this.setTemplateLine(false);
    }
}

export default TwingErrorLoader;