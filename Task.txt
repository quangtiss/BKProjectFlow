import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toRoman } from "@/services/numToRoman";
import { Fragment } from "react/jsx-runtime";

export default function TomTatDiem({ deTai, bieuMau, allScores }: { deTai: any, bieuMau: any, allScores: any }) {
    let count = 1;
    return (
        <div className="border-2 rounded-2xl overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-green-500/50">
                        <TableHead className="w-2/5">Tiêu chí</TableHead>
                        {deTai?.dang_ky
                            ?.filter((dk: any) => dk.trang_thai === "Đã chấp nhận")
                            .map((dk: any) => (
                                <TableHead key={dk.id} className="text-center">
                                    {dk.sinh_vien.tai_khoan.ho + " " + dk.sinh_vien.tai_khoan.ten} ({dk.sinh_vien.mssv})
                                </TableHead>
                            ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {bieuMau.nhom_tieu_chi?.map((nhom: any, i: number) => (
                        <Fragment key={i}>
                            {/* Hàng tiêu đề nhóm */}
                            <TableRow key={`nhom-${i}`} className="bg-gray-500">
                                <TableCell colSpan={
                                    1 +
                                    deTai?.dang_ky.filter((dk: any) => dk.trang_thai === "Đã chấp nhận")
                                        .length
                                }>
                                    <span className="font-bold">
                                        {toRoman(i + 1)}. {nhom.ten_nhom}
                                    </span>
                                </TableCell>
                            </TableRow>

                            {/* Các tiêu chí trong nhóm */}
                            {nhom.tieu_chi.map((tc: any) => (
                                <TableRow key={`tc-${tc.id}`}>
                                    <TableCell className="whitespace-normal break-words">
                                        {count++}. {tc.ten}
                                    </TableCell>

                                    {deTai?.dang_ky
                                        ?.filter((dk: any) => dk.trang_thai === "Đã chấp nhận")
                                        .map((dk: any) => (
                                            <TableCell
                                                key={`${tc.id}-${dk.id_sinh_vien}`}
                                                className="text-center"
                                            >
                                                {allScores?.[dk.id_sinh_vien]?.find(
                                                    (sc: any) => sc.id_tieu_chi === tc.id
                                                )?.diem ?? "-"}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))}
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}