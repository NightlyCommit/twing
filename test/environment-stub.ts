import TwingEnvironment from "../src/environment";
import TwingTemplate from "../src/template";
import TwingMap from "../src/map";
import TwingLoaderArray from "../src/loader/array";

class TwingTestEnvironmentStub extends TwingEnvironment {
    constructor(templates: TwingMap<string, TwingTemplate>) {
        super(new TwingLoaderArray(new TwingMap()));
        
        this.loadedTemplates = templates;
    }
}

export default TwingTestEnvironmentStub;