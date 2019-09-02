import { isString } from '../object'

export function isTextEmpty(str) {
    if (!isString(str)) {
        return true;
    }
    return !str.length;
}

export function isTextEitherEmpty(...strs) {
    for (const str of strs) {
        if (isTextEmpty(str)) {
            return true;
        }
    }
    return false;
}
