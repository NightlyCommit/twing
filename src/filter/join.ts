import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

class TwingFilterJoin extends TwingFilter {
    constructor(name: string) {
        let callable = function(value: Array<any>, glue: string = '') {
            return value.join(glue);
        };

        super(name, callable);
    }
}

export = TwingFilterJoin;