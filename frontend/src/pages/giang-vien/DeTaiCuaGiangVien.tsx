import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconCircleCheckFilled, IconLoader, IconUserPlus, IconXboxXFilled } from "@tabler/icons-react";
import { useState } from "react";
import TeacherMultiSelect from "@/components/ui/multiselect-gv";
import { Badge } from "@/components/ui/badge";
import { TienDoTrigger } from "../TienDo";

export default function DeTaiCuaGiangVien({ listHuongDan }: { listHuongDan: Array<object> }) {
    const [recordExpand, setRecordExpand] = useState()
    return (
        <div className="grid gap-5">
            {
                listHuongDan.map((huongDan: any) => {
                    const isExpand = recordExpand === huongDan.id
                    return (
                        <div key={huongDan.id}>
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
                                                            {huongDan?.de_tai.huong_dan.map((huongDan: any) => (
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
                                                            {huongDan.de_tai.dang_ky.map((sinhVienDangKy: any) => (
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
                                                    <div className="grid gap-2 mb-3">
                                                        <div className="flex leading-none font-medium">
                                                            Tình trạng duyệt
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            {
                                                                huongDan.de_tai.trang_thai_duyet === "Chưa duyệt" ? (
                                                                    <Badge variant={'secondary'}><IconLoader />Chưa duyệt</Badge>
                                                                ) : huongDan.de_tai.duyet_de_tai.trang_thai === "Đã chấp nhận" ? (
                                                                    <Badge variant={'secondary'}><IconCircleCheckFilled className="text-green-500" />Đã chấp nhận</Badge>
                                                                ) : (
                                                                    <Badge variant={'secondary'}><IconXboxXFilled className="text-red-500" />Đã từ chối</Badge>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    {huongDan.de_tai.duyet_de_tai ? (
                                                        <div className="grid grid-cols-2">
                                                            <div className="grid gap-2">
                                                                <div className="flex leading-none font-medium">
                                                                    Ngày duyệt
                                                                </div>
                                                                <div className="text-muted-foreground">{new Date(huongDan.de_tai.duyet_de_tai.ngay_duyet).toLocaleString()}</div>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <div className="flex leading-none font-medium">
                                                                    Người duyệt
                                                                </div>
                                                                <div className="text-muted-foreground">
                                                                    {huongDan.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.vai_tro}:
                                                                    {huongDan.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.msgv + " - " + huongDan.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.ho + " " + huongDan.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.ten}
                                                                </div>
                                                                <div className="text-muted-foreground">{huongDan.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.email}</div>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </CardContent>
                                <CardFooter className="flex flex-col items-center gap-5 w-full">
                                    <div className="flex flex-row justify-end w-full">
                                        <Button variant={'secondary'} size={'icon'} onClick={() => setRecordExpand((prev) => prev !== huongDan.id ? huongDan.id : null)}>
                                            <IconUserPlus />
                                        </Button>
                                    </div>
                                    <div className="w-full">
                                        {isExpand && <div className="animate-in fade-in slide-in-from-top duration-500 p-2 shadow-2xl rounded-2xl border-1"><TeacherMultiSelect deTai={huongDan?.de_tai} /></div>}
                                    </div>
                                    <TienDoTrigger idDeTai={huongDan.de_tai.id} />
                                </CardFooter>
                            </Card>
                        </div>
                    )
                })
            }
        </div>
    )
}