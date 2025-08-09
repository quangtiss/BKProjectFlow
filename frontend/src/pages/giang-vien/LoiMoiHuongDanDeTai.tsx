"use client";

// import * as React from "react"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    IconCircleCheckFilled,
    IconCircleXFilled
} from "@tabler/icons-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon, CheckCircle2Icon, CloudAlert, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const description = "An interactive area chart";

export function LoiMoiHuongDanDeTai() {
    const isMobile = useIsMobile();
    const [listDeTaiChuaChapNhan, setListDeTaiChuaChapNhan] = useState([])



    const handleAccept = async (id, trang_thai) => {
        try {
            const response = await fetch(`http://localhost:3000/huong-dan/trang-thai/${id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    trang_thai
                })
            })
            if (response.ok) {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CheckCircle2Icon className="text-green-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-green-600" > {trang_thai} hướng dẫn đề tài </div>
                        </div>
                    </div>)
                )
                setListDeTaiChuaChapNhan(prev =>
                    prev.filter(item => item.id !== id)
                );
            }
            else {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <AlertCircleIcon className="text-red-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-red-600" > {trang_thai} hướng dẫn đề tài thất bại </div>
                            < div > Có vẻ như có một số trường lỗi </div>
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
        const fetchListDeTaiChuaChapNhan = async () => {
            try {
                const response = await fetch("http://localhost:3000/huong-dan/giang-vien?trang_thai=Chưa chấp nhận", {
                    method: "GET",
                    credentials: 'include'
                })
                const data = await response.json()
                console.log(data)
                setListDeTaiChuaChapNhan(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchListDeTaiChuaChapNhan()
    }, [isMobile]);

    return (
        <div className="p-1"><Card className="@container/card">
            <CardHeader>
                <CardTitle></CardTitle>
                <CardAction>
                </CardAction>
            </CardHeader>
            <CardContent className="px-3">
                {listDeTaiChuaChapNhan.map((huongDan) => {
                    return <div key={huongDan.id} className="mb-10">
                        <Card>
                            <CardHeader>
                                <CardTitle>{huongDan.de_tai.ma_de_tai + " - " + huongDan.de_tai.ten_tieng_viet}</CardTitle>
                                <CardDescription>
                                    {huongDan.de_tai.ten_tieng_anh}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="iformations">
                                        <AccordionTrigger>
                                            Thông tin chi tiết
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
                                                            <div className="text-muted-foreground">{huongDan.de_tai.ma_de_tai}</div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <div className="flex leading-none font-medium">
                                                                Hệ đào tạo
                                                            </div>
                                                            <div className="text-muted-foreground">{huongDan.de_tai.he_dao_tao}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-5">
                                                        <div className="grid gap-2">
                                                            <div className="flex leading-none font-medium">
                                                                Giai đoạn
                                                            </div>
                                                            <div className="text-muted-foreground">{huongDan.de_tai.giai_doan}</div>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <div className="flex leading-none font-medium">
                                                                Nhóm ngành
                                                            </div>
                                                            <div className="text-muted-foreground">{huongDan.de_tai.nhom_nganh}</div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className="grid gap-3">
                                                    <div className="flex leading-none font-medium">
                                                        Giảng viên hướng dẫn
                                                    </div>
                                                    <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
                                                        {huongDan?.de_tai.huong_dan.map((huongDan) => (
                                                            <div
                                                                className="flex flex-row items-center"
                                                                key={huongDan.id}
                                                            >
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
                                                        <div className="text-muted-foreground">{huongDan.de_tai.so_sinh_vien_dang_ky}</div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Số sinh viên yêu cầu
                                                        </div>
                                                        <div className="text-muted-foreground">{huongDan.de_tai.so_luong_sinh_vien}</div>
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <ScrollArea className="h-auto max-h-[150px] rounded-md border px-2">
                                                        {huongDan.de_tai.dang_ky.map((sinhVienDangKy) => (
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
                                                    <div className="text-muted-foreground">{huongDan.de_tai.mo_ta}</div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex leading-none font-medium">
                                                        Yêu cầu nội dung và số liệu ban đầu
                                                    </div>
                                                    <div className="text-muted-foreground">{huongDan.de_tai.yeu_cau_va_so_lieu}</div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="flex leading-none font-medium">
                                                        Tài liệu tham khảo
                                                    </div>
                                                    <div className="text-muted-foreground">{huongDan.de_tai.tai_lieu_tham_khao}</div>
                                                </div>
                                                <Separator className="border-1" />
                                                <div className="grid grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Ngày đề xuất
                                                        </div>
                                                        <div className="text-muted-foreground">{new Date(huongDan.de_tai.ngay_tao).toLocaleString()}</div>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="flex leading-none font-medium">
                                                            Người đề xuất
                                                        </div>
                                                        <div className="text-muted-foreground">{huongDan.de_tai.tai_khoan.vai_tro}:
                                                            {(huongDan.de_tai.tai_khoan.sinh_vien?.mssv || huongDan.de_tai.tai_khoan.giang_vien?.msgv) + " - " + huongDan.de_tai.tai_khoan.ho + " " + huongDan.de_tai.tai_khoan.ten}</div>
                                                        <div className="text-muted-foreground">{huongDan.de_tai.tai_khoan.email}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="flex flex-row justify-end">
                                <Button variant={"outline"} onClick={() => handleAccept(huongDan.id, "Đã từ chối")}>
                                    Từ chối <IconCircleXFilled className="text-red-400" />
                                </Button>
                                <Button variant={"outline"} className="mx-5" onClick={() => handleAccept(huongDan.id, "Đã chấp nhận")}>
                                    Chấp nhận <IconCircleCheckFilled className="text-green-400" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                })}
            </CardContent>
        </Card></div>
    );
}