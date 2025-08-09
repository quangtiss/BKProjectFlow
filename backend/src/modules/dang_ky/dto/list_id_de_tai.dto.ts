import { Transform } from "class-transformer";
import { IsArray, IsInt, IsOptional } from "class-validator";

export class ListIDDeTai {
    @IsArray({ message: "Danh sách ID sinh viên phải ở dạng mảng." })
    @Transform(({ value }) => {
        if (!Array.isArray(value)) return [];
        return value.map((v) => Number(v));
    })
    @IsInt({ each: true, message: "ID sinh viên phải là số nguyên" })
    list_id_de_tai: number[];
}