const sprintf = require('locutus/php/strings/sprintf');

export function format(...args: any[]): Promise<string> {
    return Promise.resolve(sprintf(...args));
}
