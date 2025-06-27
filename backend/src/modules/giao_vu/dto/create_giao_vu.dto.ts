import { Transform } from "class-transformer";
import { IsString, Length, IsIn } from "class-validator";

export class CreateGiaoVuDTO {
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mã số nhân viên phải là chuỗi' })
    @Length(7, 14, {
        message: 'Mã số nhân viên phải từ 7 đến 14 ký tự',
    })
    msnv: string;


    @IsIn(['Nhân viên thông tin', 'Nhân viên kiểm soát'],
        { message: "Chức vụ chỉ có thể là Nhân viên thông tin hoặc Nhân viên kiểm soát" })
    chuc_vu: string


    id_tai_khoan: number
}