import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/routes/auth-context"
import { getCurrentAndNextHocKy } from "@/services/getCurrentNextHocKy"
import { User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function PhanBien() {
    const { user }: { user: any } = useAuth()
    const navigate = useNavigate()
    const isGiangVienTruong = user.auth.role === 'Giảng viên trưởng bộ môn'
    const [listDeTai, setListDeTai] = useState([])
    const [listGiangVien, setListGiangVien] = useState([])
    const [toggle, setToggle] = useState(false)

    async function onSubmit(idGV: number, idDeTai: number, type: 'PATCH' | 'POST') {
        try {
            const response = await fetch('http://localhost:3000/phan-bien', {
                method: type,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_de_tai: idDeTai, id_giang_vien: idGV })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Đã lưu')
                setToggle(prev => !prev)
            }
            else toast.error('Lỗi khi lưu', { description: data.message })
        } catch (error) {
            console.error(error)
            toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
        }
    }

    useEffect(() => {
        const fetchDeTai = async () => {
            try {
                const response1 = await fetch('http://localhost:3000/hoc-ky', { method: 'GET', credentials: 'include' })
                const data1 = await response1.json()
                if (response1.ok) {
                    const current = getCurrentAndNextHocKy(data1)?.current?.id


                    const response = await fetch('http://localhost:3000/duyet-de-tai?giai_doan=Đồ án tốt nghiệp&trang_thai=Đã chấp nhận&id_hoc_ky=' + current, { method: 'GET', credentials: 'include' })
                    const data = await response.json()
                    if (response.ok) {
                        setListDeTai(data.sort((a: any, b: any) => a.de_tai.ma_de_tai.localeCompare(b.de_tai.ma_de_tai)))
                    } else {
                        toast.error('Lỗi khi lấy dữ liệu đề tài', { description: data.message })
                    }


                    const response0 = await fetch('http://localhost:3000/giang-vien', { method: 'GET', credentials: 'include' })
                    const data0 = await response0.json()
                    if (response0.ok) {
                        const sortedData = data0.sort((a: any, b: any) => a.msgv.localeCompare(b.msgv));
                        setListGiangVien(sortedData);
                    } else {
                        toast.error('Lỗi khi lấy dữ liệu giảng viên', { description: data.message })
                    }
                }
                else toast.error('Lỗi khi lấy dữ liệu', { description: data1.message })
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchDeTai()
    }, [toggle])



    return (
        <div className="p-5 sm:p-20">
            <div className="border border-dashed p-2 rounded-2xl flex flex-col gap-10">
                {listDeTai?.length > 0 ?
                    listDeTai.map((item: any, index: number) => {
                        return (
                            <Card key={index}>
                                <CardContent>
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="information">
                                            <AccordionTrigger>
                                                <div className="gap-1">
                                                    <div className="text-xl">{item.de_tai.ten_tieng_viet}</div>
                                                    <div className="text-sm italic text-gray-500">{item.de_tai.ten_tieng_anh}</div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div>
                                                    <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                                                        <Separator className="border-1" />
                                                        <div className="grid grid-cols-2">
                                                            <div className="flex flex-col gap-5">
                                                                <div className="grid gap-2">
                                                                    <div className="flex leading-none font-medium">Mã đề tài</div>
                                                                    <div className="text-muted-foreground">
                                                                        {item.de_tai.ma_de_tai}
                                                                    </div>
                                                                </div>
                                                                <div className="grid gap-2">
                                                                    <div className="flex leading-none font-medium">Hệ đào tạo</div>
                                                                    <div className="text-muted-foreground">
                                                                        {item.de_tai.he_dao_tao}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-5">
                                                                <div className="grid gap-2">
                                                                    <div className="flex leading-none font-medium">Giai đoạn</div>
                                                                    <div className="text-muted-foreground">
                                                                        {item.de_tai.giai_doan}
                                                                    </div>
                                                                </div>
                                                                <div className="grid gap-2">
                                                                    <div className="flex leading-none font-medium">Nhóm ngành</div>
                                                                    <div className="text-muted-foreground">
                                                                        {item.de_tai.nhom_nganh}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <div className="flex leading-none font-medium">
                                                                Giảng viên hướng dẫn
                                                            </div>
                                                            <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
                                                                {item.de_tai.huong_dan.map((huongDan: any) => (
                                                                    <div className="flex flex-row items-center" key={huongDan.id}>
                                                                        <User className="mr-2 scale-75" />
                                                                        <div>
                                                                            <div className="text-sm mt-2">
                                                                                {huongDan.giang_vien.msgv +
                                                                                    " - " +
                                                                                    huongDan.giang_vien.tai_khoan.ho +
                                                                                    " " +
                                                                                    huongDan.giang_vien.tai_khoan.ten}
                                                                            </div>
                                                                            <div className="text-sm">
                                                                                {huongDan.giang_vien.tai_khoan.email}
                                                                            </div>
                                                                            <div className="text-sm italic text-gray-500">
                                                                                {huongDan.vai_tro}
                                                                            </div>
                                                                            <Separator className="mt-2" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </ScrollArea>
                                                        </div>
                                                        <div className="grid grid-cols-2">
                                                            <div className="grid gap-2">
                                                                <div className="flex leading-none font-medium">
                                                                    Số sinh viên đăng ký
                                                                </div>
                                                                <div className="text-muted-foreground">
                                                                    {item.de_tai.so_sinh_vien_dang_ky}
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <div className="flex leading-none font-medium">
                                                                    Số sinh viên yêu cầu
                                                                </div>
                                                                <div className="text-muted-foreground">
                                                                    {item.de_tai.so_luong_sinh_vien}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
                                                                {item.de_tai.dang_ky.map((sinhVienDangKy: any) => (
                                                                    <div
                                                                        className="flex flex-row items-center"
                                                                        key={sinhVienDangKy.id}
                                                                    >
                                                                        <User className="mr-2 scale-75" />
                                                                        <div>
                                                                            <div className="text-sm mt-2">
                                                                                {sinhVienDangKy.sinh_vien.mssv +
                                                                                    " - " +
                                                                                    sinhVienDangKy.sinh_vien.tai_khoan.ho +
                                                                                    " " +
                                                                                    sinhVienDangKy.sinh_vien.tai_khoan.ten}
                                                                            </div>
                                                                            <div className="text-sm">
                                                                                {sinhVienDangKy.sinh_vien.tai_khoan.email}
                                                                            </div>
                                                                            <Separator className="mt-2" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </ScrollArea>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <div className="flex leading-none font-medium">Mô tả</div>
                                                            <div className="text-muted-foreground">{item.de_tai.mo_ta}</div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <div className="flex leading-none font-medium">
                                                                Yêu cầu nội dung và số liệu ban đầu
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                {item.de_tai.yeu_cau_va_so_lieu}
                                                            </div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <div className="flex leading-none font-medium">
                                                                Tài liệu tham khảo
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                {item.de_tai.tai_lieu_tham_khao}
                                                            </div>
                                                        </div>
                                                        <Separator className="border-1" />
                                                        <div className="grid grid-cols-2">
                                                            <div className="grid gap-2">
                                                                <div className="flex leading-none font-medium">Ngày tạo</div>
                                                                <div className="text-muted-foreground">
                                                                    {new Date(item.de_tai.ngay_tao).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <div className="flex leading-none font-medium">Người duyệt</div>
                                                                <div className="text-muted-foreground">
                                                                    {item.giang_vien_truong_bo_mon.msgv +
                                                                        " - " +
                                                                        item.giang_vien_truong_bo_mon.tai_khoan.ho +
                                                                        " " +
                                                                        item.giang_vien_truong_bo_mon.tai_khoan.ten}
                                                                </div>
                                                                <div className="text-muted-foreground">
                                                                    {item.giang_vien_truong_bo_mon.tai_khoan.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                                <CardFooter>
                                    <Select onValueChange={(value) => {
                                        if (item.de_tai.phan_bien.every((pb: any) => pb.trang_thai === 'Đã chấm')) onSubmit(+value, item.de_tai.id, 'POST')
                                        else onSubmit(+value, item.de_tai.id, 'PATCH')
                                    }}
                                        value={String(item.de_tai.phan_bien.find((pb: any) => pb.trang_thai === 'Chưa chấm')?.id_giang_vien)}
                                    >
                                        <SelectTrigger
                                            className="w-1/2" disabled={!isGiangVienTruong}
                                        >
                                            <SelectValue placeholder="Chọn giảng viên phản biện" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {listGiangVien.filter((gv: any) => !item.de_tai.huong_dan.some((hd: any) => hd.id_giang_vien === gv.id_tai_khoan && hd.trang_thai === 'Đã chấp nhận')).map((giangVien: any) => (
                                                <SelectItem key={giangVien.id_tai_khoan} value={String(giangVien.id_tai_khoan)}>
                                                    {giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten} ({giangVien.msgv})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {item.de_tai.phan_bien.some((pb: any) => pb.id_giang_vien === user.auth.sub && pb.trang_thai === 'Chưa chấm') &&
                                        <Button className="bg-green-500 ml-auto" onClick={() => navigate('/cham-diem-phan-bien/' + item.de_tai.id)}>
                                            Phản biện
                                        </Button>}
                                </CardFooter>
                            </Card>
                        )
                    }) : <div className="text-center mb-5">Không có kết quả.</div>
                }
            </div>
        </div>
    )
}