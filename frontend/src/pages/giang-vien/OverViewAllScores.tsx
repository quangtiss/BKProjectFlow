import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DiemThanhPhan {
    id: number
    diem: string
    id_bang_diem: number
    id_tieu_chi: number
}

interface BangDiem {
    id: number
    id_sinh_vien: number
    id_cham_diem: number
    diem_thanh_phan: DiemThanhPhan[]
    sinh_vien: any
}

interface ChamDiem {
    id: number
    id_giang_vien: number
    bang_diem: BangDiem[]
    vai_tro: string
    giang_vien: any
}

interface Props {
    data: ChamDiem[]
}

export default function OverViewAllScores({ data }: Props) {
    //Tạo danh sách giảng viên theo vai_tro (mỗi người có thể xuất hiện nhiều vai trò)
    const giangViens = data.map((item) => ({
        id_giang_vien: item.id_giang_vien,
        vai_tro: item.vai_tro,
        giang_vien: item.giang_vien,
    }))

    //Loại bỏ trùng lặp theo (id_giang_vien + vai_tro)
    const uniqueGiangViens = giangViens.filter(
        (gv, index, self) =>
            index === self.findIndex((x) => x.id_giang_vien === gv.id_giang_vien && x.vai_tro === gv.vai_tro)
    )

    // Lấy danh sách sinh viên duy nhất
    const sinhVienIds = Array.from(
        new Set(data.flatMap((item) => item.bang_diem.map((b) => b.id_sinh_vien)))
    )

    // Hàm tính tổng điểm
    const getTongDiem = (idGiangVien: number, vaiTro: string, idSinhVien: number) => {
        const chamDiem = data.find((c) => c.id_giang_vien === idGiangVien && c.vai_tro === vaiTro)
        if (!chamDiem) return "-"
        const bangDiem = chamDiem.bang_diem.find((b) => b.id_sinh_vien === idSinhVien)
        if (!bangDiem) return "-"

        const tong = bangDiem.diem_thanh_phan.reduce((sum, d) => {
            const val = parseFloat(d.diem)
            return !isNaN(val) ? sum + val : sum
        }, 0)
        return tong
    }


    return (
        <div className="p-4 rounded-xl border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-bold text-center">Sinh viên</TableHead>
                        {uniqueGiangViens.map((gv) => (
                            <TableHead key={`${gv.id_giang_vien}-${gv.vai_tro}`} className="text-center">
                                {gv.giang_vien?.tai_khoan?.ho + " " + gv.giang_vien?.tai_khoan?.ten}
                                <br />
                                <span className="text-sm text-muted-foreground">
                                    ({gv.giang_vien?.msgv || "-"}) - {gv.vai_tro}
                                </span>
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sinhVienIds.map((idSV) => {
                        const sv = data[0].bang_diem.find((it: any) => it.id_sinh_vien === idSV)
                        return <TableRow key={idSV}>
                            <TableCell className="font-semibold text-center">{sv?.sinh_vien?.tai_khoan?.ho + " " + sv?.sinh_vien?.tai_khoan?.ten} ({sv?.sinh_vien?.mssv || "-"}) </TableCell>
                            {uniqueGiangViens.map((gv) => (
                                <TableCell key={`${gv.id_giang_vien}-${gv.vai_tro}`} className="text-center">
                                    {getTongDiem(gv.id_giang_vien, gv.vai_tro, idSV)}
                                </TableCell>
                            ))}
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
