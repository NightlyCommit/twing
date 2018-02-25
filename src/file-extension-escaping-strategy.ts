const path = require('path');

export class TwingFileExtensionEscapingStrategy {
    /**
     * Guesses the best autoescaping strategy based on the file name.
     *
     * @param {string} name The template name
     *
     * @return string | Function | false The escaping strategy to use or false to disable
     */
    static guess(name: string) {
        // if (in_array(substr($name, -1), array('/', '\\'))) {
        //     return 'html'; // return html for directories
        // }

        let extension = path.extname(name);

        if (extension === '.twig') {
            name = path.basename(name, extension);

            extension = path.extname(name);
        }

        switch (extension) {
            case '.js':
                return 'js';

            case '.css':
                return 'css';

            case '.txt':
                return false;

            default:
                return 'html';
        }
    }
}
