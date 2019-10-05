const strip_tags = require('locutus/php/strings/strip_tags');

export function striptags(...args: any[]) {
    return strip_tags(...args);
}
