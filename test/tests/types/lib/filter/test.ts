import {TwingFilter} from '../../../../../build/index';

new TwingFilter('foo', () => {}, {
    alternative: new TwingFilter('alternative', () => {})
});
