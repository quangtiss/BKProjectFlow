import { IsIn, IsOptional, MaxLength } from "class-validator";

export class QueryDuyetDeTaiDTO {
    @IsOptional()
    @IsIn(['Đã từ chối', 'Đã chấp nhận'], {
        message: 'Trạng thái hướng dẫn chỉ có thể là Đã từ chối hoặc Đã chấp nhận'
    })
    trang_thai: string

    @IsOptional()
    @MaxLength(10)
    id_hoc_ky: string

    @IsOptional()
    @IsIn(['Đồ án chuyên ngành', 'Đồ án tốt nghiệp'], {
        message: 'Giai đoạn chỉ có thể là Đồ án chuyên ngành hoặc Đồ án tốt nghiệp'
    })
    giai_doan: string
}