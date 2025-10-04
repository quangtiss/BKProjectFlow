import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListFilter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IconCircleCheckFilled, IconLoader, IconUserPlus, IconXboxXFilled } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import TeacherMultiSelect from "@/components/ui/multiselect-gv";
import { Badge } from "@/components/ui/badge";
import { TienDoTrigger } from "../TienDo";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function DeTaiCuaGiangVien({ listHuongDan }:
    { listHuongDan: Array<object> }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [recordExpand, setRecordExpand] = useState()
    const [filters, setFilters] = useState({
        soSinhVien: "",
        daDangKy: false,
        trangThai: "",
        nhomNganh: "",
        heDaoTao: "",
        giaiDoan: ""
    });
    const navigate = useNavigate()


    const filterListHuongDan = useMemo(() => {
        return listHuongDan.filter((huongDan: any) => {
            const dataStr =
                (
                    huongDan.de_tai.ma_de_tai +
                    huongDan.de_tai.ten_tieng_viet +
                    huongDan.de_tai.ten_tieng_anh +
                    huongDan.de_tai.he_dao_tao +
                    huongDan.de_tai.giai_doan +
                    huongDan.de_tai.nhom_nganh +
                    huongDan.de_tai.yeu_cau_va_so_lieu +
                    huongDan.de_tai.tai_lieu_tham_khao
                ).toLowerCase();

            // Search
            if (searchTerm && !dataStr.includes(searchTerm.toLowerCase())) return false;

            // Số sinh viên yêu cầu
            if (filters.soSinhVien && huongDan.de_tai.so_luong_sinh_vien > parseInt(filters.soSinhVien))
                return false;

            // Đã có sinh viên đăng ký
            if (filters.daDangKy && huongDan.de_tai.so_sinh_vien_dang_ky <= 0) return false;

            // Trạng thái đăng ký
            if (filters.trangThai === "Còn đăng ký" && huongDan.de_tai.so_sinh_vien_dang_ky >= huongDan.de_tai.so_luong_sinh_vien)
                return false;
            if (filters.trangThai === "Đã đầy" && huongDan.de_tai.so_sinh_vien_dang_ky < huongDan.de_tai.so_luong_sinh_vien)
                return false;

            // Nhóm ngành
            if (filters.nhomNganh && huongDan.de_tai.nhom_nganh !== filters.nhomNganh) return false;

            // Hệ đào tạo
            if (filters.heDaoTao && huongDan.de_tai.he_dao_tao !== filters.heDaoTao) return false;

            // Giai đoạn
            if (filters.giaiDoan && huongDan.de_tai.giai_doan !== filters.giaiDoan) return false;

            return true;
        });
    }, [listHuongDan, searchTerm, filters]);

    const resetFilter = () => {
        setFilters({
            soSinhVien: "",
            daDangKy: false,
            trangThai: "",
            nhomNganh: "",
            heDaoTao: "",
            giaiDoan: ""
        });
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Input placeholder="Tìm kiếm ..." className="mb-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"}>
                            <ListFilter />
                            <span className="hidden lg:inline">Bộ lọc</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-90">
                        <div className="flex flex-col gap-2">
                            <div className="grid gap-2">
                                <div className="flex flex-col items-start gap-2">
                                    <Label htmlFor="so-sinh-vien-yeu-cau">
                                        Số sinh viên yêu cầu
                                    </Label>
                                    <Input
                                        id="so-sinh-vien-yeu-cau"
                                        className="col-span-2 h-8"
                                        type="number"
                                        min={1}
                                        value={filters.soSinhVien}
                                        onChange={(e) =>
                                            setFilters({ ...filters, soSinhVien: e.target.value })
                                        }
                                    />
                                </div>
                                <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                    <Checkbox
                                        id="toggle-2"
                                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                        checked={filters.daDangKy}
                                        onCheckedChange={(checked) =>
                                            setFilters({ ...filters, daDangKy: checked === true })
                                        }
                                    />
                                    <div className="grid gap-1.5 font-normal">
                                        <p className="text-sm leading-none font-medium">
                                            Đã có sinh viên đăng ký
                                        </p>
                                    </div>
                                </Label>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex flex-col items-start gap-2">
                                    <Label>Trạng thái đăng ký</Label>
                                    <Select
                                        value={filters.trangThai}
                                        onValueChange={(value) =>
                                            setFilters({ ...filters, trangThai: value })
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Còn đăng ký">
                                                <IconLoader className="mr-1" size={16} /> Còn đăng ký
                                            </SelectItem>
                                            <SelectItem value="Đã đầy">
                                                <IconCircleCheckFilled
                                                    className="fill-green-500 dark:fill-green-400 mr-1"
                                                    size={16}
                                                />{" "}
                                                Đã đầy
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex flex-col items-start gap-2">
                                    <Label>Nhóm ngành</Label>
                                    <Select
                                        value={filters.nhomNganh}
                                        onValueChange={(value) =>
                                            setFilters({ ...filters, nhomNganh: value })}
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Khoa học Máy tính">
                                                Khoa học Máy tính
                                            </SelectItem>
                                            <SelectItem value="Kỹ thuật Máy tính">
                                                Kỹ thuật Máy tính
                                            </SelectItem>
                                            <SelectItem value="Liên ngành CS-CE">
                                                Liên ngành CS-CE
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex flex-col items-start gap-2">
                                    <Label>Hệ đào tạo</Label>
                                    <Select
                                        value={filters.heDaoTao}
                                        onValueChange={(value) =>
                                            setFilters({ ...filters, heDaoTao: value })
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Tiếng Việt">Tiếng Việt</SelectItem>
                                            <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <div className="flex flex-col items-start gap-2">
                                    <Label>Giai đoạn</Label>
                                    <Select
                                        value={filters.giaiDoan}
                                        onValueChange={(value) =>
                                            setFilters({ ...filters, giaiDoan: value })
                                        }
                                    >
                                        <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Đồ án chuyên ngành">Đồ án chuyên ngành</SelectItem>
                                            <SelectItem value="Đồ án tốt nghiệp">Đồ án tốt nghiệp</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                className="w-full"
                                variant={"destructive"}
                                onClick={resetFilter}
                            >
                                Đặt lại bộ lọc
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-10 sm:p-20">
                {filterListHuongDan?.length > 0 ?
                    filterListHuongDan.map((huongDan: any) => {
                        const isExpand = recordExpand === huongDan.id
                        return (
                            <div key={huongDan.id} className="">
                                <Card className="flex flex-col rounded-4xl border shadow-lg">
                                    <CardContent>
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="iformations">
                                                <AccordionTrigger className="">
                                                    <div className="flex flex-col">
                                                        <div className="text-xl">{huongDan.de_tai.ma_de_tai + " - " + huongDan.de_tai.ten_tieng_viet}</div>
                                                        <div className="text-sm italic text-gray-500">
                                                            {huongDan.de_tai.ten_tieng_anh}
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
                                        <div className="flex flex-row justify-end w-full gap-2 items-center">
                                            {huongDan.de_tai.duyet_de_tai?.trang_thai === "Đã chấp nhận" && <TienDoTrigger idDeTai={huongDan.de_tai.id} />}
                                            <Button variant={'secondary'} size={'icon'} onClick={() => setRecordExpand((prev) => prev !== huongDan.id ? huongDan.id : null)}>
                                                <IconUserPlus />
                                            </Button>
                                            {huongDan.de_tai.duyet_de_tai?.trang_thai === "Đã chấp nhận" && huongDan.vai_tro === 'Giảng viên hướng dẫn chính' && huongDan.de_tai.giai_doan === 'Đồ án tốt nghiệp' && <Button className="bg-green-500/70" variant={'secondary'} onClick={() => navigate('/danh-gia-de-tai/' + huongDan.de_tai.id)}>
                                                Đánh giá
                                            </Button>}
                                        </div>
                                        <div className="w-full">
                                            {isExpand && <div className="animate-in fade-in slide-in-from-top duration-500 p-2 shadow-2xl rounded-2xl border-1"><TeacherMultiSelect deTai={huongDan?.de_tai} /></div>}
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        )
                    }) : <div className="text-center mb-5">Không có kết quả.</div>
                }
            </div>
        </div>
    )
}