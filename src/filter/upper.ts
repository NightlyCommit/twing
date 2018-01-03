import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

class TwingFilterUpper extends TwingFilter {
    constructor(name: string) {
        let callable = function(env: TwingEnvironment, value: string) {
            // todo: use charset
            return value.toUpperCase();
        };

        super(name, callable, {
            needs_environment: true
        });
    }
}

export = TwingFilterUpper;