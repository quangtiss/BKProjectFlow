import { IsOptional, IsIn } from "class-validator";

export class QueryDeTai {
    @IsOptional()
    @IsIn(['GVHD chưa chấp nhận', 'GVHD đã từ chối', 'GVHD đã chấp nhận', 'Thực hiện', 'Bảo lưu', 'Hoàn thành'],
        { message: "Trạng thái chỉ có thể là GVHD chưa chấp nhận, GVHD đã từ chối, GVHD đã chấp nhận,  Thực hiện, Bảo lưu hoặc Hoàn thành" })
    trang_thai: string;


    @IsOptional()
    @IsIn(['Chưa duyệt', 'Đã duyệt'],
        { message: "Trạng thái duyệt chỉ có thể là Chưa duyệt hoặc Đã duyệt" })
    trang_thai_duyet: string;
}