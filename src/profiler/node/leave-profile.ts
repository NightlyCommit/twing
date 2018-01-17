import TwingNode from "../../node";
import TwingMap from "../../map";
import TwingCompiler from "../../compiler";
import TwingExtensionProfiler from "../../extension/profiler";
import TwingProfilerProfile from "../profile";

class TwingProfilerNodeLeaveProfile extends TwingNode {
    constructor(varName: string) {
        super(new TwingMap(), new TwingMap([['var_name', varName]]));
    }

    compile(compiler: TwingCompiler) {
        let varName = this.getAttribute('var_name');
        let extension = TwingExtensionProfiler.context.get(varName) as TwingExtensionProfiler;
        let profile = TwingExtensionProfiler.context.get(`${varName}_prof`) as TwingProfilerProfile;

        return () => {
            extension.leave(profile);
        }
    }
}

export default TwingProfilerNodeLeaveProfile;