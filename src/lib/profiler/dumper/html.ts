import {TwingProfilerDumperBase} from "./base";
import {TwingProfilerProfile} from "../profile";

/**
 * @author Eric MORAND <eric.morand@gmail.com>
 */
export class TwingProfilerDumperHtml extends TwingProfilerDumperBase {
    private static colors: any = {
        block: '#dfd',
        macro: '#ddf',
        template: '#ffd',
        big: '#d44'
    };

    dump(profile: TwingProfilerProfile) {
        return '<pre>' + super.dump(profile) + '</pre>';
    }

    protected formatTemplate(profile: TwingProfilerProfile, prefix: string) {
        return `${prefix}└ <span style="background-color: ${TwingProfilerDumperHtml.colors['template']}">${profile.getTemplate()}</span>`;
    }

    protected formatNonTemplate(profile: TwingProfilerProfile, prefix: string) {
        let color: string = TwingProfilerDumperHtml.colors[profile.getType()];

        return `${prefix}└ ${profile.getTemplate()}::${profile.getType()}(<span style="background-color: ${color}">${profile.getName()}</span>)`;
    }

    protected formatTime(profile: TwingProfilerProfile, percent: number) {
        let color: string = TwingProfilerDumperHtml.colors['big'];

        return `<span style="color: ${color}">${(profile.getDuration() * 1000).toFixed(2)}ms/${percent}%</span>`;
    }
}
