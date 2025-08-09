import { z } from "zod"

export const deXuatDeTaiFormSchema = z.object({
    ten_tieng_viet: z
        .string()
        .trim()
        .min(1, { message: "Tên tiếng việt tối thiểu 1 ký tự" })
        .max(50, { message: "Tên tiếng việt tối đa 50 ký tự" }),


    ten_tieng_anh: z
        .string()
        .trim()
        .min(1, { message: "Tên tiếng anh tối thiểu 1 ký tự" })
        .max(50, { message: "Tên tiếng anh tối đa 50 ký tự" }),


    mo_ta: z
        .string()
        .trim()
        .min(1, { message: "Mô tả tối thiểu 1 ký tự" })
        .max(8000, { message: "Mô tả tối đa 8000 ký tự" }),


    yeu_cau_va_so_lieu: z
        .string()
        .trim()
        .min(1, { message: "Yêu cầu nội dung và số liệu ban đầu tối thiểu 1 ký tự" })
        .max(8000, { message: "Yêu cầu nội dung và số liệu ban đầu tối đa 8000 ký tự" }),


    tai_lieu_tham_khao: z
        .string()
        .trim()
        .min(1, { message: "Tài liệu tham khảo tối thiểu 1 ký tự" })
        .max(8000, { message: "Tài liệu tham khảo tối đa 8000 ký tự" }),


    nhom_nganh: z
        .enum(['Khoa học Máy tính', 'Kỹ thuật Máy tính', 'Liên ngành CS-CE'], {
            errorMap: () => ({ message: "Nhóm ngành chỉ có thể là Khoa học Máy tính, Kỹ thuật Máy tính hoặc Liên ngành CS-CE" })
        }),


    he_dao_tao: z
        .enum(['Tiếng Việt', 'Tiếng Anh'], {
            errorMap: () => ({ message: "Hệ đào tạo chỉ có thể là Tiếng Việt hoặc Tiếng Anh" })
        }),


    so_luong_sinh_vien: z.preprocess(
        (val) => Number(val),
        z.number().gt(0, { message: "Vui lòng chọn số sinh viên phù hợp" })
    ),


    id_giang_vien_huong_dan: z.preprocess(
        (val) => {
            if (val === undefined || val === null || val === "") return undefined;
            return Number(val);
        },
        z.number({
            required_error: 'Vui lòng chọn giảng viên hướng dẫn',
            invalid_type_error: 'Giảng viên phải là một số',
        })
            .gt(0, { message: "Vui lòng chọn giảng viên phù hợp" })),


    id_hoc_ky: z.preprocess(
        (val) => {
            if (val === undefined || val === null || val === "") return undefined;
            return Number(val);
        },
        z.number({
            required_error: 'Vui lòng chọn học kỳ',
            invalid_type_error: 'ID học kỳ phải là một số',
        })
            .gt(0, { message: "Vui lòng chọn học kỳ phù hợp" })),


    list_id_sinh_vien_tham_gia: z.preprocess(
        (val) => {
            if (!Array.isArray(val)) return [];
            return val.map((v) => Number(v));
        },
        z.array(z.number({
            invalid_type_error: "Phần tử danh sách ID sinh viên phải là số",
        }))
    ),
})
    .refine((data) => data.list_id_sinh_vien_tham_gia.length <= data.so_luong_sinh_vien, {
        message: "Số lượng sinh viên tham gia vượt quá số lượng cho phép",
        path: ["list_id_sinh_vien_tham_gia"],
    });