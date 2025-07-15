import { IsIn, IsOptional } from "class-validator";

export class QueryDuyetDeTaiDTO {
    @IsOptional()
    @IsIn(['Đã từ chối', 'Đã chấp nhận'], {
        message: 'Trạng thái hướng dẫn chỉ có thể là Đã từ chối hoặc Đã chấp nhận'
    })
    trang_thai: string
}