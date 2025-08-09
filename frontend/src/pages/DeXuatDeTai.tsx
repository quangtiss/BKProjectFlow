import { GalleryVerticalEnd, Info } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { deXuatDeTaiFormSchema } from "@/validations/de_xuat_de_tai.schema";
import { getAllGiangVien } from "@/services/giang_vien/get_all_giang_vien";
import { CreateDeTai } from "@/services/de_tai/create_de_tai";
import { CheckCircle2Icon, AlertCircleIcon, CloudAlert } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { getAllSinhVien } from "@/services/sinh_vien/get_all_sinh_vien";
import { GetAllHocKy } from "@/services/hoc_ky/get_all_hoc_ky";
import { useAuth } from "@/routes/auth-context";
import StudentMultiSelect from "@/components/ui/multiple-select";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


export function DeXuatDeTai({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { user } = useAuth()
    const [listGiangVien, setListGiangVien] = useState<any[]>([])
    const [listHocKy, setListHocKy] = useState([])
    const [listSinhVienRaw, setListSinhVienRaw] = useState<any[]>([]);
    const [heDaoTao, setHeDaoTao] = useState("")
    const [nhomNganh, setNhomNganh] = useState("")

    useEffect(() => {
        const fetchInitialData = async () => {
            const [allHocKy, allGiangVien, allSinhVien] = await Promise.all([
                GetAllHocKy(),
                getAllGiangVien(),
                getAllSinhVien(),
            ]);

            setListHocKy(allHocKy);
            setListGiangVien(allGiangVien);
            setListSinhVienRaw(allSinhVien);
        };

        fetchInitialData();
    }, []);

    const listSinhVien = useMemo(() => {
        return listSinhVienRaw
            .filter((sinhVien) => {
                if (!nhomNganh) return true;
                if (nhomNganh !== 'Liên ngành CS-CE' && sinhVien.nganh !== nhomNganh) return false;
                if (heDaoTao && sinhVien.ngon_ngu !== heDaoTao) return false;
                return true;
            })
            .map((sv) => ({
                id: sv.id_tai_khoan,
                mssv: sv.mssv,
                ho_ten: sv.tai_khoan.ho + " " + sv.tai_khoan.ten,
                nganh: sv.nganh,
                he_dao_tao: sv.he_dao_tao,
            }));
    }, [listSinhVienRaw, nhomNganh, heDaoTao]);



    // 1. Define your form.
    const form = useForm<z.infer<typeof deXuatDeTaiFormSchema>>({
        resolver: zodResolver(deXuatDeTaiFormSchema),
        defaultValues: {
            ten_tieng_viet: "Aa",
            ten_tieng_anh: "Az",
            mo_ta: "Aa",
            yeu_cau_va_so_lieu: "123",
            tai_lieu_tham_khao: "https://",
            nhom_nganh: undefined,
            he_dao_tao: undefined,
            so_luong_sinh_vien: 3,
            id_hoc_ky: undefined,
            id_giang_vien_huong_dan: user.auth.role === "Giảng viên" || user.auth.role === "Giảng viên trưởng bộ môn" ? user.auth.sub : undefined,
            list_id_sinh_vien_tham_gia: user.auth.role === "Sinh viên" ? [user.auth.sub] : []
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof deXuatDeTaiFormSchema>) {
        const response = await CreateDeTai(values)
        toast(
            response === "Fail!" ? (
                <div className="flex flex-row items-center w-full gap-5" >
                    <AlertCircleIcon className="text-red-600" />
                    <div className="flex flex-col" >
                        <div className="text-lg text-red-600" > Không thể tạo đề tài </div>
                        < div > Có vẻ một số trường không hợp lý </div>
                    </div>
                </div>
            ) :
                response === "Error!" ? (
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CloudAlert className="text-yellow-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-yellow-600" > Lỗi hệ thống </div>
                            < div > Vui lòng thử lại sau </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CheckCircle2Icon className="text-green-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-green-600" > Tạo đề tài thành công </div>
                            < div > Đề tài {response.ma_de_tai} của bạn sẽ được chờ duyệt </div>
                        </div>
                    </div>
                )
        )
    }

    return (
        <div className="bg-background flex min-h-svh flex-col items-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <a
                                        href="#"
                                        className="flex flex-col items-center gap-2 font-medium"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-md">
                                            <GalleryVerticalEnd className="size-6" />
                                        </div>
                                        <span className="sr-only">Acme Inc.</span>
                                    </a>
                                    <h1 className="text-xl font-bold">Đề xuất đề tài.</h1>
                                    <div className="text-center text-sm">
                                        Mọi đề tài đều sẽ được kiểm duyệt
                                    </div>
                                </div>
                                <div className="flex flex-col gap-6">


                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="ten_tieng_viet"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tên đề tài</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Aa" {...field} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="ten_tieng_anh"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Project's name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Aa" {...field} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="mo_ta"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mô tả</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="yeu_cau_va_so_lieu"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Yêu cầu nội dung và số liệu ban đầu</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="tai_lieu_tham_khao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tài liệu tham khảo</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="gap-3 w-full grid sm:grid-cols-[1fr_2fr_1fr]">

                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="id_hoc_ky"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Học kỳ</FormLabel>
                                                        <FormControl>
                                                            <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn học kỳ" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {listHocKy.map((HocKy) => {
                                                                        return <SelectItem key={HocKy.id} value={String(HocKy.id)}>{HocKy.ten_hoc_ky}</SelectItem>
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="nhom_nganh"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nhóm ngành</FormLabel>
                                                        <FormControl>
                                                            <Select value={field.value || ""} onValueChange={(value) => {
                                                                field.onChange(value)
                                                                setNhomNganh(value)
                                                            }}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn nhóm ngành" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Khoa học Máy tính">Khoa học Máy tính</SelectItem>
                                                                    <SelectItem value="Kỹ thuật Máy tính">Kỹ thuật Máy tính</SelectItem>
                                                                    <SelectItem value="Liên ngành CS-CE">Liên ngành CS-CE</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="so_luong_sinh_vien"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Sinh viên</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="number" placeholder="Số lượng" />
                                                        </FormControl>
                                                        <FormDescription />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <FormField
                                            control={form.control}
                                            name="he_dao_tao"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Hệ đào tạo</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value || ""} onValueChange={(value) => {
                                                            field.onChange(value)
                                                            setHeDaoTao(value)
                                                        }}>
                                                            <SelectTrigger className="w-full overflow-hidden">
                                                                <SelectValue placeholder="Chọn hệ đào tạo" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Tiếng Việt">Tiếng Việt {"(CQ/B2/CN/SN/VLVH/TX)"}</SelectItem>
                                                                <SelectItem value="Tiếng Anh">Tiếng Anh {"(CC)"}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="id_giang_vien_huong_dan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Giảng viên hướng dẫn</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                                                            <SelectTrigger className="w-full py-6">
                                                                <SelectValue placeholder="Chọn giảng viên hướng dẫn" />
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full">
                                                                {listGiangVien.map((giangVien) => {
                                                                    return (
                                                                        <div key={giangVien.id_tai_khoan}>
                                                                            <SelectItem key={giangVien.id_tai_khoan} value={String(giangVien.id_tai_khoan)} className="w-full">
                                                                                <div className="flex flex-col">
                                                                                    <div>{giangVien.msgv} - {giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten}
                                                                                        {giangVien.tai_khoan.vai_tro === "Giảng viên trưởng bộ môn" &&
                                                                                            <Badge variant='default' className="italic text-green-600 text-xs">Giảng viên trưởng</Badge>}</div>
                                                                                    <div className="italic text-xs">
                                                                                        {giangVien.to_chuyen_nganh} - {giangVien.tai_khoan.email}
                                                                                    </div>
                                                                                </div>
                                                                            </SelectItem>
                                                                            <Separator className="h-0.5 bg-gray-600 my-2" />
                                                                        </div>
                                                                    )
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>


                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="list_id_sinh_vien_tham_gia"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sinh viên đăng ký tham gia</FormLabel>
                                                    <FormControl>
                                                        <StudentMultiSelect listSinhVien={listSinhVien} value={field.value} onChange={field.onChange} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Alert className="mt-2">
                                            <AlertTitle className="flex flex-row text-yellow-600">
                                                <Info className="h-1/10 w-1/10 mt-1" />
                                                <div className="px-2">
                                                    SV phải làm đề tài đúng giai đoạn, ngành học, chương trình đào tạo của mình.
                                                    Một đề tài chỉ được nhận SV cùng giai đoạn, cùng ngành, cùng chương trình đào tạo, cụ thể như sau:
                                                </div>
                                            </AlertTitle>
                                            <AlertDescription className="px-10">
                                                <ul className="list-inside list-disc text-sm">
                                                    <li><strong className="underline">CQ, B2, SN, VLVH, TX:</strong> SV được làm chung đề tài.</li>
                                                    <li><strong className="underline">CC:</strong> SV chỉ được làm chung đề tài với nhau.</li>
                                                    <li><strong className="underline">CN:</strong> SV chỉ được làm chung đề tài với nhau.</li>
                                                </ul>
                                            </AlertDescription>
                                        </Alert>
                                    </div>



                                    <Button type="submit" className="w-full">
                                        Gửi đề xuất
                                    </Button>
                                </div>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-background text-muted-foreground relative z-10 px-2">
                                        Or
                                    </span>
                                </div>
                            </div>
                        </form>
                    </Form>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our{" "}
                        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div >
    );
}
