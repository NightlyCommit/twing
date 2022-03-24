import {isMap} from "./is-map";

export const evaluate = (value: any): boolean => {
    if (value === '0' || (isMap(value) && value.size === 0)) {
        return false;
    }
    else if (isNaN(value)) {
        return true;
    }
    else {
        return value;
    }
};
