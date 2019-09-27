import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";
import {iteratorToMap} from "../helpers/iterator-to-map";

/**
 * Loads template from the filesystem.
 *
 * @author Eric MORAND <eric.morand@gmail.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderArray implements TwingLoaderInterface {
    TwingLoaderInterfaceImpl: TwingLoaderInterface;

    private templates: Map<string, string>;

    constructor(templates: any) {
        this.TwingLoaderInterfaceImpl = this;

        this.templates = iteratorToMap(templates);
    }

    setTemplate(name: string, template: string) {
        this.templates.set(name, template);
    }

    getSourceContext(name: string, from: TwingSource): TwingSource {
        if (!this.exists(name, from)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
        }

        return new TwingSource(this.templates.get(name), name);
    }

    exists(name: string, from: TwingSource) {
        return this.templates.has(name);
    }

    getCacheKey(name: string, from: TwingSource): string {
        if (!this.exists(name, from)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
        }

        return name + ':' + this.templates.get(name);
    }

    isFresh(name: string, time: number, from: TwingSource): boolean {
        if (!this.exists(name, from)) {
            throw new TwingErrorLoader(`Template "${name}" is not defined.`, -1, from);
        }

        return true;
    }

    resolve(name: string, from: TwingSource): string {
        return name;
    }
}
