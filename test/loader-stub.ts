import TwingLoaderInterface from "../src/loader-interface";
import TwingSource from "../src/source";

class TwingTestLoaderStub implements TwingLoaderInterface {
    getSourceContext(name: string): TwingSource {
        return new TwingSource('', 'foo.twig');
    }

    getCacheKey(name: string): string {
        return '';
    }

    isFresh(name: string, time: number): boolean {
        return true;
    }

    exists(name: string): boolean {
        return true;
    }

}

export default TwingTestLoaderStub;