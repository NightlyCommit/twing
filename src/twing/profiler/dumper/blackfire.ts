import {TwingProfilerProfile} from "../profile";
import {TwingMap} from "../../map";

/**
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingProfilerDumperBlackfire {
    dump(profile: TwingProfilerProfile) {
        let data: TwingMap<string, {}> = new TwingMap();
        this.dumpProfile('main()', profile, data);
        this.dumpChildren('main()', profile, data);

        let start = `${new Date().getTime() / 1000}`;
        let str = `file-format: BlackfireProbe
cost-dimensions: wt mu pmu
request-start: ${start}

`;

        for (let [name, values] of data) {
            str += `${name}//${values['ct']} ${values['wt']} ${values['mu']} ${values['pmu']}\n`;
        }

        return str;
    }

    private dumpChildren(parent: string, profile: TwingProfilerProfile, data: TwingMap<string, {}>) {
        let name: string;
        for (let p of profile.getProfiles()) {

            if (p.isTemplate()) {
                name = p.getTemplate();
            }
            else {
                name = `${p.getTemplate()}::${p.getType()}(${p.getName()})`;
            }
            this.dumpProfile(`${parent}==>${name}`, p, data);
            this.dumpChildren(name, p, data);
        }
    }

    private dumpProfile(edge: string, profile: TwingProfilerProfile, data: TwingMap<string, {}>) {
        if (data.has(edge)) {
            let edgeObject = data.get(edge);

            edgeObject['ct'] += 1;
            edgeObject['wt'] += Math.floor(profile.getDuration() * 1000000);
            edgeObject['mu'] += profile.getMemoryUsage();
            edgeObject['pmu'] += profile.getPeakMemoryUsage();
        }
        else {
            data.set(edge, {
                'ct': 1,
                'wt': Math.floor(profile.getDuration() * 1000000),
                'mu': profile.getMemoryUsage(),
                'pmu': profile.getPeakMemoryUsage(),
            });
        }
    }
}
