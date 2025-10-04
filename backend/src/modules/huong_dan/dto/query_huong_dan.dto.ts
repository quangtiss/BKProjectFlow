import { IsIn, IsOptional, MaxLength } from "class-validator";

export class QueryHuongDanDTO {
    @IsOptional()
    @IsIn(['Chưa chấp nhận', 'Đã từ chối', 'Đã chấp nhận'], {
        message: 'Trạng thái hướng dẫn chỉ có thể là Chưa chấp, Đã từ chối hoặc Đã chấp nhận'
    })
    trang_thai: string

    @IsOptional()
    @MaxLength(10)
    id_hoc_ky: string
}