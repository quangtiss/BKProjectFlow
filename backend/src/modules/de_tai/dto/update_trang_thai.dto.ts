import { IsIn, IsOptional } from 'class-validator';

export class UpdateTrangThaiDTO {
    @IsOptional()
    @IsIn(['Thực hiện', 'Bảo lưu', 'Hoàn thành'],
        { message: "Trạng thái chỉ có thể là Thực hiện hoặc Hoàn thành" })
    trang_thai: string;


    @IsOptional()
    @IsIn(['Chưa chấp nhận', 'Chưa duyệt', 'Đã duyệt'],
        { message: "Trạng thái duyệt chỉ có thể là Chưa chấp nhận, Chưa duyệt hoặc Đã duyệt" })
    trang_thai_duyet: string;
}