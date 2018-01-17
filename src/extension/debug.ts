import TwingExtension from "../extension";
import TwingFunction from "../function";

import twingVarDump from '../util/var-dump';

export class TwingExtensionDebug extends TwingExtension {
    getFunctions() {
        let isDumpOutputHtmlSafe = true;

        return [
            new TwingFunction('dump', twingVarDump, {
                is_safe: isDumpOutputHtmlSafe ? ['html'] : [],
                needs_context: true,
                needs_environment: true
            }),
        ];
    }
}

export default TwingExtensionDebug;