import { IsString, Length, Matches, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSinhVienDTO {
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mã số sinh viên phải là chuỗi' })
    @Length(7, 14, {
        message: 'Mã số sinh viên phải từ 7 đến 14 ký tự',
    })
    mssv: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Năm đào tạo phải là chuỗi' })
    @Matches(/^[1-9][0-9]{3}$/, {
        message: 'Năm đào tạo phải bao gồm 4 chữ số, không bắt đầu bằng 0',
    })
    nam_dao_tao: string;


    @IsIn(['Chính quy', 'Chất lượng cao', 'Việt - Nhật', 'Việt - Pháp'], {
        message: 'Hệ đào tạo chỉ có thể là Chính quy, Chất lượng cao, Việt - Nhật hoặc Việt - Pháp',
    })
    he_dao_tao: string


    @IsIn(['Khoa học Máy tính', 'Kĩ thuật Máy tính'],
        { message: "Ngành chỉ có thể là Khoa học Máy tính hoặc Kĩ thuật Máy tính" }
    )
    nganh: string


    @IsIn(['Tiếng Việt', 'Tiếng Pháp', 'Tiếng Nhật', 'Tiếng Anh'], {
        message: 'Ngôn ngữ chỉ có thể là Tiếng Việt, Tiếng Pháp, Tiếng Nhật hoặc Tiếng Anh',
    })
    ngon_ngu: string


    id_tai_khoan: number
}