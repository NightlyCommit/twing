import TwingError from "../error";

const Levenshtein = require('levenshtein');

class TwingErrorSyntax extends TwingError {
    /**
     * Tweaks the error message to include suggestions.
     *
     * @param string $name  The original name of the item that does not exist
     * @param array  $items An array of possible items
     */
    addSuggestions(name: string, items: string[]) {
        let alternatives: string[] = [];
        let levenshtein = new Levenshtein();

        items.forEach(function (item) {
            levenshtein = new Levenshtein(name, item);

            if (levenshtein.distance <= (name.length / 3) || item.indexOf(name) > -1) {
                alternatives.push(item);
            }
        });

        if (alternatives.length < 1) {
            return;
        }

        alternatives.sort();

        this.appendMessage(` Did you mean "${alternatives.join(', ')}"?`);
    }
}

export default TwingErrorSyntax;