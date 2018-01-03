import TwingTemplate = require("./template");
import TwingMap from "./map";

class TwingTemplateMacro {
    macro: Function;
    template: TwingTemplate;
    // todo: use MethodArgument instead of any
    arguments: Array<any>;
}

export = TwingTemplateMacro;