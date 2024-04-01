import type { Teacher } from '~/types/teacher.types'

export default function getDiffObject(srcObj: Teacher, targetObj: Teacher) {
  const diff = {}

  for (const key in targetObj) {
    if (Object.prototype.hasOwnProperty.call(srcObj, key)) {
      if (srcObj[key as keyof Teacher] !== targetObj[key as keyof Teacher]) {
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
