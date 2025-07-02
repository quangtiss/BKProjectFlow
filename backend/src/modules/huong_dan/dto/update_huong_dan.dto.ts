import { IsIn } from "class-validator";

export class UpdateHuongDanDTO {
    @IsIn(['Chưa chấp nhận', 'Đã từ chối', 'Đã chấp nhận'], {
        message: 'Trạng thái hướng dẫn chỉ có thể là Chưa chấp nhận hoặc Đã chấp nhận'
    })
    trang_thai: string
}