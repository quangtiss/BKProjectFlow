import { z } from "zod";

export const signUpFormSchema = z.object({
    ten_tai_khoan: z
        .string()
        .min(2, { message: "Tên tài khoản tối thiểu 2 kí tự" })
        .max(15, { message: "Tên tài khoản tối đa 15 kí tự" })
        .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/, {
            message: "Tên tài khoản phải có ít nhất 1 chữ cái và chỉ được chứa chữ cái, chữ số và dấu gạch dưới",
        }),

    mat_khau: z
        .string()
        .min(8, { message: "Mật khẩu tối thiểu 8 ký tự" })
        .max(20, { message: "Mật khẩu tối đa 20 ký tự" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`{}\[\]|:;"',.?/])[A-Za-z\d!@#$%^&*()_\-+=~`{}\[\]|:;"',.?/]+$/,
            {
                message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (không chứa < >)",
            }
        ),

    re_mat_khau: z.string(),

    ho: z
        .string()
        .min(1, { message: "Họ tối thiểu 1 kí tự" })
        .max(50, { message: 'Họ tối đa 50 kí tự' }),

    ten: z
        .string()
        .min(1, { message: 'Tên tối thiểu 1 kí tự' })
        .max(15, { message: 'Tên tối đa 15 kí tự' }),

    // sdt: z
    //     .string()
    //     .min(1, { message: 'Số điện thoại tối thiểu 1 kí tự' })
    //     .max(20, { message: 'Số điện thoại tối đa 20 kí tự' })
    //     .regex(
    //         /^0\d{9,10}$/,
    //         {
    //             message: 'Số điện thoại phải có tổng cộng 10-11 chữ số và bắt đầu bằng chữ số 0',
    //         }),

    // cccd: z
    //     .string()
    //     .min(2, { message: 'Số CCCD tối thiểu 2 kí tự' })
    //     .max(30, { message: 'Số CCCD tối đa 30 kí tự' }),

    // ngay_sinh: z
    //     .string()
    //     .min(2, { message: 'Ngày sinh tối thiểu 2 kí tự' })
    //     .max(20, { message: 'Ngày sinh tối đa 15 kí tự' }),

    email: z
        .string()
        .min(2, { message: 'Email tối thiểu 2 kí tự' })
        .max(50, { message: 'Email tối đa 50 kí tự' })
        .regex(/^[a-zA-Z0-9._%+-]+@hcmut\.edu\.vn$/, {
            message: 'Email phải có định dạng @hcmut.edu.vn',
        }),

    // dia_chi: z
    //     .string()
    //     .min(2, { message: 'Địa chỉ tối thiểu 2 kí tự' })
    //     .max(50, { message: 'Địa chỉ tối đa 50 kí tự' }),

    // gioi_tinh: z.enum(["Nam", "Nữ"], {
    //     errorMap: () => ({ message: "Giới tính chỉ được là Nam hoặc Nữ" }),
    // }),

    vai_tro: z.enum(['Sinh viên', 'Giảng viên', 'Giáo vụ', 'Giảng viên trưởng bộ môn'], {
        errorMap: () => ({ message: "Vai trò chỉ có thể là Sinh viên, Giảng viên, Giáo vụ hoặc Giảng viên trưởng bộ môn" })
    }),

    //Sinh viên

    mssv: z
        .string()
        .min(7, { message: "Mã số sinh viên tối thiểu 7 kí tự" })
        .max(14, { message: "Mã số sinh viên tối đa 14 kí tự" }),

    nam_dao_tao: z
        .string()
        .regex(/^[1-9][0-9]{3}$/, { message: "Năm đào tạo phải bao gồm 4 chữ số" }),

    he_dao_tao: z.enum(['Chính quy', 'Chất lượng cao', 'Việt - Nhật', 'Việt - Pháp'], {
        errorMap: () => ({ message: "Hệ đào tạo chỉ có thể là Chính quy, Chất lượng cao, Việt - Nhật hoặc Việt - Pháp" })
    }),

    nganh: z.enum(['Khoa học Máy tính', 'Kĩ thuật Máy tính'], {
        errorMap: () => ({ message: "Ngành chỉ có thể là Khoa học Máy tính hoặc Kĩ thuật Máy tính" })
    }),

    ngon_ngu: z.enum(['Tiếng Việt', 'Tiếng Pháp', 'Tiếng Nhật', 'Tiếng Anh'], {
        errorMap: () => ({ message: "Ngôn ngữ chỉ có thể là Tiếng Việt, Tiếng Pháp, Tiếng Nhật hoặc Tiếng Anh" })
    }),

    //Giảng viên và giảng viên trường bộ môn

    msgv: z
        .string()
        .min(7, { message: "Mã số giảng viên tối thiểu 7 kí tự" })
        .max(14, { message: "Mã số giảng viên tối đa 14 kí tự" }),

    to_chuyen_nganh: z.enum(['Hệ thống thông tin', 'Hệ thống mạng', 'Công nghệ phần mềm', 'Khoa học máy tính', 'Kĩ thuật máy tính'], {
        errorMap: () => ({ message: "Tổ chuyên ngành chỉ có thể là Hệ thống thông tin, Hệ thống mạng, Công nghệ phần mềm, Khoa học máy tính hoặc Kĩ thuật máy tính" })
    }),

    //Giáo vụ

    msnv: z
        .string()
        .min(7, { message: "Mã số nhân viên tối thiểu 7 kí tự" })
        .max(14, { message: "Mã số nhân viên tối đa 14 kí tự" }),

    chuc_vu: z.enum(['Nhân viên thông tin', 'Nhân viên kiểm soát'], {
        errorMap: () => ({ message: "Chức vụ chỉ có thể là Nhân viên thông tin hoặc Nhân viên kiểm soát" })
    }),


}).refine((data) => data.mat_khau === data.re_mat_khau, {
    path: ["re_mat_khau"],
    message: "Mật khẩu không khớp",
});