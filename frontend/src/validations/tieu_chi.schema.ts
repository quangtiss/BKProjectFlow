import z from "zod"

export const TieuChiSchema = z.object({
    ten: z.string()
        .trim()
        .min(1, { message: 'Tên tiêu chí tối thiểu 1 ký tự' })
        .max(2000, { message: 'Tên tiêu chí tối đa 2000 ký tự' }),
    noi_dung: z.string()
        .trim()
        .min(1, { message: 'Nội dung tối thiểu 1 ký tự' })
        .max(8000, { message: 'Nội dung tối đa 8000 ký tự' }),
    loai_diem: z.enum(['Điểm số', 'Điểm chữ'], {
        required_error: 'Loại điểm là bắt buộc',
        message: 'Loại điểm phải là Điểm số hoặc Điểm chữ'
    }),


    diem_toi_da: z.string().trim()
})
    .refine(
        (data) => {
            if (data.loai_diem === "Điểm số") {
                const num = Number(data.diem_toi_da);
                return (
                    !isNaN(num) &&
                    Number.isInteger(num) &&
                    num >= 0 &&
                    num <= 100
                );
            }
            if (data.loai_diem === "Điểm chữ") {
                return /^[A-Z]$/.test(data.diem_toi_da);
            }
            return true;
        },
        {
            message: "Giá trị không hợp lệ theo loại điểm",
            path: ["diem_toi_da"],
        }
    );
