import { isString } from "../object";

export const beautifyName = (name) => {
    if (isString(name))
        if (name.replace) {
            return name.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        } else {
            return name;
        }
};