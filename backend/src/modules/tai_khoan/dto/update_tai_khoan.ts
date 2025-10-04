import { IsString, MinLength, MaxLength, Matches, IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTaiKhoanDTO {
    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsOptional()
    // @IsString({ message: 'Họ phải ở dạng chuỗi' })
    // @MinLength(1, { message: 'Họ tối thiểu 1 ký tự' })
    // @MaxLength(50, { message: 'Họ tối đa 50 ký tự' })
    // ho: string;


    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsOptional()
    // @IsString({ message: 'Tên phải ở dạng chuỗi' })
    // @MinLength(1, { message: 'Tên tối thiểu 1 ký tự' })
    // @MaxLength(15, { message: 'Tên tối đa 15 ký tự' })
    // ten: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    @IsString({ message: 'Số điện thoại phải ở dạng chuỗi' })
    @MinLength(1, { message: 'Số điện thoại tối thiểu 1 ký tự' })
    @MaxLength(20, { message: 'Số điện thoại tối đa 20 ký tự' })
    @Matches(/^0\d{9,10}$/, {
        message: 'Số điện thoại phải có tổng cộng 10-11 chữ số và bắt đầu bằng chữ số 0',
    })
    sdt: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    @IsString({ message: 'Số CCCD phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Số CCCD tối thiểu 2 ký tự' })
    @MaxLength(30, { message: 'Số CCCD tối đa 30 ký tự' })
    cccd: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    @IsString({ message: 'Ngày sinh phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Ngày sinh tối thiểu 2 ký tự' })
    @MaxLength(20, { message: 'Ngày sinh tối đa 15 ký tự' })
    ngay_sinh: string;


    // @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    // @IsOptional()
    // @IsString({ message: 'Email phải ở dạng chuỗi' })
    // @MinLength(2, { message: 'Email tối thiểu 2 ký tự' })
    // @MaxLength(50, { message: 'Email tối đa 50 ký tự' })
    // @Matches(/^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/, {
    //     message: 'Email phải có định dạng @hcmut.edu.vn',
    // })
    // email: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    @IsString({ message: 'Địa chỉ phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Địa chỉ tối thiểu 2 ký tự' })
    @MaxLength(50, { message: 'Địa chỉ tối đa 50 ký tự' })
    dia_chi: string;


    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsOptional()
    @IsIn(['Nam', 'Nữ'], {
        message: 'Giới tính chỉ được là Nam hoặc Nữ',
    })
    gioi_tinh: string;
}