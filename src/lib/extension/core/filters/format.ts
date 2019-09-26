const sprintf = require('locutus/php/strings/sprintf');

export function format(...args: any[]) {
    return sprintf(...args);
}
