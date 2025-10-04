import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export default function FormPhanChiaGiangVien({ idHoiDong }: { idHoiDong: number }) {
    const [listGiangVien, setListGiangVien] = useState<any[]>([])
    const [filterListGiangVien, setFilterListGiangVien] = useState<any[]>([])
    const [listGiangVienSelected, setListGiangVienSelected] = useState<any[]>([])
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/giang-vien', { method: 'GET', credentials: 'include' })
                const data = await response.json()
                if (response.ok) {
                    const sortedData = data.sort((a: any, b: any) => a.msgv.localeCompare(b.msgv));
                    setListGiangVien(sortedData);
                    setFilterListGiangVien(sortedData);

                    // Tạo listSelected trước
                    const selected = data
                        .filter((dt: any) => dt.tham_gia.some((tg: any) => tg.id_hoi_dong === idHoiDong))
                        .map((dt: any) => ({
                            ...dt,
                            role: dt.tham_gia.find((tg: any) => tg.id_hoi_dong === idHoiDong).vai_tro,
                        }));

                    setListGiangVienSelected(selected); // ✅ set một lần
                } else {
                    toast.error('Lỗi khi lấy dữ liệu giảng viên', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi kết nối server')
                console.error(error)
            }
        }
        fetchData();
    }, [toggle, idHoiDong])


    const sortedFilterList = useMemo(() => {
        return [...filterListGiangVien].sort((a, b) => {
            const aSelected = listGiangVienSelected.some(dt => dt.id_tai_khoan === a.id_tai_khoan)
            const bSelected = listGiangVienSelected.some(dt => dt.id_tai_khoan === b.id_tai_khoan)
            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return a.msgv.localeCompare(b.msgv)
        })
    }, [filterListGiangVien, listGiangVienSelected])

    const handleSave = async () => {
        const dataClient = listGiangVienSelected.map(dt => ({ id_tai_khoan: dt.id_tai_khoan, role: dt.role }))
        let hasChuTich = false
        let hasThuKy = false

        for (const dt of dataClient) {
            if (!dt.role || dt.role === '') {
                const gv = listGiangVienSelected.find(gv => gv.id_tai_khoan === dt.id_tai_khoan)
                const name = gv ? `${gv.tai_khoan.ho} ${gv.tai_khoan.ten}` : ''
                toast.warning(`Vui lòng chọn vai trò cho giảng viên ${name}`)
                return
            }

            if (dt.role === 'Chủ tịch') {
                if (hasChuTich) {
                    toast.warning('Chỉ được chọn 1 Chủ tịch')
                    return
                }
                hasChuTich = true
            }

            if (dt.role === 'Thư ký') {
                if (hasThuKy) {
                    toast.warning('Chỉ được chọn 1 Thư ký')
                    return
                }
                hasThuKy = true
            }
        }

        try {
            const response = await fetch('http://localhost:3000/tham-gia', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_hoi_dong: idHoiDong,
                    list_giang_vien: dataClient
                })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Phân chia giảng viên thành công')
                setToggle(prev => !prev)
            } else {
                toast.error('Lỗi khi phân chia giảng viên', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi kết nối server')
            console.error(error)
        }
    }


    return (
        <div className="flex flex-col justify-center">
            <Button className="mb-4 bg-green-500 w-full" onClick={() => { handleSave() }}>Lưu</Button>
            <Input placeholder="Tìm kiếm giảng viên ..." className="mb-2" onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredGiangVien = listGiangVien.filter((giangVien) =>
                    (giangVien.msgv + giangVien.to_chuyen_nganh + giangVien.tai_khoan.email).toLowerCase().includes(searchTerm) ||
                    (giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten).toLowerCase().includes(searchTerm)
                );
                setFilterListGiangVien(filteredGiangVien);
                if (e.target.value === "") setFilterListGiangVien(listGiangVien)
            }} />
            <ScrollArea className="h-[400px] w-full rounded-md border-2 border-accent-foreground/20 flex flex-col p-2 justify-center">
                {sortedFilterList.length > 0 ? sortedFilterList.map((giangVien: any) => {
                    const select = listGiangVienSelected.some(dt => dt.id_tai_khoan === giangVien.id_tai_khoan)
                    return (
                        <div key={giangVien.id_tai_khoan}
                            className={`text-sm flex flex-row p-2 mb-2 border-2 border-accent-foreground/20 rounded-md cursor-pointer justify-start gap-2 items-center hover:bg-muted transition ${(select) ? 'bg-green-500/10' : ''}`}
                        >
                            <div className="flex gap-2 items-center w-full"
                                onClick={() => {
                                    if (listGiangVienSelected.some(dt => dt.id_tai_khoan === giangVien.id_tai_khoan)) {
                                        setListGiangVienSelected((prev) => prev.filter(dt => dt.id_tai_khoan !== giangVien.id_tai_khoan))
                                    } else {
                                        setListGiangVienSelected((prev) => [...prev, { ...giangVien, role: '' }])
                                    }
                                }}
                            >
                                <div>{giangVien.msgv}</div>
                                <div>-</div>
                                <div className="flex flex-col">
                                    <div>
                                        {giangVien.tai_khoan.ho} {giangVien.tai_khoan.ten}
                                    </div>
                                    <div className="italic text-sm text-gray-400">
                                        {giangVien.tai_khoan.email}
                                    </div>
                                    <div className="italic text-sm text-gray-400">
                                        {giangVien.to_chuyen_nganh}
                                    </div>
                                </div>
                            </div>
                            {select && <div className="text-green-500 ml-auto">
                                <Select
                                    value={listGiangVienSelected.find(dt => dt.id_tai_khoan === giangVien.id_tai_khoan)?.role || ''}
                                    onValueChange={(value: any) => {
                                        if (value === "Chủ tịch" &&
                                            listGiangVienSelected.some(dt => dt.role === "Chủ tịch" && dt.id_tai_khoan !== giangVien.id_tai_khoan)) {
                                            toast.warning("Chỉ được chọn 1 Chủ tịch")
                                        }
                                        if (value === "Thư ký" &&
                                            listGiangVienSelected.some(dt => dt.role === "Thư ký" && dt.id_tai_khoan !== giangVien.id_tai_khoan)) {
                                            toast.warning("Chỉ được chọn 1 Thư ký")
                                        }

                                        setListGiangVienSelected(prev =>
                                            [...prev].map(dt =>
                                                dt.id_tai_khoan === giangVien.id_tai_khoan
                                                    ? { ...dt, role: value }
                                                    : dt
                                            )
                                        )
                                    }}
                                >
                                    <SelectTrigger className="w-[100px] ml-auto">
                                        <SelectValue placeholder="Vai trò" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Chủ tịch">Chủ tịch</SelectItem>
                                        <SelectItem value="Thư ký">Thư ký</SelectItem>
                                        <SelectItem value="Ủy viên">Ủy viên</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>}
                        </div>
                    )
                }) : <div className="text-center text-sm text-gray-500">Có vẻ đề tài đã được phân cho hội đồng</div>}
            </ScrollArea>
        </div>
    )
}
