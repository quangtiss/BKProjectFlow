import { z } from "zod"

export const BieuMauSchema = z.object({
    ten_mau: z.string()
        .trim()
        .min(1, "Tên mẫu phải dài hơn 1 ký tự")
        .max(800, "Tên mẫu tối đa 800 ký tự"),

    loai_mau: z.enum(['Giảng viên hướng dẫn', 'Giảng viên phản biện', 'Hội đồng']),

    giai_doan: z.enum(['Đồ án tốt nghiệp', 'Đồ án chuyên ngành']),
    ghi_chu: z
        .string()
        .max(1000, "Ghi chú mẫu tối đa 1000 ký tự")
        .transform((val) => (val.trim() === "" ? undefined : val))
        .optional()
})