import { IsString, IsIn, MinLength, MaxLength, IsNumber, Min, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class CreateDeTaiDTO {
    // @IsOptional()
    // @IsIn(['Chưa chấp nhận', 'Thực hiện', 'Bảo lưu', 'Hoàn thành'],
    //     { message: "Trạng thái chỉ có thể là Chưa chấp nhận, Thực hiện, Bảo lưu hoặc Hoàn thành" })
    // trang_thai: string;


    // @IsOptional()
    // @IsIn(['Chưa duyệt', 'Đã duyệt'],
    //     { message: "Trạng thái duyệt chỉ có thể là Chưa duyệt hoặc Đã duyệt" })
    // trang_thai_duyet: string;


    // @IsOptional()
    // @IsIn(['Đồ án chuyên ngành', 'Đồ án tốt nghiệp'],
    //     { message: "Giai đoạn chỉ có thể là Đồ án chuyên ngành hoặc Đồ án tốt nghiệp" })
    // giai_doan: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Tên tiếng việt tối thiểu 1 kí tự" })
    @MaxLength(50, { message: "Tên tiếng việt tối đa 50 kí tự" })
    ten_tieng_viet: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Tên tiếng anh tối thiểu 1 kí tự" })
    @MaxLength(50, { message: "Tên tiếng anh tối đa 50 kí tự" })
    ten_tieng_anh: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Mô tả tối thiểu 1 kí tự" })
    @MaxLength(1000, { message: "Mô tả tối đa 1000 kí tự" })
    mo_ta: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(1, { message: "Mã đề tài tối thiểu 1 kí tự" })
    @MaxLength(10, { message: "Mã đề tài tối đa 10 kí tự" })
    ma_de_tai: string;


    @IsIn(['Khoa học Máy tính', 'Kĩ thuật Máy tính', 'Đa ngành'],
        { message: "Nhóm ngành chỉ có thể là Khoa học Máy tính, Kĩ thuật Máy tính hoặc Đa ngành" })
    nhom_nganh: string;


    @IsIn(['Chính quy', 'Chất lượng cao', 'Việt - Nhật', 'Việt - Pháp'],
        { message: "Hệ đào tạo chỉ có thể là Chính quy, Chất lượng cao, Việt - Nhật hoặc Việt - Pháp" })
    he_dao_tao: string;


    @IsNumber()
    @Min(1, { message: "Vui lòng chọn số sinh viên phù hợp" })
    so_luong_sinh_vien: number;


    @IsNumber()
    @Min(1, { message: "Vui lòng chọn giảng viên hướng dẫn phù hợp" })
    id_giang_vien_huong_dan: number
}