import { IsString, MinLength, MaxLength, Matches, IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaiKhoanDTO {
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Tên tài khoản phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Tên tài khoản tối thiểu 2 kí tự' })
    @MaxLength(15, { message: 'Tên tài khoản tối đa 15 kí tự' })
    @Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/, {
        message: 'Tên tài khoản phải có ít nhất 1 chữ cái và chỉ được chứa chữ cái, số, dấu gạch dưới',
    })
    ten_tai_khoan: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Mật khẩu phải ở dạng chuỗi' })
    @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
    @MaxLength(20, { message: 'Mật khẩu tối đa 20 ký tự' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`{}[\]|:;"',.?/])[A-Za-z\d!@#$%^&*()_\-+=~`{}[\]|:;"',.?/]+$/,
        {
            message:
                'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 chũ số và 1 ký tự đặc biệt (không chứa < >)',
        },)
    mat_khau: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Họ phải ở dạng chuỗi' })
    @MinLength(1, { message: 'Họ tối thiểu 1 kí tự' })
    @MaxLength(50, { message: 'Họ tối đa 50 kí tự' })
    ho: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Tên phải ở dạng chuỗi' })
    @MinLength(1, { message: 'Tên tối thiểu 1 kí tự' })
    @MaxLength(15, { message: 'Tên tối đa 15 kí tự' })
    ten: string;


    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Số điện thoại phải ở dạng chuỗi' })
    @MinLength(1, { message: 'Số điện thoại tối thiểu 1 kí tự' })
    @MaxLength(20, { message: 'Số điện thoại tối đa 20 kí tự' })
    @Matches(/^0\d{9,10}$/, {
        message: 'Số điện thoại phải có tổng cộng 10-11 chữ số và bắt đầu bằng chữ số 0',
    })
    sdt: string;


    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Số CCCD phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Số CCCD tối thiểu 2 kí tự' })
    @MaxLength(30, { message: 'Số CCCD tối đa 30 kí tự' })
    cccd: string;


    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Ngày sinh phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Ngày sinh tối thiểu 2 kí tự' })
    @MaxLength(20, { message: 'Ngày sinh tối đa 15 kí tự' })
    ngay_sinh: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Email phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Email tối thiểu 2 kí tự' })
    @MaxLength(50, { message: 'Email tối đa 50 kí tự' })
    @Matches(/^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/, {
        message: 'Email phải có định dạng @hcmut.edu.vn',
    })
    email: string;


    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: 'Địa chỉ phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Địa chỉ tối thiểu 2 kí tự' })
    @MaxLength(50, { message: 'Địa chỉ tối đa 50 kí tự' })
    dia_chi: string;


    @IsOptional()
    @IsIn(['Nam', 'Nữ'], {
        message: 'Giới tính chỉ được là Nam hoặc Nữ',
    })
    gioi_tinh: string;


    @IsIn(['Sinh viên', 'Giảng viên', 'Giáo vụ', 'Giảng viên trưởng bộ môn'], {
        message: 'Vai trò chỉ có thể là Sinh viên, Giảng viên, Giáo vụ hoặc Giảng viên trưởng bộ môn',
    })
    vai_tro: string
}