import { useAuth } from "@/routes/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoiMoiThucHienDeTai } from "./sinh-vien/LoiMoiThucHienDeTai"
import { LoiMoiHuongDanDeTai } from "./giang-vien/LoiMoiHuongDanDeTai"
import { useEffect, useState } from "react"
import DeTaiCuaSinhVien from "./sinh-vien/DeTaiCuaSinhVien"
import DeTaiCuaGiangVien from "./giang-vien/DeTaiCuaGiangVien"
import { getCurrentAndNextHocKy } from "@/services/getCurrentNextHocKy"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DeTaiCuaToi() {
    const [listHocKy, setListHocKy] = useState([])
    const [selectHocKy, setSelectHocKy] = useState("")
    const [deTaiCuaToi, setDeTaiCuaToi] = useState([])
    const { user, badgeCount }: { user: any, badgeCount: any } = useAuth()
    const vaiTro = user?.tai_khoan?.vai_tro

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(vaiTro === "Sinh viên" ? 'http://localhost:3000/dang-ky/sinh-vien?trang_thai=Đã chấp nhận' :
                'http://localhost:3000/huong-dan/giang-vien?trang_thai=Đã chấp nhận&id_hoc_ky=' + selectHocKy, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            if (response.ok) setDeTaiCuaToi(data.sort((a: any, b: any) => a.id - b.id)) // sắp xếp giảm dần theo id
            else console.log("Lấy dữ liệu lỗi: ", data)
        }
        fetchData()
    }, [vaiTro, selectHocKy, badgeCount])


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
                else toast.error('Lỗi khi lấy dữ liệu học kỳ', { description: data1.message })
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [])


    const currentHocKy = getCurrentAndNextHocKy(listHocKy)

    return (
        <div className="w-full p-2">
            <Tabs defaultValue="de-tai-cua-toi" className="w-full">
                <TabsList className="mx-auto">
                    <TabsTrigger value="de-tai-cua-toi">Đề tài của tôi</TabsTrigger>
                    {vaiTro === "Sinh viên" && <TabsTrigger className="flex flex-row items-center" value="loi-moi-lam-de-tai">
                        Lời mời thực hiện
                    </TabsTrigger>}
                    {vaiTro !== "Sinh viên" && <TabsTrigger value="loi-moi-huong-dan">
                        Lời mời hướng dẫn
                    </TabsTrigger>}
                </TabsList>







                {/* CONTENT */}







                <div className="rounded-lg border border-dashed p-2">
                    <TabsContent value="de-tai-cua-toi" className="flex flex-col gap-2">
                        {['Giảng viên', 'Giảng viên trưởng bộ môn'].includes(user.auth.role) && <Select value={selectHocKy} onValueChange={setSelectHocKy}>
                            <SelectTrigger className="flex justify-center w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {listHocKy.length > 0 && listHocKy.map((hocKy: any) => (
                                    <SelectItem key={hocKy.id} value={String(hocKy.id)}>Học kỳ {hocKy.ten_hoc_ky} <span className="text-blue-500 italic">{currentHocKy?.current?.id === hocKy.id && " (Hiện hành)"}</span></SelectItem>
                                ))}
                            </SelectContent>
                        </Select>}
                        {deTaiCuaToi.length > 0 ?
                            (vaiTro === "Sinh viên" ?
                                <DeTaiCuaSinhVien dangKy={deTaiCuaToi[0]} />
                                :
                                <DeTaiCuaGiangVien listHuongDan={deTaiCuaToi} />
                            )
                            : <div className="text-center m-10 font-bold text-2xl text-gray-500">Bạn chưa có đề tài ...</div>}
                    </TabsContent>
                    <TabsContent value="loi-moi-lam-de-tai"><LoiMoiThucHienDeTai /></TabsContent>
                    <TabsContent value="loi-moi-huong-dan"><LoiMoiHuongDanDeTai /></TabsContent>
                </div>
            </Tabs>
        </div>
    )
}