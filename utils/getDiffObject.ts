import type { Teacher } from '~/types/teacher.types'

export default function getDiffObject(srcObj: Teacher, targetObj: Teacher) {
  const diff = {}

  for (const key in srcObj) {
    console.log(key)
    if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
      if (srcObj[key as keyof Teacher] !== targetObj[key as keyof Teacher]) {
        //@ts-expect-error asd
        diff[key] = targetObj[key as keyof Teacher]
      }
    }
  }
  return diff
}
