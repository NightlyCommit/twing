import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

class TwingFilterLower extends TwingFilter {
    constructor(name: string) {
        let callable = function(value: string) {
            // todo: use charset
            return value.toLowerCase();
        };

        super(name, callable);
    }
}

export = TwingFilterLower;