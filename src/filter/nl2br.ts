import TwingFilter from "../filter";
import TwingEnvironment = require("../environment");

const nl2br = require('locutus/php/strings/nl2br');

class TwingFilterNl2br extends TwingFilter {
    constructor(name: string) {
        let callable = nl2br;

        super(name, callable, {
            pre_escape: 'html',
            is_safe: ['html']
        });
    }
}

export = TwingFilterNl2br;