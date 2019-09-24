import {TwingFunction} from '../../../../../build/main';

new TwingFunction('foo', () => {}, [], {
    alternative: new TwingFunction('alternative', () => {}, [])
});
