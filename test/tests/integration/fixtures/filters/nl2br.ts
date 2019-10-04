import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"nl2br" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "I like Twig.\\nYou will like it too.\\n\\nEverybody like it!"|nl2br }}
{{ text|nl2br }}`
        };
    }

    getExpected() {
        return `
I like Twig.<br />
You will like it too.<br />
<br />
Everybody like it!
If you have some &lt;strong&gt;HTML&lt;/strong&gt;<br />
it will be escaped.`;
    }

    getContext() {
        return {
            text: 'If you have some <strong>HTML</strong>\nit will be escaped.',
        }
    }
}
