import {TwingCacheInterface} from "../cache-interface";
import {TwingTemplatesModule} from "../environment";

/**
 * Implements a no-cache strategy.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingCacheNull implements TwingCacheInterface {
    generateKey(name: string, className: string): Promise<string> {
        return Promise.resolve('');
    }

    write(key: string, content: string): Promise<void> {
        return Promise.resolve();
    }

    load(key: string): Promise<TwingTemplatesModule> {
        return Promise.resolve(() => {
            return new Map();
        });
    }

    getTimestamp(key: string): Promise<number> {
        return Promise.resolve(0);
    }
}
