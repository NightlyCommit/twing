import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

class TwingFilterRaw extends TwingFilter {
    constructor(name: string) {
        let callable = function(value: string) {
            return value
        };

        super(name, callable, {
            is_safe: ['all']
        });
    }
}

export = TwingFilterRaw;