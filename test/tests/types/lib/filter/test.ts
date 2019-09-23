import {TwingFilter} from '../../../../../build/main';

new TwingFilter('foo', () => {}, {
    alternative: new TwingFilter('alternative', () => {})
});
