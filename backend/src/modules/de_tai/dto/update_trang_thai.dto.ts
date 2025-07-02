import { IsIn, IsOptional } from 'class-validator';

export class UpdateTrangThaiDTO {
    @IsOptional()
    @IsIn(['Chưa chấp nhận', 'Đã từ chối', 'Đã chấp nhận', 'Thực hiện', 'Bảo lưu', 'Hoàn thành'],
        { message: "Trạng thái chỉ có thể là Chưa chấp nhận, Thực hiện, Bảo lưu hoặc Hoàn thành" })
    trang_thai: string;


    @IsOptional()
    @IsIn(['Chưa duyệt', 'Đã duyệt'],
        { message: "Trạng thái duyệt chỉ có thể là Chưa duyệt hoặc Đã duyệt" })
    trang_thai_duyet: string;
}