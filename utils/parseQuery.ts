export const parseQuery = (label: string): string[] => {
  const route = useRoute()
  const parseInit = Object.keys(route.query).reduce((arr, key) => {
    if (key.includes(label)) {
      arr.push(route.query[key])
    }
    return arr
  }, [])
  return parseInit
}
