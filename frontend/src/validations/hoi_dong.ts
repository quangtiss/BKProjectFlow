import z from "zod";

// Định dạng của <input type="datetime-local">: YYYY-MM-DDTHH:mm
const DATETIME_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const datetimeLocal = z
    .string()
    .regex(DATETIME_LOCAL_RE, "Định dạng phải là YYYY-MM-DDTHH:mm");

export const HoiDongSchema = z.object({
    ten_hoi_dong: z.string()
        .min(1, { message: 'Tên hội đồng tối thiểu 1 ký tự' })
        .max(255, { message: 'Tên hội đồng tối đa 255 ký tự' }),
    phong: z.string()
        .min(1, { message: 'Phòng tối thiểu 1 ký tự' })
        .max(100, { message: 'Phòng tối đa 100 ký tự' }),
    ngay_gio: datetimeLocal,
    giai_doan: z.enum(['Đồ án chuyên ngành', 'Đồ án tốt nghiệp']),
    nhom_nganh: z.enum(['Khoa học Máy tính', 'Kỹ thuật Máy tính', 'Liên ngành CS-CE']),
    he_dao_tao: z.enum(['Tiếng Anh', 'Tiếng Việt'])
})