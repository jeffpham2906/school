import type { Teacher } from '~/types/teacher.types'

export default function getDiffObject<T>(srcObj: T, targetObj: T) {
  const diff = {}

  for (const key in targetObj) {
    if (Object.prototype.hasOwnProperty.call(srcObj, key)) {
      if (srcObj[key as keyof T] !== targetObj[key as keyof T]) {
        //@ts-expect-error Key
        diff[key] = targetObj[key as keyof Teacher]
      }
    } else {
      //@ts-expect-error Key
      diff[key] = targetObj[key]
    }
  }
  return diff
}
