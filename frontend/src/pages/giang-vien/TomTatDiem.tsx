import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toRoman } from "@/services/numToRoman";
import { Fragment } from "react/jsx-runtime";

export default function TomTatDiem({ deTai, bieuMau, allScores }: { deTai: any, bieuMau: any, allScores: any }) {
    let count = 1;

    // Lấy danh sách sinh viên được chấp nhận
    const sinhVienChapNhan = deTai?.dang_ky?.filter((dk: any) => dk.trang_thai === "Đã chấp nhận") || [];

    // Object lưu tổng điểm của từng sinh viên
    const tongDiem: Record<string, number> = {};

    // Khởi tạo tổng 0 cho từng sinh viên
    sinhVienChapNhan.forEach((dk: any) => {
        tongDiem[dk.id_sinh_vien] = 0;
    });

    return (
        <div className="border-2 rounded-2xl overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-green-500/50">
                        <TableHead className="w-2/5">Tiêu chí</TableHead>
                        {sinhVienChapNhan.map((dk: any) => (
                            <TableHead key={dk.id} className="text-center">
                                {dk.sinh_vien.tai_khoan.ho + " " + dk.sinh_vien.tai_khoan.ten} ({dk.sinh_vien.mssv})
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {bieuMau.nhom_tieu_chi?.map((nhom: any, i: number) => {
                        // Tổng điểm nhóm cho từng sinh viên
                        const tongNhom: Record<string, number> = {};

                        sinhVienChapNhan.forEach((dk: any) => {
                            tongNhom[dk.id_sinh_vien] = 0;
                        });

                        return (
                            <Fragment key={i}>
                                {/* Hàng tiêu đề nhóm */}
                                <TableRow className="bg-gray-500">
                                    <TableCell
                                        colSpan={1 + sinhVienChapNhan.length}
                                        className="font-bold"
                                    >
                                        {toRoman(i + 1)}. {nhom.ten_nhom}
                                    </TableCell>
                                </TableRow>

                                {/* Các tiêu chí trong nhóm */}
                                {nhom.tieu_chi.map((tc: any) => (
                                    <TableRow key={`tc-${tc.id}`}>
                                        <TableCell className="whitespace-normal break-words">
                                            {count++}. {tc.ten}
                                        </TableCell>

                                        {sinhVienChapNhan.map((dk: any) => {
                                            const diem = allScores?.[dk.id_sinh_vien]?.find(
                                                (sc: any) => sc.id_tieu_chi === tc.id
                                            )?.diem ?? null;

                                            // Cộng vào tổng nhóm & tổng toàn bộ
                                            if (typeof diem === "number") {
                                                tongNhom[dk.id_sinh_vien] += diem;
                                                tongDiem[dk.id_sinh_vien] += diem;
                                            }

                                            return (
                                                <TableCell key={`${tc.id}-${dk.id_sinh_vien}`} className="text-center">
                                                    {diem ?? "-"}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}

                                {/* Hàng tổng điểm nhóm */}
                                <TableRow className="bg-yellow-500/50 font-medium">
                                    <TableCell>Tổng điểm nhóm {toRoman(i + 1)}</TableCell>
                                    {sinhVienChapNhan.map((dk: any) => (
                                        <TableCell key={`sum-${i}-${dk.id_sinh_vien}`} className="text-center">
                                            {tongNhom[dk.id_sinh_vien]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </Fragment>
                        );
                    })}

                    {/* Hàng tổng điểm toàn bộ */}
                    <TableRow className="bg-blue-500/50 font-bold">
                        <TableCell>Tổng điểm toàn bộ</TableCell>
                        {sinhVienChapNhan.map((dk: any) => (
                            <TableCell key={`total-${dk.id_sinh_vien}`} className="text-center">
                                {tongDiem[dk.id_sinh_vien]}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
