import TwingLoaderInterface from "../loader-interface";
import TwingSource from "../source";
import TwingErrorLoader from "../error/loader";

/**
 * Loads template from the filesystem.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
class TwingLoaderArray implements TwingLoaderInterface {
    private templates: Map<string, string>;

    constructor(templates: Map<string, string>) {
        this.templates = templates;
    }

    setTemplate(name: string, template: string) {
        this.templates.set(name, template);
    }

    getSourceContext(name: string): TwingSource {
        if (!this.exists(name)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`);
        }

        return new TwingSource(this.templates.get(name), name);
    }

    exists(name: string) {
        return this.templates.has(name);
    }

    getCacheKey(name: string): string {
        if (!this.exists(name)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`);
        }

        return name + ':' + this.templates.get(name);
    }

    isFresh(name: string, time: number): boolean {
        if (!this.exists(name)) {
            throw new Error(`Template "${name}" is not defined.`);
        }

        return true;
    }
}

export = TwingLoaderArray;