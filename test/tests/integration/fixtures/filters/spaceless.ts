import TestBase from "../../TestBase";

export default class extends TestBase {
    getDescription() {
        return '"spaceless" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ "    <div>   <div>   foo   </div>   </div>"|spaceless }}
`
        };
    }

    getExpected() {
        return `
<div><div>   foo   </div></div>
`;
    }
}
