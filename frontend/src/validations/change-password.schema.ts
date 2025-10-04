import { z } from "zod";

export const ChangePasswordSchema = z.object({
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
}).refine((data) => data.mat_khau === data.re_mat_khau, {
    path: ["re_mat_khau"],
    message: "Mật khẩu không khớp",
});