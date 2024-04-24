export function buildQuery(objToBuild: object) {
  const result = Object.entries(objToBuild).reduce((obj, [key, value]) => {
    if (value.length <= 1) {
      obj[key] = value[0]
    } else {
      value.forEach((value, index) => {
        const newKey = `${key}[${index}]`
        obj[newKey] = value
      })
    }
    return obj
  }, {})
  return result
}
