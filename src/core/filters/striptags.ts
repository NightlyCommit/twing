const strip_tags = require('locutus/php/strings/strip_tags');

export function twingFilterStriptags() {
    return strip_tags(...arguments);
}
