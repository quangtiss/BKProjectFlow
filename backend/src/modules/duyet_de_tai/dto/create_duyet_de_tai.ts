import { IsIn, IsOptional, IsString, MaxLength, IsNumber, Min } from "class-validator";

export class CreateDuyetDeTaiDTO {
    @IsNumber()
    @Min(1, { message: "ID của đề tài phải lớn hơn 0, ID của đề tài sẽ được kiểm tra 2 lớp!" })
    id_de_tai: number


    @IsIn(['Đã từ chối', 'Đã chấp nhận'], {
        message: 'Trạng thái hướng dẫn chỉ có thể là Đã từ chối hoặc Đã chấp nhận'
    })
    trang_thai: string

    @IsOptional()
    @IsString()
    @MaxLength(1000, { message: "Ghi chú không thể vượt quá 1000 kí tự" })
    ghi_chu: string
}