import { useAuth } from "@/routes/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoiMoiThucHienDeTai } from "./sinh-vien/LoiMoiThucHienDeTai"
import { LoiMoiHuongDanDeTai } from "./giang-vien/LoiMoiHuongDanDeTai"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import DeTaiCuaSinhVien from "./sinh-vien/DeTaiCuaSinhVien"
import DeTaiCuaGiangVien from "./giang-vien/DeTaiCuaGiangVien"

export default function DeTaiCuaToi() {
    const [deTaiCuaToi, setDeTaiCuaToi] = useState([])
    const { user, notifications }: { user: any, notifications: any } = useAuth()
    const vaiTro = user?.tai_khoan?.vai_tro

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(vaiTro === "Sinh viên" ? 'http://localhost:3000/dang-ky/sinh-vien?trang_thai=Đã chấp nhận' :
                'http://localhost:3000/huong-dan/giang-vien?trang_thai=Đã chấp nhận', {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            if (response.ok) setDeTaiCuaToi(data)
            else console.log("Lấy dữ liệu lỗi: ", data)
        }
        fetchData()
    }, [])


    return (
        <div className="w-full p-2">
            <Tabs defaultValue="de-tai-cua-toi" className="w-full">
                <TabsList className="mx-auto">
                    <TabsTrigger value="de-tai-cua-toi">Đề tài của tôi</TabsTrigger>
                    {vaiTro === "Sinh viên" && <TabsTrigger className="flex flex-row items-center" value="loi-moi-lam-de-tai">
                        Lời mời thực hiện
                        {notifications?.de_tai_chua_chap_nhan !== 0 && <Badge className="bg-red-500 h-5 min-w-5 round-full px-1 text-accent-foreground">{notifications?.de_tai_chua_chap_nhan}</Badge>}
                    </TabsTrigger>}
                    {vaiTro !== "Sinh viên" && <TabsTrigger value="loi-moi-huong-dan">
                        Lời mời hướng dẫn
                        {notifications?.de_tai_chua_chap_nhan !== 0 && <Badge className="bg-red-500 h-5 min-w-5 round-full px-1 text-accent-foreground">{notifications?.de_tai_chua_chap_nhan}</Badge>}
                    </TabsTrigger>}
                </TabsList>







                {/* CONTENT */}







                <div className="rounded-lg border border-dashed">
                    <TabsContent value="de-tai-cua-toi">
                        {deTaiCuaToi.length > 0 ?
                            (vaiTro === "Sinh viên" ? <DeTaiCuaSinhVien dangKy={deTaiCuaToi[0]} /> :
                                <DeTaiCuaGiangVien listHuongDan={deTaiCuaToi} />
                            )
                            : <div>Bạn chưa có đề tài ...</div>}
                    </TabsContent>
                    <TabsContent value="loi-moi-lam-de-tai"><LoiMoiThucHienDeTai /></TabsContent>
                    <TabsContent value="loi-moi-huong-dan"><LoiMoiHuongDanDeTai /></TabsContent>
                </div>
            </Tabs>
        </div>
    )
}