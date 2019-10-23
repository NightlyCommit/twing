const strip_tags = require('locutus/php/strings/strip_tags');

export function striptags(...args: any[]): Promise<string> {
    return Promise.resolve(strip_tags(...args));
}
