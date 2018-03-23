const unserialize = require('locutus/php/var/unserialize');
const serialize = require('locutus/php/var/serialize');

export class TwingProfilerProfile {
    static ROOT = 'ROOT';
    static BLOCK = 'block';
    static TEMPLATE = 'template';
    static MACRO = 'macro';

    private template: string;
    private name: string;
    private type: string;
    private starts: Map<string, any> = new Map();
    private ends: Map<string, any> = new Map();
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

    static unserialize(data: string) {
        let result = new TwingProfilerProfile();
        let resultData: any = unserialize(data);

        result.template = resultData.template;
        result.name = resultData.name;
        result.type = resultData.type;
        result.starts = new Map(resultData.starts);
        result.ends = new Map(resultData.ends);
        result.profiles = [];

        for (let profileData of resultData.profiles) {
            let profile = new TwingProfilerProfile(
                profileData.template,
                profileData.type,
                profileData.name
            );

            result.profiles.push(profile);
        }

        return result;
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

        this.starts = new Map([
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

        this.ends = new Map([
            ['wt', new Date().getTime()],
            ['mu', memoryUsage.rss],
            ['pmu', memoryUsage.rss],
        ]);
    }

    reset() {
        this.profiles = [];
        this.starts = this.ends = new Map();
        this.enter();
    }

    getIterator() {
        return this.profiles[Symbol.iterator];
    }

    serialize(): string {
        return serialize([this.template, this.name, this.type, this.starts, this.ends, this.profiles]);
    }
}
