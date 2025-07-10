import { IsString, IsNumber, IsDate, Min, Max, Length } from "class-validator";
import { Type } from "class-transformer";

export class CreateHocKyDTO {

    @Type(() => Number)
    @IsNumber({}, { message: "Tên học kỳ phải là một số" })
    @Min(100, { message: "Tên học kỳ chỉ được có 3 chữ số" })
    @Max(999, { message: "Tên học kỳ chỉ được có 3 chữ số" })
    ten_hoc_ky: string;


    @IsDate({ message: 'Ngày bắt đầu không hợp lệ. Định dạng phải là ngày hợp lệ (ISO 8601).' })
    @Type(() => Date)
    ngay_bat_dau: Date;


    @IsNumber({}, { message: "Năm học phải là một số" })
    @Min(1000, { message: "Năm học chỉ được có 4 chữ số" })
    @Max(9999, { message: "Năm học chỉ được có 4 chữ số" })
    @Type(() => Number)
    nam_hoc: number;
}