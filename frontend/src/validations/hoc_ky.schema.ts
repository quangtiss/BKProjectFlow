import { z } from "zod";

export const HocKyChema = z.object({
    ten_hoc_ky: z.preprocess(
        (val) => {
            const parsed = Number(val);
            return isNaN(parsed) ? undefined : parsed;
        },
        z
            .number({ invalid_type_error: 'Tên học kỳ phải là một số' })
            .min(111, { message: 'Tên học kỳ chỉ được có 3 chữ số' })
            .max(999, { message: 'Tên học kỳ chỉ được có 3 chữ số' })
    ),

    ngay_bat_dau: z.preprocess(
        (val) => {
            if (typeof val === 'string' || val instanceof Date) {
                const date = new Date(val);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return val;
        },
        z.date({ invalid_type_error: 'Ngày bắt đầu không hợp lệ. Định dạng phải là ngày hợp lệ (ISO 8601).' })
    ),

    nam_hoc: z.preprocess(
        (val) => {
            const parsed = Number(val);
            return isNaN(parsed) ? undefined : parsed;
        },
        z
            .number({ invalid_type_error: 'Năm học phải là một số' })
            .min(1000, { message: 'Năm học chỉ được có 4 chữ số' })
            .max(9999, { message: 'Năm học chỉ được có 4 chữ số' })
    ),
});