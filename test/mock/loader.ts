import {TwingSource} from "../../src/lib/source";
import {TwingLoaderNull} from "../../src/lib/loader/null";

export class MockLoader extends TwingLoaderNull {
    getSourceContext(name: string) {
        return Promise.resolve(new TwingSource('', '', ''));
    }

    getCacheKey(name: string) {
        return Promise.resolve('');
    }

    isFresh(name: string, time: number) {
        return Promise.resolve(true);
    }

    exists(name: string) {
        return Promise.resolve(true);
    }
}
