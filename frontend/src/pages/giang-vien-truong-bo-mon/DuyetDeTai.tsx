import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter
} from "@/components/ui/card"
import {
    IconCircleCheckFilled,
    IconCircleXFilled,
    IconLoader,
    IconXboxXFilled,
} from "@tabler/icons-react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon, CheckCircle2Icon, CloudAlert, User } from "lucide-react"
import { useAuth } from "@/routes/auth-context"
import { toast } from "sonner"

export const description = "An interactive area chart"

export function DuyetDeTai() {
    const [listDeTaiChuaDuocDuyet, setListDeTaiChuaDuocDuyet] = useState([])
    const { user }: { user: any } = useAuth()

    const handleAccept = async (id_de_tai: number, trang_thai: string) => {
        try {
            const response = await fetch('http://localhost:3000/duyet-de-tai', {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_de_tai,
                    trang_thai
                })
            })
            if (response.ok) {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CheckCircle2Icon className="text-green-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-green-600" > {trang_thai} duyệt đề tài </div>
                        </div>
                    </div>)
                )
                setListDeTaiChuaDuocDuyet(oldList => oldList.filter((item: any) => item.id != id_de_tai))
            }
            else {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <AlertCircleIcon className="text-red-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-red-600" > {trang_thai} duyệt đề tài thất bại </div>
                            < div > Vui lòng thử lại sau </div>
                        </div>
                    </div>
                ))
                console.log(await response.json())
            }
        } catch (error) {
            toast((
                <div className="flex flex-row items-center w-full gap-5" >
                    <CloudAlert className="text-yellow-600" />
                    <div className="flex flex-col" >
                        <div className="text-lg text-yellow-600" > Lỗi hệ thống </div>
                        < div > Vui lòng thử lại sau </div>
                    </div>
                </div>
            ))
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchDataListDeTaiChuaDuocDuyet = async () => {
            try {
                const response = await fetch('http://localhost:3000/de-tai?trang_thai=GVHD đã chấp nhận&trang_thai_duyet=Chưa duyệt', {
                    method: "GET",
                    credentials: 'include'
                })
                const data = await response.json()
                if (response.ok) setListDeTaiChuaDuocDuyet(data.filter((deTai: any) => deTai.huong_dan[0].giang_vien.to_chuyen_nganh === user.tai_khoan.giang_vien.to_chuyen_nganh))
                else console.log(data)
            } catch (error) {
                console.log(error)
            }
        }


        fetchDataListDeTaiChuaDuocDuyet()
    }, [])

    return (
        <div className="flex flex-col gap-10 rounded-lg border border-dashed m-5 p-5 sm:p-20 sm:m-10">
            {listDeTaiChuaDuocDuyet.length > 0 ? listDeTaiChuaDuocDuyet.map((deTai: any) => {
                return <div className="" key={deTai.id}>
                    <Card className="rounded-4xl border shadow-lg">
                        <CardContent>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>
                                        <div className="flex flex-col">
                                            <div className="text-xl">{deTai.ma_de_tai + " - " + deTai.ten_tieng_viet}</div>
                                            <div className="text-sm italic text-gray-500">
                                                {deTai.ten_tieng_anh}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-4 overflow-y-auto text-sm">
                                            <Separator className="border-1" />
                                            <div className="grid grid-cols-2">
                                                <div className="flex flex-col gap-5">
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Mã đề tài
                                                        </div>
                                                        <div className="text-muted-foreground">{deTai.ma_de_tai}</div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Hệ đào tạo
                                                        </div>
                                                        <div className="text-muted-foreground">{deTai.he_dao_tao}</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-5">
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Giai đoạn
                                                        </div>
                                                        <div className="text-muted-foreground">{deTai.giai_doan}</div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Nhóm ngành
                                                        </div>
                                                        <div className="text-muted-foreground">{deTai.nhom_nganh}</div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Giảng viên hướng dẫn
                                                </div>
                                                <div className="grid gap-2">
                                                    <ScrollArea className="h-auto max-h-[150px] w-auto rounded-md border px-2">
                                                        {deTai.huong_dan.map((huongDan: any) => (
                                                            <div className="w-full flex flex-row items-center my-2" key={huongDan.id}>
                                                                <User className="mr-2 scale-75" />
                                                                <div className="w-full">
                                                                    <div className="text-sm">
                                                                        {huongDan.giang_vien.msgv + " - " + huongDan.giang_vien.tai_khoan.ho + " " + huongDan.giang_vien.tai_khoan.ten}
                                                                        {huongDan.trang_thai === "Đã chấp nhận" ? (
                                                                            <Badge variant={'secondary'}><IconCircleCheckFilled className="text-green-500" />Đã chấp nhận</Badge>
                                                                        ) : huongDan.trang_thai === "Chưa chấp nhận" ? (
                                                                            <Badge variant={'secondary'}><IconLoader />Chưa chấp nhận</Badge>
                                                                        ) : (
                                                                            <Badge variant={'secondary'}><IconXboxXFilled className="text-red-500" />Đã từ chối</Badge>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-sm">{huongDan.giang_vien.tai_khoan.email}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </ScrollArea>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2">
                                                <div className="grid gap-2">
                                                    <div className="flex leading-none font-medium">
                                                        Số sinh viên đăng ký
                                                    </div>
                                                    <div className="text-muted-foreground">{deTai.so_sinh_vien_dang_ky}</div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex leading-none font-medium">
                                                        Số sinh viên yêu cầu
                                                    </div>
                                                    <div className="text-muted-foreground">{deTai.so_luong_sinh_vien}</div>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <ScrollArea className="h-auto max-h-[150px] rounded-md border px-2">
                                                    {deTai.dang_ky.map((sinhVienDangKy: any) => (
                                                        <div className="w-full flex flex-row items-center my-2" key={sinhVienDangKy.id}>
                                                            <User className="mr-2 scale-75" />
                                                            <div className="w-full">
                                                                <div className="text-sm">{sinhVienDangKy.sinh_vien.mssv + " - " + sinhVienDangKy.sinh_vien.tai_khoan.ho + " " + sinhVienDangKy.sinh_vien.tai_khoan.ten}</div>
                                                                <div className="text-sm">{sinhVienDangKy.sinh_vien.tai_khoan.email}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ScrollArea>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Mô tả
                                                </div>
                                                <div className="text-muted-foreground">{deTai.mo_ta}</div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Yêu cầu nội dung và số liệu ban đầu
                                                </div>
                                                <div className="text-muted-foreground">{deTai.yeu_cau_va_so_lieu}</div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Tài liệu tham khảo
                                                </div>
                                                <div className="text-muted-foreground">{deTai.tai_lieu_tham_khao}</div>
                                            </div>
                                            <Separator className="border-1" />
                                            <div className="grid grid-cols-2">
                                                <div className="grid gap-2">
                                                    <div className="flex leading-none font-medium">
                                                        Ngày đề xuất
                                                    </div>
                                                    <div className="text-muted-foreground">{new Date(deTai.ngay_tao).toLocaleString()}</div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex leading-none font-medium">
                                                        Người đề xuất
                                                    </div>
                                                    <div className="text-muted-foreground">{deTai.tai_khoan.vai_tro}:
                                                        {(deTai.tai_khoan.sinh_vien?.mssv || deTai.tai_khoan.giang_vien?.msgv) + " - " + deTai.tai_khoan.ho + " " + deTai.tai_khoan.ten}</div>
                                                    <div className="text-muted-foreground">{deTai.tai_khoan.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                        <CardFooter className="flex flex-row justify-end gap-5">
                            <Button variant='outline' className="text-red-400 rounded-4xl border shadow-lg" onClick={() => handleAccept(deTai.id, "Đã từ chối")}>
                                <IconCircleXFilled />
                            </Button>
                            <Button variant='outline' className="text-green-600 rounded-4xl border shadow-lg" onClick={() => handleAccept(deTai.id, "Đã chấp nhận")}>
                                <IconCircleCheckFilled /> Duyệt
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            }) : <div className="font-bold text-2xl my-10 text-center text-gray-500">Không có đề tài nào được gửi!</div>}
        </div>
    )
}
