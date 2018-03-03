import {TwingMap} from "../map";

export class TwingProfilerProfile {
    static ROOT = 'ROOT';
    static BLOCK = 'block';
    static TEMPLATE = 'template';
    static MACRO = 'macro';

    private template: string;
    private name: string;
    private type: string;
    private starts: TwingMap<string, any> = new TwingMap();
    private ends: TwingMap<string, any> = new TwingMap();
    private profiles: Array<TwingProfilerProfile> = [];

    [Symbol.iterator] = this.profiles[Symbol.iterator];

    constructor(template: string = 'main', type: string = TwingProfilerProfile.ROOT, name: string = 'main') {
        // if (__CLASS__ !== get_class($this)) {
        //     @trigger_error('Overriding '.__CLASS__.' is deprecated since version 2.4.0 and the class will be final in 3.0.', E_USER_DEPRECATED);
        // }

        this.template = template;
        this.type = type;
        this.name = (name.indexOf('__internal_') === 0) ? 'INTERNAL' : name;
        this.enter();
    }

    getTemplate() {
        return this.template;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }

    isRoot() {
        return this.type === TwingProfilerProfile.ROOT;
    }

    isTemplate() {
        return this.type === TwingProfilerProfile.TEMPLATE;
    }

    isBlock() {
        return this.type === TwingProfilerProfile.BLOCK;
    }

    isMacro() {
        return this.type === TwingProfilerProfile.MACRO;
    }

    getProfiles() {
        return this.profiles;
    }

    addProfile(profile: TwingProfilerProfile) {
        this.profiles.push(profile);
    }

    /**
     * Returns the duration in microseconds.
     *
     * @return int
     */
    getDuration() {
        if (this.isRoot() && this.profiles.length > 0) {
            // for the root node with children, duration is the sum of all child durations
            let duration = 0;

            for (let profile of this.profiles) {
                duration += profile.getDuration();
            }

            return duration;
        }

        return this.ends.has('wt') && this.starts.has('wt') ? this.ends.get('wt') - this.starts.get('wt') : 0;
    }

    /**
     * Returns the memory usage in bytes.
     *
     * @return int
     */
    getMemoryUsage() {
        return this.ends.has('mu') && this.starts.has('mu') ? this.ends.get('mu') - this.starts.get('mu') : 0;
    }

    /**
     * Returns the peak memory usage in bytes.
     *
     * @return int
     */
    getPeakMemoryUsage() {
        return this.ends.has('pmu') && this.starts.has('pmu') ? this.ends.get('pmu') - this.starts.get('pmu') : 0;
    }

    /**
     * Starts the profiling.
     */
    enter() {
        let memoryUsage = process.memoryUsage();

        this.starts = new TwingMap([
            ['wt', new Date().getTime()],
            ['mu', memoryUsage.rss],
            ['pmu', memoryUsage.rss],
        ]);
    }

    /**
     * Stops the profiling.
     */
    leave() {
        let memoryUsage = process.memoryUsage();

        this.ends = new TwingMap([
            ['wt', new Date().getTime()],
            ['mu', memoryUsage.rss],
            ['pmu', memoryUsage.rss],
        ]);
    }

    reset() {
        this.profiles = [];
        this.starts = this.ends = new TwingMap();
        this.enter();
    }

    // make no sense in JavaScript
    // serialize(): string {
    //     return JSON.stringify([this.template, this.name, this.type, this.starts, this.ends, this.profiles]);
    // }
    //
    // unserialize(data: string) {
    //     [this.template, this.name, this.type, this.starts, this.ends, this.profiles] = JSON.parse(data);
    // }
}
