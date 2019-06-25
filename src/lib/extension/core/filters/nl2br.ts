const nl2br = require('locutus/php/strings/nl2br');

export function twingFilterNl2br() {
    return nl2br(...arguments);
}
