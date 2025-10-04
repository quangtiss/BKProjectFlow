import { Transform } from "class-transformer";
import { IsString, Matches, MinLength, MaxLength } from "class-validator";

export class ChangePasswordDTO {

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
}