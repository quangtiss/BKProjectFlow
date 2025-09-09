import { IsString, IsIn, MinLength, MaxLength, Min, IsArray, IsInt, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateDeTaiDTO {


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Tên tiếng việt tối thiểu 1 ký tự" })
    @MaxLength(1000, { message: "Tên tiếng việt tối đa 1000 ký tự" })
    ten_tieng_viet: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Tên tiếng anh tối thiểu 1 ký tự" })
    @MaxLength(1000, { message: "Tên tiếng anh tối đa 1000 ký tự" })
    ten_tieng_anh: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Mô tả tối thiểu 1 ký tự" })
    @MaxLength(8000, { message: "Mô tả tối đa 8000 ký tự" })
    mo_ta: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Yêu cầu nội dung và số liệu ban đầu tối thiểu 1 ký tự" })
    @MaxLength(8000, { message: "Yêu cầu nội dung và số liệu ban đầu tối đa 8000 ký tự" })
    yeu_cau_va_so_lieu: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Tài liệu tham khảo tối thiểu 1 ký tự" })
    @MaxLength(8000, { message: "Tài liệu tham khảo tối đa 8000 ký tự" })
    tai_lieu_tham_khao: string;


    @IsIn(['Khoa học Máy tính', 'Kỹ thuật Máy tính', 'Liên ngành CS-CE'],
        { message: "Nhóm ngành chỉ có thể là Khoa học Máy tính, Kỹ thuật Máy tính hoặc Liên ngành CS-CE" })
    nhom_nganh: string;


    @IsIn(['Tiếng Việt', 'Tiếng Anh'], {
        message: 'Hệ đào tạo chỉ có thể là Tiếng Việt hoặc Tiếng Anh',
    })
    he_dao_tao: string


    @Transform(({ value }) => Number(value))
    @IsInt({ message: "Vui lòng chọn số sinh viên phù hợp" })
    @Min(1, { message: "Vui lòng chọn số sinh viên phù hợp" })
    so_luong_sinh_vien: number;


    @Transform(({ value }) => Number(value))
    @IsInt({ message: "Vui lòng chọn học kỳ phù hợp" })
    @Min(1, { message: "Vui lòng chọn học kỳ phù hợp" })
    id_hoc_ky: number


    @Transform(({ value }) => Number(value))
    @IsInt({ message: "Vui lòng chọn giảng viên hướng dẫn phù hợp" })
    @Min(1, { message: "Vui lòng chọn giảng viên hướng dẫn phù hợp" })
    id_giang_vien_huong_dan: number


    @IsOptional()
    @IsArray({ message: "Danh sách ID sinh viên phải ở dạng mảng." })
    @Transform(({ value }) => {
        if (!Array.isArray(value)) return [];
        return value.map((v) => Number(v));
    })
    @IsInt({ each: true, message: "ID sinh viên phải là số nguyên" })
    list_id_sinh_vien_tham_gia: number[];
}