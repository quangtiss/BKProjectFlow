import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconCheck } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export default function FormPhanChiaDeTai({ idCurrentHocKy, hoiDong }: { idCurrentHocKy: number, hoiDong: any }) {
    const [listDeTai, setListDeTai] = useState<any[]>([])
    const [filterListDeTai, setFilterListDeTai] = useState<any[]>([])
    const [listDeTaiSelected, setListDeTaiSelected] = useState<any[]>([])
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/duyet-de-tai?trang_thai=Đã chấp nhận&id_hoc_ky=' + idCurrentHocKy, { method: 'GET', credentials: 'include' })
                const data = await response.json()
                if (response.ok) {
                    setListDeTai(data.filter((item: any) => item.de_tai.danh_gia.every((danhGia: any) => danhGia.trang_thai === "Đã chấm"))
                        .filter((item: any) => item.de_tai.giai_doan === hoiDong.giai_doan && item.de_tai.giai_doan.nhom_nganh === hoiDong.nhom_nganh && item.de_tai.he_dao_tao === hoiDong.he_dao_tao)
                        .sort((a: any, b: any) => a.de_tai.ma_de_tai.localeCompare(b.de_tai.ma_de_tai)))
                    setFilterListDeTai(data.filter((item: any) => item.de_tai.danh_gia.every((danhGia: any) => danhGia.trang_thai === "Đã chấm"))
                        .filter((item: any) => item.de_tai.giai_doan === hoiDong.giai_doan && item.de_tai.nhom_nganh === hoiDong.nhom_nganh && item.de_tai.he_dao_tao === hoiDong.he_dao_tao)
                        .sort((a: any, b: any) => a.de_tai.ma_de_tai.localeCompare(b.de_tai.ma_de_tai)))
                } else {
                    toast.error('Lỗi khi lấy dữ liệu đề tài', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi kết nối server')
                console.error(error)
            }
        }
        fetchData();
    }, [idCurrentHocKy, toggle, hoiDong])


    const sortedFilterList = useMemo(() => {
        return [...filterListDeTai].sort((a, b) => {
            const aSelected = listDeTaiSelected.some(dt => dt.id === a.id)
            const bSelected = listDeTaiSelected.some(dt => dt.id === b.id)
            if (aSelected && !bSelected) return -1
            if (!aSelected && bSelected) return 1
            return a.de_tai.ma_de_tai.localeCompare(b.de_tai.ma_de_tai)
        })
    }, [filterListDeTai, listDeTaiSelected])

    const handleSave = async () => {
        if (listDeTaiSelected.length === 0) {
            toast.warning('Vui lòng chọn đề tài')
            return
        }

        const giaiDoan = listDeTaiSelected[0].de_tai.giai_doan;
        const allSameGiaiDoan = listDeTaiSelected.every((dt: any) => dt.de_tai.giai_doan === giaiDoan);

        if (!allSameGiaiDoan) {
            toast.warning('Đề tài phải chung giai đoạn')
            return
        }

        const heDaoTao = listDeTaiSelected[0].de_tai.he_dao_tao;
        const allSameHeDaoTao = listDeTaiSelected.every((dt: any) => dt.de_tai.he_dao_tao === heDaoTao);

        if (!allSameHeDaoTao) {
            toast.warning('Đề tài phải chung hệ đào tạo')
            return
        }
        try {
            const response = await fetch('http://localhost:3000/hoi-dong/phan-chia-de-tai', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_hoi_dong: hoiDong.id,
                    list_de_tai: listDeTaiSelected.map(dt => dt.de_tai.id)
                })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Phân chia đề tài thành công')
                setToggle(prev => !prev)
            } else {
                toast.error('Lỗi khi phân chia đề tài', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi kết nối server')
            console.error(error)
        }
    }

    return (
        <div className="flex flex-col justify-center">
            <Button className="mb-4 bg-green-500 w-full" onClick={() => { handleSave() }}>Lưu</Button>
            <Input placeholder="Tìm kiếm đề tài..." className="mb-2" onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredDeTai = listDeTai.filter((deTai) =>
                    deTai.de_tai.ma_de_tai.toLowerCase().includes(searchTerm) ||
                    deTai.de_tai.ten_tieng_viet.toLowerCase().includes(searchTerm) ||
                    deTai.de_tai.ten_tieng_anh.toLowerCase().includes(searchTerm)
                );
                setFilterListDeTai(filteredDeTai);
                if (e.target.value === "") setFilterListDeTai(listDeTai)
            }} />
            <ScrollArea className="h-[400px] w-full rounded-md border-2 border-accent-foreground/20 flex flex-col p-2 justify-center">
                {sortedFilterList.length > 0 ? sortedFilterList.map((deTai: any) => {
                    const select = listDeTaiSelected.some(dt => dt.id === deTai.id)
                    return (
                        <div key={deTai.id}
                            className={`text-sm flex flex-row p-2 mb-2 border-2 border-accent-foreground/20 rounded-md cursor-pointer justify-start gap-2 items-center hover:bg-muted transition ${(select) ? 'bg-muted' : ''}`}
                            onClick={() => {
                                if (listDeTaiSelected.some(dt => dt.id === deTai.id)) {
                                    setListDeTaiSelected((prev) => prev.filter(dt => dt.id !== deTai.id))
                                } else {
                                    setListDeTaiSelected((prev) => [...prev, deTai])
                                }
                            }}
                        >
                            <div>{deTai.de_tai.ma_de_tai}</div>
                            <div>-</div>
                            <div className="flex flex-col">
                                <div>
                                    {deTai.de_tai.ten_tieng_viet}
                                </div>
                                <div className="italic text-sm text-gray-500">
                                    {deTai.de_tai.ten_tieng_anh}
                                </div>
                                <div className="italic text-sm text-gray-500">
                                    ({deTai.de_tai.giai_doan} - {deTai.de_tai.nhom_nganh} - {deTai.de_tai.he_dao_tao})
                                </div>
                            </div>
                            {select && <div className="text-green-500 ml-auto"><IconCheck /></div>}
                        </div>
                    )
                }) : <div className="text-center text-sm text-gray-500">Có vẻ đề tài đã được phân cho hội đồng</div>}
            </ScrollArea>
        </div>
    )
}
