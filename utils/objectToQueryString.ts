export function objectToQueryString(obj: object) {
  let queryString = ''

  const encodeParams = (params: object, parentKey = '') => {
    Object.entries(params).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}[${key}]` : key
      if (typeof value === 'object' && !Array.isArray(value)) {
        encodeParams(value, newKey)
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          queryString += `${newKey}[${index}]=${item}&`
        })
      } else {
        queryString += `${newKey}=${value}&`
      }
    })
  }

  encodeParams(obj)
  return queryString.slice(0, -1)
}
