import { Transform } from "class-transformer";
import { Length, IsString, Matches, IsIn, ValidateIf } from "class-validator";
import { CreateTaiKhoanDTO } from "src/modules/tai_khoan/dto/create_tai_khoan.dto";

export class SignUpDTO extends CreateTaiKhoanDTO {
    //Sinh viên
    @ValidateIf(o => o.vai_tro === 'Sinh viên')
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mã số sinh viên phải là chuỗi' })
    @Length(7, 14, {
        message: 'Mã số sinh viên phải từ 7 đến 14 ký tự',
    })
    mssv: string;


    @ValidateIf(o => o.vai_tro === 'Sinh viên')
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Năm đào tạo phải là chuỗi' })
    @Matches(/^[1-9][0-9]{3}$/, {
        message: 'Năm đào tạo phải bao gồm 4 chữ số, không bắt đầu bằng 0',
    })
    nam_dao_tao: string;


    @ValidateIf(o => o.vai_tro === 'Sinh viên')
    @IsIn(['Chính quy', 'Chất lượng cao', 'Việt - Nhật', 'Việt - Pháp'], {
        message: 'Hệ đào tạo chỉ có thể là Chính quy, Chất lượng cao, Việt - Nhật hoặc Việt - Pháp',
    })
    he_dao_tao: string


    @ValidateIf(o => o.vai_tro === 'Sinh viên')
    @IsIn(['Khoa học Máy tính', 'Kỹ thuật Máy tính'],
        { message: "Ngành chỉ có thể là Khoa học Máy tính hoặc Kỹ thuật Máy tính" }
    )
    nganh: string


    @ValidateIf(o => o.vai_tro === 'Sinh viên')
    @IsIn(['Tiếng Việt', 'Tiếng Pháp', 'Tiếng Nhật', 'Tiếng Anh'], {
        message: 'Ngôn ngữ chỉ có thể là Tiếng Việt, Tiếng Pháp, Tiếng Nhật hoặc Tiếng Anh',
    })
    ngon_ngu: string


    //Giảng viên và Giảng viên trưởng bộ môn
    @ValidateIf(o => o.vai_tro === 'Giảng viên' || o.vai_tro === "Giảng viên trưởng bộ môn")
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mã số giảng viên phải là chuỗi' })
    @Length(7, 14, {
        message: 'Mã số giảng viên phải từ 7 đến 14 ký tự',
    })
    msgv: string;


    @ValidateIf(o => o.vai_tro === 'Giảng viên' || o.vai_tro === "Giảng viên trưởng bộ môn")
    @IsIn(['Hệ thống thông tin', 'Hệ thống và mạng máy tính', 'Công nghệ phần mềm', 'Khoa học máy tính', 'Kỹ thuật máy tính'], {
        message: 'Tổ chuyên ngành chỉ có thể là Hệ thống thông tin, Hệ thống và mạng máy tính, Công nghệ phần mềm, Khoa học máy tính hoặc Kỹ thuật máy tính',
    })
    to_chuyen_nganh: string


    //Giáo vụ
    @ValidateIf(o => o.vai_tro === 'Giáo vụ')
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mã số nhân viên phải là chuỗi' })
    @Length(7, 14, {
        message: 'Mã số nhân viên phải từ 7 đến 14 ký tự',
    })
    msnv: string;



    @ValidateIf(o => o.vai_tro === 'Giáo vụ')
    @IsIn(['Nhân viên thông tin', 'Nhân viên kiểm soát'],
        { message: "Chức vụ chỉ có thể là Nhân viên thông tin hoặc Nhân viên kiểm soát" })
    chuc_vu: string
}