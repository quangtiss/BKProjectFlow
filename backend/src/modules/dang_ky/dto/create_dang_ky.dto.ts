import { IsIn, IsInt, Min } from "class-validator";

export class CreateDangKy {

    @IsIn(['Chưa chấp nhận', 'Đã từ chối', 'Đã chấp nhận'], {
        message: 'Trạng thái chỉ có thể là Chưa chấp nhận, Đã từ chối hoặc Đã chấp nhận'
    })
    trang_thai: string


    @IsInt({ message: "ID sinh viên phải là số nguyên" })
    @Min(1, { message: "ID sinh viên phải lớn hơn 0" })
    id_sinh_vien: number



    @IsInt({ message: "ID đề tài phải là số nguyên" })
    @Min(1, { message: "ID đề tài phải lớn hơn 0" })
    id_de_tai: number

}