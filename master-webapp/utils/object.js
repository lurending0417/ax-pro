const pick = require("lodash/pick")
const omit = require("lodash/omit")

Object.pick = (obj, path) => {
  if (obj == null) {
    return {}
  }

  if (path instanceof Array) {
    return pick(obj, path)
  }
  let predicate = path,
    result = {};


  for (const key in obj) {
    if (predicate(key, obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}

Object.omit = (obj, path) => {
  if (obj == null) {
    return {}
  }

  if (path instanceof Array) {
    return omit(obj, path)
  }
  let predicate = path,
    result = {};


  for (const key in obj) {
    if (!predicate(key, obj[key])) {
      result[key] = obj[key];
    }
  }
  return result;
}

Object.isEmpty = (obj) => {
  return !(obj && typeof obj == "object" && Object.keys(obj).length)
}
