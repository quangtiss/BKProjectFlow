import { z } from "zod";
const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 1000 * 1024 * 1024, "File phải nhỏ hơn 1GB")


export const SubmitNhiemVuSchema = z
    .object({
        noi_dung: z
            .string()
            .trim()
            .max(8000, "Nội dung tối đa 8000 ký tự"),
        files: z
            .array(fileSchema)
            .min(0, "Có thể không chọn file nào")
            .max(5, "Tối đa 5 file")
    })
    .superRefine((data, ctx) => {
        const noiDungEmpty = !data.noi_dung || data.noi_dung.trim() === "";
        const filesEmpty = !data.files || data.files.length === 0;

        if (noiDungEmpty && filesEmpty) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phải nhập nội dung hoặc chọn ít nhất 1 file",
                path: ["noi_dung"], // bạn có thể gắn lỗi vào field cụ thể
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Phải nhập nội dung hoặc chọn ít nhất 1 file",
                path: ["files"],
            });
        }
    });
