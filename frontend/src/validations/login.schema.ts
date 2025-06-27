import { z } from "zod";

export const logInFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Tên tài khoản tối thiểu 2 kí tự" })
        .max(15, { message: "Tên tài khoản tối đa 15 kí tự" })
        .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9_]+$/, {
            message: "Tên tài khoản phải có ít nhất 1 chữ cái và chỉ được chứa chữ cái, chữ số và dấu gạch dưới",
        }),

    password: z
        .string()
        .min(8, { message: "Mật khẩu tối thiểu 8 ký tự" })
        .max(20, { message: "Mật khẩu tối đa 20 ký tự" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`{}\[\]|:;"',.?/])[A-Za-z\d!@#$%^&*()_\-+=~`{}\[\]|:;"',.?/]+$/,
            {
                message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (không chứa < >)",
            }
        ),
})