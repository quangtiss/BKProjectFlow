import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircleIcon, Check, CheckCircle2Icon, CloudAlert, User, X } from "lucide-react";
import { IconCircleCheckFilled, IconXboxXFilled, IconLoader } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";



export function LoiMoiThucHienDeTai() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [listDangKy, setListDangKy] = useState([])

    const handleToggleExpand = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleAccept = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/dang-ky/trang-thai/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trang_thai: "Đã chấp nhận"
                })
            })
            if (response.ok) {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CheckCircle2Icon className="text-green-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-green-600" > Đã chấp nhận làm đề tài </div>
                            < div > Đề tài vẫn có thể bị hủy nếu giảng viên từ chối duyệt hoặc hướng dẫn </div>
                        </div>
                    </div>)
                )
                setListDangKy(listDangKy.filter(item => item.id !== id))
            } else {
                const dataError = await response.json()
                if (dataError.message === "Số lượng sinh viên đăng ký đã đầy") {
                    toast((
                        <div className="flex flex-row items-center w-full gap-5" >
                            <AlertCircleIcon className="text-red-600" />
                            <div className="flex flex-col" >
                                <div className="text-lg text-red-600" > Số lượng sinh viên đăng ký đã đầy </div>
                                < div > Hệ thống sẽ tự động từ chối </div>
                            </div>
                        </div>
                    ))
                    await handleReject(id)
                } else {
                    toast((
                        <div className="flex flex-row items-center w-full gap-5" >
                            <AlertCircleIcon className="text-red-600" />
                            <div className="flex flex-col" >
                                <div className="text-lg text-red-600" > Không thể chấp nhận lời mời </div>
                                < div > Vui lòng thử lại sau </div>
                            </div>
                        </div>
                    ))
                }
                console.log(dataError)
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
            console.error(error)
        }
    };

    const handleReject = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/dang-ky/trang-thai/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trang_thai: "Đã từ chối"
                })
            })
            if (response.ok) {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CheckCircle2Icon className="text-green-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-green-600" > Đã từ chối làm đề tài </div>
                        </div>
                    </div>)
                )
                setListDangKy(listDangKy.filter(item => item.id !== id))
            } else {
                toast((
                    <div className="flex flex-row items-center w-full gap-5" >
                        <AlertCircleIcon className="text-red-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-red-600" > Không thể từ chối </div>
                            < div > Vui lòng thử lại sau </div>
                        </div>
                    </div>
                ))
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
            console.error(error)
        }
    };

    useEffect(() => {
        const fetchListDangKy = async () => {
            try {
                const response = await fetch("http://localhost:3000/dang-ky/sinh-vien?trang_thai=Chưa chấp nhận", {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                setListDangKy(data)
                console.log(data)
            } catch (error) {
                console.log("Error ", error)
            }
        }
        fetchListDangKy();
    }, [])


    return (
        <div className="grid grid-cols-1 gap-6 p-2 bg-background">
            {listDangKy.map((dangKy) => {
                const isExpanded = expandedId === dangKy.id;
                return (
                    <Card
                        key={dangKy.id}
                        onClick={() => handleToggleExpand(dangKy.id)}
                        className={`rounded-2xl border border-border shadow-lg dark:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden "}`}
                        style={{ minHeight: "200px" }}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold leading-snug">{dangKy.de_tai.ma_de_tai + " - " + dangKy.de_tai.ten_tieng_viet}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dangKy.de_tai.ten_tieng_anh}</p>
                                </div>
                            </div>
                            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "h-auto opacity-100 mt-4" : "max-h-0 opacity-0"
                                } text-sm text-foreground`}>
                                <div className="flex flex-col gap-4 overflow-y-auto text-sm">
                                    <Separator className="border-1" />
                                    <div className="grid grid-cols-2">
                                        <div className="flex flex-col gap-5">
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Mã đề tài
                                                </div>
                                                <div className="text-muted-foreground">{dangKy.de_tai.ma_de_tai}</div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Hệ đào tạo
                                                </div>
                                                <div className="text-muted-foreground">{dangKy.de_tai.he_dao_tao}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-5">
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Giai đoạn
                                                </div>
                                                <div className="text-muted-foreground">{dangKy.de_tai.giai_doan}</div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Nhóm ngành
                                                </div>
                                                <div className="text-muted-foreground">{dangKy.de_tai.nhom_nganh}</div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex leading-none font-medium">
                                            Giảng viên hướng dẫn
                                        </div>
                                        <div className="grid gap-2">
                                            <ScrollArea className="h-auto max-h-[150px] w-auto rounded-md border px-2">
                                                {dangKy.de_tai.huong_dan.map((huongDan) => (
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
                                            <div className="text-muted-foreground">{dangKy.de_tai.so_sinh_vien_dang_ky}</div>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex leading-none font-medium">
                                                Số sinh viên yêu cầu
                                            </div>
                                            <div className="text-muted-foreground">{dangKy.de_tai.so_luong_sinh_vien}</div>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <ScrollArea className="h-auto max-h-[150px] rounded-md border px-2">
                                            {dangKy.de_tai.dang_ky.map((sinhVienDangKy) => (
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
                                        <div className="text-muted-foreground">{dangKy.de_tai.mo_ta}</div>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex leading-none font-medium">
                                            Yêu cầu nội dung và số liệu ban đầu
                                        </div>
                                        <div className="text-muted-foreground">{dangKy.de_tai.yeu_cau_va_so_lieu}</div>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex leading-none font-medium">
                                            Tài liệu tham khảo
                                        </div>
                                        <div className="text-muted-foreground">{dangKy.de_tai.tai_lieu_tham_khao}</div>
                                    </div>
                                    <Separator className="border-1" />
                                    <div className="grid grid-cols-2">
                                        <div className="grid gap-2">
                                            <div className="flex leading-none font-medium">
                                                Ngày đề xuất
                                            </div>
                                            <div className="text-muted-foreground">{new Date(dangKy.de_tai.ngay_tao).toLocaleString()}</div>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="flex leading-none font-medium">
                                                Người đề xuất
                                            </div>
                                            <div className="text-muted-foreground">{dangKy.de_tai.tai_khoan.vai_tro}:
                                                {(dangKy.de_tai.tai_khoan.sinh_vien?.mssv || dangKy.de_tai.tai_khoan.giang_vien?.msgv) + " - " + dangKy.de_tai.tai_khoan.ho + " " + dangKy.de_tai.tai_khoan.ten}</div>
                                            <div className="text-muted-foreground">{dangKy.de_tai.tai_khoan.email}</div>
                                        </div>
                                    </div>
                                    <div className="grid gap-2 mb-3">
                                        <div className="flex leading-none font-medium">
                                            Tình trạng duyệt
                                        </div>
                                        <div className="text-muted-foreground">
                                            {
                                                dangKy.de_tai.trang_thai_duyet === "Chưa duyệt" ? (
                                                    <Badge variant={'secondary'}><IconLoader />Chưa duyệt</Badge>
                                                ) : dangKy.de_tai.duyet_de_tai.trang_thai === "Đã chấp nhận" ? (
                                                    <Badge variant={'secondary'}><IconCircleCheckFilled className="text-green-500" />Đã chấp nhận</Badge>
                                                ) : (
                                                    <Badge variant={'secondary'}><IconXboxXFilled className="text-red-500" />Đã từ chối</Badge>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {dangKy.de_tai.duyet_de_tai ? (
                                        <div className="grid grid-cols-2">
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Ngày duyệt
                                                </div>
                                                <div className="text-muted-foreground">{new Date(dangKy.de_tai.duyet_de_tai.ngay_duyet).toLocaleString()}</div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex leading-none font-medium">
                                                    Người duyệt
                                                </div>
                                                <div className="text-muted-foreground">
                                                    {dangKy.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.vai_tro}:
                                                    {dangKy.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.msgv + " - " + dangKy.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.ho + " " + dangKy.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.ten}
                                                </div>
                                                <div className="text-muted-foreground">{dangKy.de_tai.duyet_de_tai.giang_vien_truong_bo_mon.tai_khoan.email}</div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 px-6 pb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-destructive text-destructive active:text-secondary "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(dangKy.id);
                                }}
                            >
                                <X className="w-4 h-4 mr-1" /> Từ chối
                            </Button>
                            <Button
                                size="sm"
                                variant='outline'
                                className="rounded-xl border-green-500 text-green-500 active:bg-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAccept(dangKy.id);
                                }}
                            >
                                <Check className="w-4 h-4 mr-1" /> Chấp nhận
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}