import {
  isObject,
  isArray,
  isString,
  isInteger,
  isEmpty,
  getType
} from "../object";

export function isKeyValid(key) {
  return isString(key) || isInteger(key);
}

export function parse(input, fallback = null) {
  let f = null;
  if (isObject(fallback)) {
    f = fallback;
  }

  if (!isString(input)) {
    return f;
  } else if (isObject(input)) {
    return input;
  }

  try {
    let res = JSON.parse(input);
    if (isObject(res)) {
      return res;
    }
    res = JSON.parse(res);
    if (isObject(res)) {
      return res;
    }
    return f;
  } catch (e) {
    return f;
  }
}

export function getObjLength(obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
}

export function parseA(input, fallback = null) {
  let f = null;
  if (isArray(fallback)) {
    f = fallback;
  }

  if (!isString(input)) {
    return f;
  } else if (isArray(input)) {
    return input;
  }

  try {
    let res = JSON.parse(input);
    if (isArray(res)) {
      return res;
    }
    res = JSON.parse(res);
    if (isArray(res)) {
      return res;
    }
    return f;
  } catch (e) {
    return f;
  }
}

export function stringify(object) {
  return JSON.stringify(object);
}

export function stringifyIgnoreNull(object) {
  return JSON.stringify(object, (key, value) => {
    if (!isEmpty(value)) {
      return value;
    }
  });
}

export function stringifyWithFormat(object) {
  return JSON.stringify(object, null, "\t");
}

export function has(object, key) {
  if (isObject(object) && isKeyValid(key)) {
    return object.hasOwnProperty(key);
  }
  return false;
}

export function safeGet(object, key, fallback = null) {
  if (isObject(object) && isKeyValid(key)) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      return value;
    } else {
      return fallback;
    }
  }
  return fallback;
}

export function safeGetWithType(object, key, fallback = null) {
  if (isObject(object) && isKeyValid(key)) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      const fallbackType = getType(fallback);
      if (fallbackType !== "undefined" && fallbackType !== "null") {
        if (getType(value) !== fallbackType) {
          return fallback;
        }
      }
      return value;
    } else {
      return fallback;
    }
  }
  return fallback;
}

export function safeSet(object, key, value) {
  if (isObject(object) && isKeyValid(key)) {
    if (!isEmpty(value)) {
      object[key] = value;
    } else {
      delete object[key];
    }
  }
}

export function safeDelete(object, key) {
  if (isObject(object) && isKeyValid(key)) {
    delete object[key];
  }
}

export function safeDeepGet(object, props, fallback = null) {
  if (isEmpty(object) || !isArray(props)) {
    return fallback;
  }

  if (props.length === 0) {
    return object;
  }

  const currentProps = props[0];
  if (!isKeyValid(currentProps)) {
    return fallback;
  }

  return safeDeepGet(object[currentProps], props.slice(1), fallback);
}

export function safeDeepGetWithType(object, props, fallback = null) {
  if (isEmpty(object) || !isArray(props)) {
    return fallback;
  }

  if (props.length === 0) {
    const fallbackType = getType(fallback);
    if (fallbackType !== "undefined" && fallbackType !== "null") {
      if (getType(object) !== fallbackType) {
        return fallback;
      }
    }
    return object;
  }

  const currentProps = props[0];
  if (!isKeyValid(currentProps)) {
    return fallback;
  }

  return safeDeepGetWithType(object[currentProps], props.slice(1), fallback);
}

export function isObjectEmpty(object) {
  return object.constructor === Object && Object.keys(object).length === 0;
}
