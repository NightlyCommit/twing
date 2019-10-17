const locutusNl2br = require('locutus/php/strings/nl2br');

export function nl2br(): Promise<string> {
    return Promise.resolve(locutusNl2br(...arguments));
}
