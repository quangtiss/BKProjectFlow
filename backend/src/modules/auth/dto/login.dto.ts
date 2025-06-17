import { IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class LogInDTO {
    @Transform(({ value }) => value.trim())
    @IsString({ message: 'Tên tài khoản phải ở dạng chuỗi' })
    @MinLength(2, { message: 'Tên tài khoản tối thiểu 2 kí tự' })
    @MaxLength(15, { message: 'Tên tài khoản tối đa 15 kí tự' })
    @Matches(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/, {
        message: 'Tên tài khoản phải có ít nhất 1 chữ cái và chỉ được chứa chữ cái, chữ số và dấu gạch dưới',
    })
    ten_tai_khoan: string;


    @Transform(({ value }) => value.trim())
    @IsString({ message: 'Mật khẩu phải ở dạng chuỗi' })
    @MinLength(8, { message: 'Mật khẩu tối thiểu 8 ký tự' })
    @MaxLength(20, { message: 'Mật khẩu tối đa 20 ký tự' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`{}\[\]|:;"',.?/])[A-Za-z\d!@#$%^&*()_\-+=~`{}\[\]|:;"',.?/]+$/,
        {
            message:
                'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 chũ số và 1 ký tự đặc biệt (không chứa < >)',
        },)
    mat_khau: string;
}