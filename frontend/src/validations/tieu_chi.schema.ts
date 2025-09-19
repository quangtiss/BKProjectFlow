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
    diem_toi_da: z.number()
        .min(0, { message: "Điểm tối đa phải là số dương" })
        .max(99, { message: "Điểm tối đa phải bé hơn 100" })
})