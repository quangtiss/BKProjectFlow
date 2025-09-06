import { z } from "zod";

// Định dạng của <input type="datetime-local">: YYYY-MM-DDTHH:mm
const DATETIME_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const datetimeLocal = z
    .string()
    .regex(DATETIME_LOCAL_RE, "Định dạng phải là YYYY-MM-DDTHH:mm");

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 1000 * 1024 * 1024, "File phải nhỏ hơn 1GB")



export const NhiemVuSchema = z
    .object({
        ten: z
            .string()
            .trim()
            .min(1, "Tên phải dài hơn 1 ký tự")
            .max(800, "Tên tối đa 800 ký tự"),
        mo_ta: z
            .string()
            .trim()
            .min(1, "Mô tả phải dài hơn 1 ký tự")
            .max(8000, "Mô tả tối đa 8000 ký tự"),
        ngay_bat_dau: datetimeLocal,
        ngay_ket_thuc: datetimeLocal,
        files: z
            .array(fileSchema)
            .min(0, "Có thể không chọn file nào")
            .max(5, "Tối đa 5 file")
    })
    .superRefine((val, ctx) => {
        // Parse theo local time (đúng hành vi của datetime-local)
        const start = new Date(val.ngay_bat_dau + ":00");
        const end = new Date(val.ngay_ket_thuc + ":00");

        // Kiểm tra ngày hợp lệ
        if (isNaN(start.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["ngay_bat_dau"],
                message: "Ngày bắt đầu không hợp lệ",
            });
        }
        if (isNaN(end.getTime())) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["ngay_ket_thuc"],
                message: "Ngày kết thúc không hợp lệ",
            });
        }

        // Kiểm tra thứ tự thời gian
        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end <= start) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["ngay_ket_thuc"],
                message: "Ngày kết thúc phải sau ngày bắt đầu",
            });
        }


        // ✅ Check trùng file theo name + size
        const seen = new Set<string>();
        for (const f of val.files) {
            const key = `${f.name}`;
            if (seen.has(key)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["files"],
                    message: `File "${f.name}" đã được chọn trùng tên`,
                });
            } else {
                seen.add(key);
            }
        }
    });
