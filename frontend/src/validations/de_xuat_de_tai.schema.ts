import { z } from "zod"

export const deXuatDeTaiFormSchema = z.object({
    ten_tieng_viet: z
        .string()
        .min(1, { message: "Tên tiếng việt tối thiểu 1 kí tự" })
        .max(50, { message: "Tên tiếng việt tối đa 50 kí tự" }),


    ten_tieng_anh: z
        .string()
        .min(1, { message: "Tên tiếng anh tối thiểu 1 kí tự" })
        .max(50, { message: "Tên tiếng anh tối đa 50 kí tự" }),


    mo_ta: z
        .string()
        .min(1, { message: "Mô tả tối thiểu 1 kí tự" })
        .max(1000, { message: "Mô tả tối đa 1000 kí tự" }),


    ma_de_tai: z
        .string()
        .min(1, { message: "Mã đề tài tối thiểu 1 kí tự" })
        .max(10, { message: "Mã đề tài tối đa 10 kí tự" }),


    nhom_nganh: z
        .enum(['Khoa học Máy tính', 'Kĩ thuật Máy tính', 'Đa ngành'], {
            errorMap: () => ({ message: "Nhóm ngành chỉ có thể là Khoa học Máy tính, Kĩ thuật Máy tính hoặc Đa ngành" })
        }),


    he_dao_tao: z
        .enum(['Chính quy', 'Chất lượng cao', 'Việt - Nhật', 'Việt - Pháp'], {
            errorMap: () => ({ message: "Hệ đào tạo chỉ có thể là Chính quy, Chất lượng cao, Việt - Nhật hoặc Việt - Pháp" })
        }),


    so_luong_sinh_vien: z
        .number()
        .gt(0, { message: "Vui lòng chọn số sinh viên phù hợp" }),


    id_giang_vien_huong_dan: z
        .number({
            required_error: 'Vui lòng chọn giảng viên hướng dẫn',
            invalid_type_error: 'Giảng viên phải là một số',
        })
        .gt(0, { message: "Vui lòng chọn giảng viên phù hợp" }),

})