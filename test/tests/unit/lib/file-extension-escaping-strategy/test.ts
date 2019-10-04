import * as tape from 'tape';
import {TwingFileExtensionEscapingStrategy} from "../../../../../src/lib/file-extension-escaping-strategy";

tape('file-extension-escaping-strategy', (test) => {
    test.same(TwingFileExtensionEscapingStrategy.guess('index.css'), 'css');
    test.same(TwingFileExtensionEscapingStrategy.guess('index.css.twig'), 'css');
    test.same(TwingFileExtensionEscapingStrategy.guess('index.html'), 'html');
    test.same(TwingFileExtensionEscapingStrategy.guess('index.html.twig'), 'html');
    test.same(TwingFileExtensionEscapingStrategy.guess('index.js'), 'js');
    test.same(TwingFileExtensionEscapingStrategy.guess('index.js.twig'), 'js');
    test.same(TwingFileExtensionEscapingStrategy.guess('index.txt'), false);
    test.same(TwingFileExtensionEscapingStrategy.guess('index.txt.twig'), false);

    test.end();
});