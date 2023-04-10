import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";

/**
 * Noop implementation of TwingLoaderInterface.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderNull implements TwingLoaderInterface {
    exists(name: string, from: TwingSource): Promise<boolean> {
        return Promise.resolve(false);
    }

    getCacheKey(name: string, from: TwingSource): Promise<string> {
        return Promise.resolve(name);
    }

    getSourceContext(name: string, from: TwingSource): Promise<TwingSource> {
        throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
    }

    isFresh(name: string, time: number, from: TwingSource): Promise<boolean> {
        return Promise.resolve(true);
    }

    resolve(name: string, from: TwingSource, shouldThrow: boolean = false): Promise<string> {
        if (shouldThrow) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
        }

        return Promise.resolve(null);
    }
}
