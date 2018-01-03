import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

class TwingFilterJsonEncode extends TwingFilter {
    constructor(name: string) {
        let callable = JSON.stringify;

        super(name, callable);
    }
}

export = TwingFilterJsonEncode;