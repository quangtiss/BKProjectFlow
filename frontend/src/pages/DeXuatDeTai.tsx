import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
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




export function DeXuatDeTai({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [listGiangVien, setListGiangVien] = useState([])
    useEffect(() => {
        const fetchListGiangVien = async () => {
            setListGiangVien(await getAllGiangVien())
        }
        fetchListGiangVien()
    }, [])

    // 1. Define your form.
    const form = useForm<z.infer<typeof deXuatDeTaiFormSchema>>({
        resolver: zodResolver(deXuatDeTaiFormSchema),
        defaultValues: {
            ngay_tao: new Date(),  //lấy date ngay khi mới render
            trang_thai: "Chưa bắt đầu",
            trang_thai_duyet: "Chưa duyệt",
            giai_doan: "Đồ án chuyên ngành",
            ten_tieng_viet: "Aa",
            ten_tieng_anh: "Az",
            mo_ta: "Aa",
            ma_de_tai: "MT",
            nhom_nganh: "Khoa học Máy tính",
            he_dao_tao: "Chính quy",
            so_luong_sinh_vien: 3,
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof deXuatDeTaiFormSchema>) {
        values.ngay_tao = new Date() //tính toán lại khi submit
        console.log(values)
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
                                            name="ma_de_tai"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Mã đề tài {'('}Tùy chọn{')'}</FormLabel>
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
                                                        <Input placeholder="Aa" {...field} />
                                                    </FormControl>
                                                    <FormDescription />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-3">

                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="nhom_nganh"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Chọn nhóm ngành</FormLabel>
                                                        <FormControl>
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn nhóm ngành" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="KH">Khoa học máy tính</SelectItem>
                                                                    <SelectItem value="KT">Kĩ thuật máy tính</SelectItem>
                                                                    <SelectItem value="DN">Đa ngành</SelectItem>
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
                                                name="he_dao_tao"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Chọn hệ đào tạo</FormLabel>
                                                        <FormControl>
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn hệ đào tạo" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Chính quy">Chính quy</SelectItem>
                                                                    <SelectItem value="Chất lượng cao">Chất lượng cao</SelectItem>
                                                                    <SelectItem value="Việt - Pháp">Việt - Pháp</SelectItem>
                                                                    <SelectItem value="Việt - Nhật">Việt - Nhật</SelectItem>
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
                                                        <FormLabel>Số lượng sinh viên</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} className="w-full" type="number" placeholder="Số lượng" />
                                                        </FormControl>
                                                        <FormDescription />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="id_giang_vien_huong_dan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Chọn giảng viên hướng dẫn</FormLabel>
                                                    <FormControl>
                                                        <Select value={String(field.value)} onValueChange={(val) => field.onChange(Number(val))}><SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn giảng viên hướng dẫn" />
                                                        </SelectTrigger>
                                                            <SelectContent>
                                                                {listGiangVien.map((giangVien) => {
                                                                    return <SelectItem key={giangVien.id_tai_khoan} value={String(giangVien.id_tai_khoan)}>{giangVien.msgv} - {giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten}</SelectItem>
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
        </div>
    );
}
