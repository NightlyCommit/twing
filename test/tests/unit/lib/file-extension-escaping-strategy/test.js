const {TwingFileExtensionEscapingStrategy} = require('../../../../../build/main');

const tap = require('tape');

tap.test('file-extension-escaping-strategy', function (test) {
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