import {TwingLoaderInterface} from "../loader-interface";
import {TwingSource} from "../source";
import {TwingErrorLoader} from "../error/loader";

/**
 * Loads template from the filesystem.
 *
 * @author Fabien Potencier <fabien@symfony.com>
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingLoaderArray implements TwingLoaderInterface {
    TwingLoaderInterfaceImpl: TwingLoaderInterface;

    private templates: Map<string, string>;

    constructor(templates: any) {
        this.TwingLoaderInterfaceImpl = this;

        let map = new Map();

        if (Array.isArray(templates)) {
            let i: number = 0;

            for (let template of templates) {
                map.set(i++, template);
            }
        }
        else if (typeof templates[Symbol.iterator] === 'function') {
            for (let [name, template] of templates) {
                map.set(name, template);
            }
        }
        else if (typeof templates === 'object') {
            for (let name in templates) {
                map.set(name, templates[name]);
            }
        }

        this.templates = map;
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
            throw new TwingErrorLoader(`Template "${name}" is not defined.`);
        }

        return true;
    }
}
