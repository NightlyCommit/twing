import TwingLoaderInterface from "../loader-interface";
import TwingSource from "../source";

/**
 * Loads template from the filesystem.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
class TwingLoaderFilesystem implements TwingLoaderInterface {
    getSourceContext(name: string): TwingSource {
        return undefined;
    }

    getCacheKey(name: string): string {
        return undefined;
    }

    isFresh(name: string, time: number): boolean {
        return undefined;
    }

    exists(name: string): boolean {
        return undefined;
    }

}

export default TwingLoaderFilesystem;