import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";

/**
 * Noop implementation of TwingLoaderInterface.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderNull implements TwingLoaderInterface {
    TwingLoaderInterfaceImpl: TwingLoaderInterface;

    exists(name: string, from: TwingSource): boolean {
        return false;
    }

    getCacheKey(name: string, from: TwingSource): string {
        return name;
    }

    getSourceContext(name: string, from: TwingSource): TwingSource {
        throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
    }

    isFresh(name: string, time: number, from: TwingSource): boolean {
        return true;
    }

    resolve(name: string, from: TwingSource): string {
        return name;
    }
}
