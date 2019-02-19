import {TwingFilter} from '../../../../../build';

new TwingFilter('foo', () => {}, {
    alternative: new TwingFilter('alternative', () => {})
});
