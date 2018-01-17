import TwingEnvironment from "../environment";

const ucwords = require('locutus/php/strings/ucwords');

export default function twingTitle(env: TwingEnvironment, value: string) {
    return ucwords(value.toLowerCase());
}