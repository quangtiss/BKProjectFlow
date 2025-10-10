import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { getCurrentAndNextHocKy } from "@/services/getCurrentNextHocKy"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import FormHoiDong from "./FormHoiDong"
import { useAuth } from "@/routes/auth-context"
import { IconEditCircle, IconTablePlus, IconUsersPlus } from "@tabler/icons-react"
import FormPhanChiaDeTai from "./FormPhanChiaDeTai"
import FormPhanChiaGiangVien from "./FormPhanChiaGiangVien"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

export default function HoiDong() {
    const navigate = useNavigate()
    const [listHocKy, setListHocKy] = useState([])
    const [listHoiDong, setListHoiDong] = useState([])
    const [filterListHoiDong, setFilterListHoiDong] = useState([])
    const [selectHocKy, setSelectHocKy] = useState("")
    const [toggle, setToggle] = useState(false)
    const { user }: { user: any } = useAuth()
    const isGiangVienTruong = user.auth.role === 'Giảng viên trưởng bộ môn'
    const priority: Record<string, number> = {
        'Chủ tịch': 1,
        'Thư ký': 2,
        'Ủy viên': 3,
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await fetch('http://localhost:3000/hoc-ky', { method: 'GET', credentials: 'include' })
                const data1 = await response1.json()
                if (response1.ok) {
                    setListHocKy(data1.sort((a: any, b: any) => a.ten_hoc_ky - b.ten_hoc_ky))
                    const current = getCurrentAndNextHocKy(data1)?.current?.id
                    setSelectHocKy(String(current))
                }
                else toast.error('Lỗi khi lấy dữ liệu', { description: data1.message })
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [])



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await fetch('http://localhost:3000/hoi-dong/hoc-ky/' + selectHocKy, { method: 'GET', credentials: 'include' })
                const data1 = await response1.json()
                if (response1.ok) {
                    setListHoiDong(data1.sort((a: any, b: any) => a.id - b.id))
                    setFilterListHoiDong(data1.sort((a: any, b: any) => a.id - b.id))
                }
                else toast.error('Lỗi khi lấy dữ liệu', { description: data1.message })
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        if (selectHocKy.trim() !== "") fetchData()
    }, [selectHocKy, toggle])


    const currentHocKy = getCurrentAndNextHocKy(listHocKy)
    const isNow = currentHocKy?.current?.id === Number(selectHocKy)


    const handleDeleteDeTai = async (idDeTai: number) => {
        if (!isGiangVienTruong) {
            toast.error('Bạn không có quyền thực hiện hành động này')
            return
        }
        try {
            const response = await fetch('http://localhost:3000/hoi-dong/xoa-de-tai/' + idDeTai, {
                method: 'GET',
                credentials: 'include',
            })
            const data = await response.json()
            if (response.ok) {
                setToggle(prev => !prev)
            } else {
                toast.error('Lỗi khi xóa đề tài khỏi hội đồng', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi kết nối server')
            console.error(error)
        }
    }



    return (
        <div className="flex flex-col gap-2 p-5 sm:mx-20">
            <div className="flex gap-2 mb-5">
                <Select value={selectHocKy} onValueChange={setSelectHocKy}>
                    <SelectTrigger className="flex justify-center w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {listHocKy.length > 0 && listHocKy.map((hocKy: any) => (
                            <SelectItem key={hocKy.id} value={String(hocKy.id)}>Học kỳ {hocKy.ten_hoc_ky} <span className="text-blue-500 italic">{currentHocKy?.current?.id === hocKy.id && " (Hiện hành)"}</span></SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {isNow && isGiangVienTruong && <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus />
                            Thêm hội đồng
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-9/10 overflow-y-auto">
                        <DialogTitle>Tạo hội đồng học kỳ {currentHocKy?.current?.ten_hoc_ky}</DialogTitle>
                        <DialogDescription>Chỉ có thể tạo hội đồng ở học kỳ hiện hành là {currentHocKy?.current?.ten_hoc_ky}</DialogDescription>
                        <FormHoiDong type="create" idCurrentHocKy={currentHocKy?.current?.id || 0} />
                    </DialogContent>
                </Dialog>}
            </div>
            <Input placeholder="Tìm kiếm ..." className="mb-10 w-1/2 ml-auto" onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filterListHoiDong = listHoiDong.filter((hoiDong: any) =>
                    (hoiDong.ten_hoi_dong + " " + hoiDong.phong + " ")
                        .toLowerCase().includes(searchTerm)
                    ||
                    hoiDong.tham_gia?.some((gv: any) => (gv.giang_vien.tai_khoan.ho + " " + gv.giang_vien.tai_khoan.ten + " " + gv.giang_vien.msgv).toLowerCase().includes(searchTerm))
                    ||
                    hoiDong.de_tai?.some((dt: any) => (dt.ma_de_tai + " " + dt.ten_tieng_viet + " " + dt.ten_tieng_anh).toLowerCase().includes(searchTerm))
                );
                setFilterListHoiDong(filterListHoiDong);
                if (e.target.value === "") setFilterListHoiDong(listHoiDong)
            }} />

            {filterListHoiDong?.length > 0 ? filterListHoiDong.map((hoiDong: any, index: number) => (
                <div key={index} className="w-full flex flex-col rounded-2xl border-accent-foreground/10 border-5 overflow-hidden mb-10">
                    <div className="text-xl font-bold p-2 py-5 border-accent-foreground/10 border-b-2 bg-green-500/50">
                        {(index + 1) + ". "}
                        {hoiDong.ten_hoi_dong}
                    </div>
                    <div className="p-2 border-accent-foreground/10 border-b-2 bg-gray-600/50 font-medium">
                        <div>
                            Giai đoạn: <span className="italic no-underline text-blue-600">{hoiDong.giai_doan}</span>
                        </div>
                        <div>
                            Nhóm ngành: <span className="italic no-underline text-blue-600">{hoiDong.nhom_nganh}</span>
                        </div>
                        <div>
                            Hệ đào tạo: <span className="italic no-underline text-blue-600">{hoiDong.he_dao_tao}</span>
                        </div>
                        <div>
                            Phòng: <span className="italic no-underline text-blue-600">{hoiDong.phong}</span>
                        </div>
                        <div>
                            Thời gian: <span className="italic no-underline text-blue-600">{new Date(hoiDong.ngay_gio).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end bg-accent-foreground/10 p-2">
                        {isNow && isGiangVienTruong &&
                            <div className="flex gap-2">
                                <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                    <DialogTrigger asChild>
                                        <Button variant={'outline'} size={'icon'} className="text-green-500">
                                            <IconUsersPlus />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-9/10 overflow-y-auto">
                                        <DialogTitle>Thêm giảng viên vào hội đồng</DialogTitle>
                                        <DialogDescription />
                                        <FormPhanChiaGiangVien idHoiDong={hoiDong.id} />
                                    </DialogContent>
                                </Dialog>
                                <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                    <DialogTrigger asChild>
                                        <Button variant={'outline'} size={'icon'} className="text-green-500">
                                            <IconTablePlus />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-9/10 overflow-y-auto">
                                        <DialogTitle>Thêm đề tài vào hội đồng</DialogTitle>
                                        <DialogDescription />
                                        <FormPhanChiaDeTai idCurrentHocKy={currentHocKy?.current?.id || 0} hoiDong={hoiDong} />
                                    </DialogContent>
                                </Dialog>
                                <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                    <DialogTrigger asChild>
                                        <Button variant={'outline'} size={'icon'} className="text-blue-500">
                                            <IconEditCircle />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-9/10 overflow-y-auto">
                                        <DialogTitle>Sửa tiêu chí</DialogTitle>
                                        <DialogDescription />
                                        <FormHoiDong type="edit" hoiDong={hoiDong} />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        }
                    </div>
                    <div className="p-2 bg-background/10 font-medium flex flex-col gap-2 mb-10 mt-5">
                        <div className="font-bold text-xl">Giảng viên: <span className="text-blue-500">{hoiDong.tham_gia?.length || 0}</span></div>
                        {hoiDong.tham_gia?.length > 0 ? hoiDong.tham_gia.sort((a: any, b: any) => (priority[a.vai_tro] || 99) - (priority[b.vai_tro] || 99))
                            .map((thamGia: any, index0: number) => (
                                <div key={index0} className="border-2 border-accent-foreground/20 rounded-md">
                                    <div className="p-2 flex gap-2 items-center">
                                        <div className="text-green-500">{thamGia.vai_tro}</div>
                                        <div>-</div>
                                        <div className="flex flex-col">
                                            <div>
                                                {thamGia.giang_vien.tai_khoan.ho} {thamGia.giang_vien.tai_khoan.ten}
                                                <span className="italic text-sm">  ({thamGia.giang_vien.msgv})</span>
                                            </div>
                                            <div className="italic text-sm text-gray-500">
                                                {thamGia.giang_vien.tai_khoan.email}
                                            </div>
                                            <div className="italic text-sm text-gray-500">
                                                {thamGia.giang_vien.to_chuyen_nganh}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="text-center my-10">Không có giảng viên nào!</div>}
                    </div>
                    <div className="p-2 bg-background/10 font-medium flex flex-col gap-2">
                        <div className="font-bold text-xl">Đề tài: <span className="text-blue-500">{hoiDong.danh_gia?.length || 0}</span></div>
                        {hoiDong.danh_gia?.length > 0 ? hoiDong.danh_gia.sort((a: any, b: any) => a.de_tai.ma_de_tai.localeCompare(b.de_tai.ma_de_tai)).map((deTai: any, index0: number) => (
                            <div key={index0} className="border-2 border-accent-foreground/20 rounded-md">
                                <div className="p-2 flex gap-2 items-center justify-between">
                                    <div className="flex gap-2 items-center">
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
                                    </div>
                                    <div className="flex gap-2">
                                        {isNow && isGiangVienTruong && <Button variant={'destructive'} className="ml-auto cursor-pointer" onClick={() => handleDeleteDeTai(deTai.de_tai.id)}>Xóa</Button>}
                                        {isNow && hoiDong.tham_gia.some((thamGia: any) => thamGia.giang_vien.id_tai_khoan === user.auth.sub) && <Button className="ml-auto bg-blue-500" onClick={() => navigate('/cham-diem-hoi-dong/' + deTai.de_tai.id)}>Đánh giá</Button>}
                                    </div>
                                </div>
                            </div>
                        )) : <div className="text-center my-10">Không có đề tài nào!</div>}
                    </div>
                </div >
            ))
                : <div className="font-bold text-2xl text-gray-500 text-center">Không tìm thấy hội đồng.</div>
            }
        </div >
    )
}