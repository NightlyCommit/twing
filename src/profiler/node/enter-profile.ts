import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import DoDisplayHandler from "../../do-display-handler";
import TwingExtensionProfiler from "../../extension/profiler";
import TwingProfilerProfile from "../profile";

/**
 * Represents a profile enter node.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
class TwingProfilerNodeEnterProfile extends TwingNode {
    constructor(extensionName: string, type: string, name: string, varName: string) {
        super(new TwingMap(), new TwingMap([['extension_name', extensionName], ['name', name], ['type', type], ['var_name', varName]]));
    }

    compile(compiler: TwingCompiler): DoDisplayHandler {
        let varName = this.getAttribute('var_name');
        let extensionName = this.getAttribute('extension_name');
        let environment = compiler.getEnvironment();

        let extension = environment.getExtension(extensionName) as TwingExtensionProfiler;
        let profile = new TwingProfilerProfile(this.getAttribute('type'), this.getAttribute('name'));

        TwingExtensionProfiler.context.set(varName, extension);
        TwingExtensionProfiler.context.set(`${varName}_prof`, profile);

        return () => {
            extension.enter(profile);
        }
    }
}

export default TwingProfilerNodeEnterProfile;