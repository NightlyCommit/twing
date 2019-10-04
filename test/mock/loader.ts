import {TwingSource} from "../../src/lib/source";
import {TwingLoaderNull} from "../../src/lib/loader/null";

export class MockLoader extends TwingLoaderNull {
    getSourceContext(name: string) {
        return new TwingSource('', '', '');
    }

    getCacheKey(name: string) {
        return '';
    }

    isFresh(name: string, time: number) {
        return true;
    }

    exists(name: string) {
        return true;
    }
};
