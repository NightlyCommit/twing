import {TwingEnvironment} from "../environment";
import {TwingCacheInterface} from "../cache-interface";
import {TwingCacheFilesystem} from "../cache/filesystem";

export class TwingEnvironmentNode extends TwingEnvironment {
    cacheFromString(cache: string): TwingCacheInterface {
        return new TwingCacheFilesystem(cache);
    }
}
