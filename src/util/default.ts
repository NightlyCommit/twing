import isEmpty from '../util/is-empty';

export default function twingDefault(value: any, defaultValue: any = '') {
    if (isEmpty(value)) {
        return defaultValue;
    }

    return value;
}