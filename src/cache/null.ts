import {TwingCacheInterface} from "../cache-interface";
import {TwingTemplate} from "../template";
import {TwingEnvironment} from "../environment";

/**
 * Implements a no-cache strategy.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 */
export class TwingCacheNull implements TwingCacheInterface {
    TwingCacheInterfaceImpl: TwingCacheInterface;

    constructor() {
        this.TwingCacheInterfaceImpl = this;
    }

    generateKey(name: string, hash: string): string {
        return '';
    }

    write(key: string, content: string) {
    }

    load(key: string): (Runtime: any) => { [s: string]: new(e: TwingEnvironment) => TwingTemplate } {
        return () => {
            return {};
        };
    }

    getTimestamp(key: string): number {
        return 0;
    }
}
