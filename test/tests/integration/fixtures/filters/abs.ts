import TestBase from "../../TestBase";
import {TwingEnvironmentOptions} from "../../../../../src/lib/environment-options";

export default class extends TestBase {
    getDescription() {
        return '"abs" filter';
    }

    getTemplates() {
        return {
            'index.twig': `
{{ (-5.5)|abs }}
{{ (-5)|abs }}
{{ (-0)|abs }}
{{ 0|abs }}
{{ 5|abs }}
{{ 5.5|abs }}
{{ number1|abs }}
{{ number2|abs }}
{{ number3|abs }}
{{ number4|abs }}
{{ number5|abs }}
{{ number6|abs }}`
        };
    }

    getExpected() {
        return `
5.5
5
0
0
5
5.5
5.5
5
0
0
5
5.5
`;
    }

    getContext() {
        return {
            number1: 5.5,
            number2: -5,
            number3: -0,
            number4: 0,
            number5: 5,
            number6: 5.5
        }
    }
}
