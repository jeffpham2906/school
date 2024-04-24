export class VietnamTime {
  static getVNTime(utcDateStr: string) {
    const utcDate = new Date(utcDateStr)
    const vietnamTimezoneOffset = 7 * 60 // Offset in minutes
    const vietnamTime = new Date(
      utcDate.getTime() + vietnamTimezoneOffset * 60000
    )
    return `${vietnamTime.getDay() + 1}/${vietnamTime.getMonth() + 1}/${vietnamTime.getFullYear()}`
  }
}
