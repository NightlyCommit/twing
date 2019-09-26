import {TwingFilter} from '../../../../../dist/cjs/main';

new TwingFilter('foo', () => {}, [], {
    alternative: new TwingFilter('alternative', () => {}, [])
});
