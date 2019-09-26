import {TwingFunction} from '../../../../../dist/cjs/main';

new TwingFunction('foo', () => {}, [], {
    alternative: new TwingFunction('alternative', () => {}, [])
});
