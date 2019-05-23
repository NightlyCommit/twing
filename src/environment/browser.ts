import {TwingEnvironment} from "../environment";
import {TwingCacheInterface} from "../cache-interface";
import {TwingCacheNull} from "../cache/null";

export class TwingEnvironmentBrowser extends TwingEnvironment {
    cacheFromString(cache: string): TwingCacheInterface {
        return new TwingCacheNull();
    }
}
