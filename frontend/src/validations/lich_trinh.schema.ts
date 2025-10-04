import { z } from "zod";

// Định dạng của <input type="datetime-local">: YYYY-MM-DDTHH:mm
const DATETIME_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const datetimeLocal = z
    .string()
    .regex(DATETIME_LOCAL_RE, "Định dạng phải là YYYY-MM-DDTHH:mm");



export const LichTrinhSchema = z
    .object({
        ten: z
            .string()
            .trim()
            .min(1, "Tên phải dài hơn 1 ký tự")
            .max(800, "Tên tối đa 800 ký tự"),
        hoat_dong: z
            .string()
            .trim()
            .min(1, "Hoạt động phải dài hơn 1 ký tự")
            .max(10000, "Hoạt động tối đa 10000 ký tự"),
        ngay_bat_dau: datetimeLocal,
        ngay_ket_thuc: datetimeLocal
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
    });
