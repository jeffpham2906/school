export const throttle = (func, delay: number) => {
  let toThrottle = false
  return async function (...args: []) {
    if (!toThrottle) {
      toThrottle = true
      await func(args)
      setTimeout(() => {
        toThrottle = false
      }, delay)
    }
  }
}
