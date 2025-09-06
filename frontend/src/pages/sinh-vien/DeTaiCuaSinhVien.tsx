import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IconCircleCheckFilled, IconLoader, IconXboxXFilled } from "@tabler/icons-react";
import { User } from "lucide-react";
import { TienDoTrigger } from "../TienDo";

export default function DeTaiCuaSinhVien({ dangKy }: { dangKy: any }) {
    return (
        <div className="flex flex-col gap-4 overflow-y-auto p-4 text-sm">
            <TienDoTrigger idDeTai={dangKy.id_de_tai} />
            <div className="gap-1">
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    {dangKy.de_tai.ten_tieng_viet}
                </h3>
                <p className="leading-7 [&:not(:first-child)]:mt-1">
                    {dangKy.de_tai.ten_tieng_anh}
                </p>
            </div>
            <Separator className="border-1" />
            <div className="grid grid-cols-2">
                <div className="flex flex-col gap-5">
                    <div className="grid gap-2">
                        <div className="flex leading-none font-medium">Mã đề tài</div>
                        <div className="text-muted-foreground">
                            {dangKy?.de_tai.ma_de_tai}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex leading-none font-medium">Hệ đào tạo</div>
                        <div className="text-muted-foreground">
                            {dangKy?.de_tai.he_dao_tao}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="grid gap-2">
                        <div className="flex leading-none font-medium">Giai đoạn</div>
                        <div className="text-muted-foreground">
                            {dangKy?.de_tai.giai_doan}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex leading-none font-medium">Nhóm ngành</div>
                        <div className="text-muted-foreground">
                            {dangKy?.de_tai.nhom_nganh}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid gap-3">
                <div className="flex leading-none font-medium">
                    Giảng viên hướng dẫn
                </div>
                <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
                    {dangKy.de_tai.huong_dan.map((huongDan: any) => (
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
            <div className="grid grid-cols-2">
                <div className="grid gap-2">
                    <div className="flex leading-none font-medium">
                        Số sinh viên đăng ký
                    </div>
                    <div className="text-muted-foreground">
                        {dangKy?.de_tai.so_sinh_vien_dang_ky}
                    </div>
                </div>
                <div className="grid gap-2">
                    <div className="flex leading-none font-medium">
                        Số sinh viên yêu cầu
                    </div>
                    <div className="text-muted-foreground">
                        {dangKy?.de_tai.so_luong_sinh_vien}
                    </div>
                </div>
            </div>
            <div className="grid gap-2">
                <ScrollArea className="h-auto max-h-[150px] w-full rounded-md border px-2">
                    {dangKy.de_tai.dang_ky.map((sinhVienDangKy: any) => (
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
                <div className="text-muted-foreground">{dangKy?.de_tai.mo_ta}</div>
            </div>
            <div className="grid gap-2">
                <div className="flex leading-none font-medium">
                    Yêu cầu nội dung và số liệu ban đầu
                </div>
                <div className="text-muted-foreground">{dangKy?.de_tai.yeu_cau_va_so_lieu}</div>
            </div>
            <div className="grid gap-2">
                <div className="flex leading-none font-medium">
                    Tài liệu tham khảo
                </div>
                <div className="text-muted-foreground">{dangKy?.de_tai.tai_lieu_tham_khao}</div>
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
    )
}