import TwingExtension from "../extension";
import TwingFunction from "../function";

import twingTemplateFromString from '../util/template-from-string';

export class TwingExtensionStringLoader extends TwingExtension {
    getFunctions() {
        return [
            new TwingFunction('template_from_string', twingTemplateFromString, {needs_environment: true}),
        ];
    }
}

export default TwingExtensionStringLoader;