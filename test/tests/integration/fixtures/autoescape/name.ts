import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return 'autoescape + "name" strategy';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ br -}}
{{ include('index.js.twig') -}}
{{ include('index.html.twig') -}}
{{ include('index.txt.twig') -}}`,
            'index.txt.twig': `
{{ br -}}`,
            'index.html.twig': `
{{ br -}}`,
            'index.js.twig': `
{{ br -}}`
        };
    }

    getExpected() {
        return `
&lt;br /&gt;
\\u003Cbr\\u0020\\/\\u003E
&lt;br /&gt;
<br />
`;
    }

    getContext() {
        return {
            br: '<br />'
        };
    }

    getEnvironmentOptions() {
        return {
            autoescape: 'name'
        };
    }
}
