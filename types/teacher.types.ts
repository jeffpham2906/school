import type { FileData } from '.'

export type Gender = 'male' | 'female' | 'other'
export type Type = 'official' | 'contract' | 'parttime'
export type Status = 'active' | 'disabled'

export interface Teacher {
  avatar?: FileData //optional
  teacherCode?: string //Mã giáo viên //Không cần gửi
  contracts?: FileData[] //Hợp đồng //optional
  email: string //Email //require
  phone: string //Phone //require
  dateOfBirth?: Date //Ngày sinh //optional
  name: string //Tên //require
  slug?: string //SLug //Không cần gửi
  gender?: Gender //"male" | "female" | "other"; // Giới tính //optional
  nationality?: string //Quốc tịch //optional
  healthInsuranceNumber?: string //Số thẻ BHYT //optional
  passport: string //Số chứng minh thư nhân dân //require
  currentClassId?: string //Mã lớp học //optional
  pastClassIds?: string[] //optional
  permanentResidence: string // Hộ khẩu thường trú //require
  currentAddress: string // Chỗ ở hiện tại //require
  note?: string //Ghi trú //optional
  type: Type //"official" | "contract" | "parttime"; //loại //require
  status?: Status //"active" | "disabled"; //Trạng thái //optional
}
