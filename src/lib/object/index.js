//
// ref: https://webbjocke.com/javascript-check-data-types/
//

// Returns if a value is a string
export function isString(value) {
  return typeof value === "string" || value instanceof String;
}

// Returns if a value is really a number
export function isNumber(value) {
  // if (typeof value === 'string' || value instanceof String){
  //     var valueInt = parseInt(value, 10);
  //     if (!isNaN(valueInt)){
  //         value = valueInt;
  //     }
  // }
  return typeof value === "number" && isFinite(value);
}

// Returns if a value is an array
export function isArray(value) {
  return value && typeof value === "object" && value.constructor === Array;
}

// Returns if a value is a function
export function isFunction(value) {
  return typeof value === "function";
}

// Returns if a value is an object
export function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}

// Returns if a value is null
export function isNull(value) {
  return value === null;
}

// Returns if a value is undefined
export function isUndefined(value) {
  return typeof value === "undefined";
}

// Returns if a value is a boolean
export function isBoolean(value) {
  return typeof value === "boolean";
}

// Returns if a value is a regexp
export function isRegExp(value) {
  return value && typeof value === "object" && value.constructor === RegExp;
}

// Returns if value is a date object
export function isDate(value) {
  return value instanceof Date;
}

// Returns if a Symbol
export function isSymbol(value) {
  return typeof value === "symbol";
}

export function isContainUppercase(str) {
  return /[A-Z]/.test(str);
}

export function hasWhiteSpace(str) {
  if (str.includes(" ")) return true;
  else return false;
}

//
// IOTERA
//

export function isColor(strColor) {
  var s = new Option().style;
  s.color = strColor;
  var test1 = s.color === strColor;
  var test2 = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(strColor);
  if (test1 === true || test2 === true) {
    return true;
  } else {
    return false;
  }
}

// Returns if a value is null or undefined
export function isEmpty(value) {
  return isNull(value) || isUndefined(value);
}

export function isEmptyString(value) {
  return isNull(value) || isUndefined(value) || value === "";
}
// Returns if a value is null or undefined
export function isEmptyObject(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

// Returns if an array is empty or null or undefined
export function isEmptyArr(arr) {
  if (arr.length > 0) {
    return false;
  }
  return true;
}

export function isEitherEmpty(...objs) {
  for (const obj of objs) {
    if (isEmpty(obj)) {
      return true;
    }
  }
  return false;
}

export function getType(value) {
  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
}

export function isInteger(value) {
  return Number.isInteger(value);
}

export function isFloat(value) {
  return Number(value) === value && value % 1 !== 0;
}

export function cleanObj(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
}
