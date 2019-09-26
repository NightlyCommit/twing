const strip_tags = require('locutus/php/strings/strip_tags');

export function striptags() {
    return strip_tags(...arguments);
}
