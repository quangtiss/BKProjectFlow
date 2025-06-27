import { Transform } from "class-transformer";
import { IsIn, IsString, Length } from "class-validator";

export class CreateGiangVienDTO {
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mã số giảng viên phải là chuỗi' })
    @Length(7, 14, {
        message: 'Mã số giảng viên phải từ 7 đến 14 ký tự',
    })
    msgv: string;


    @IsIn(['Hệ thống thông tin', 'Hệ thống mạng', 'Công nghệ phần mềm', 'Khoa học máy tính', 'Kĩ thuật máy tính'], {
        message: 'Tổ chuyên ngành chỉ có thể là Hệ thống thông tin, Hệ thống mạng, Công nghệ phần mềm, Khoa học máy tính hoặc Kĩ thuật máy tính',
    })
    to_chuyen_nganh: string


    id_tai_khoan: number
}