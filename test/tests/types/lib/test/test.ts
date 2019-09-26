import {TwingTest} from '../../../../../dist/cjs/main';

new TwingTest('foo', () => {
    return true;
}, [], {
    alternative: new TwingTest('alternative', () => {
        return true
    }, [])
});
