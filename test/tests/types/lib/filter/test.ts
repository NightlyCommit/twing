import {TwingFilter} from '../../../../../build/filter';

new TwingFilter('foo', () => {}, {
    alternative: new TwingFilter('alternative', () => {})
});
