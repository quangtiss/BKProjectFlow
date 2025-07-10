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
import { CreateDeTai } from "@/services/de_tai/create_de_tai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon, AlertCircleIcon, CloudAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { getAllSinhVien } from "@/services/sinh_vien/get_all_sinh_vien";
import { GetAllHocKi } from "@/services/hoc_ki/get_all_hoc_ki";
import { useAuth } from "@/routes/auth-context";



export function DeXuatDeTai({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const { user } = useAuth()
    const [listGiangVien, setListGiangVien] = useState([])
    const [listHocKi, setListHocKi] = useState([])
    const [listSinhVien, setListSinhVien] = useState([{
        label: "",
        value: "",
        selected: false
    }])
    const [success, setSuccess] = useState("")



    useEffect(() => {
        const fetchListGiangVien = async () => {
            const allHocKi = await GetAllHocKi()
            const allGiangVien = await getAllGiangVien()
            const allSinhVien = await getAllSinhVien()
            setListHocKi(allHocKi)
            setListGiangVien(allGiangVien)
            setListSinhVien(allSinhVien.map((sinhVien) => (
                {
                    label: sinhVien.mssv + " - " + sinhVien.tai_khoan.ho + " " + sinhVien.tai_khoan.ten,
                    value: String(sinhVien.id_tai_khoan),
                    selected: user.auth.role === "Sinh viên" && sinhVien.id_tai_khoan === user.auth.sub ? true : false
                })))
        }
        fetchListGiangVien()
    }, [])

    // 1. Define your form.
    const form = useForm<z.infer<typeof deXuatDeTaiFormSchema>>({
        resolver: zodResolver(deXuatDeTaiFormSchema),
        defaultValues: {
            ten_tieng_viet: "Aa",
            ten_tieng_anh: "Az",
            mo_ta: "Aa",
            nhom_nganh: "Khoa học Máy tính",
            he_dao_tao: "Chính quy",
            so_luong_sinh_vien: 3,
            id_hoc_ki: undefined,
            id_giang_vien_huong_dan: user.auth.role === "Giảng viên" ? user.auth.sub : undefined,
            list_id_sinh_vien_tham_gia: user.auth.role === "Sinh viên" ? [user.auth.sub] : []
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof deXuatDeTaiFormSchema>) {
        const response = await CreateDeTai(values)
        setSuccess(response)
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
                                    <div className="gap-3 w-full grid sm:grid-cols-[1fr_2fr_2fr_1fr]">

                                        <div className="w-full">
                                            <FormField
                                                control={form.control}
                                                name="id_hoc_ki"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>học kỳ</FormLabel>
                                                        <FormControl>
                                                            <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn học kỳ" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {listHocKi.map((hocKi) => {
                                                                        return <SelectItem key={hocKi.id} value={String(hocKi.id)}>{hocKi.ten_hoc_ki}</SelectItem>
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
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn nhóm ngành" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Khoa học Máy tính">Khoa học Máy tính</SelectItem>
                                                                    <SelectItem value="Kỹ thuật Máy tính">Kỹ thuật Máy tính</SelectItem>
                                                                    <SelectItem value="Đa ngành">Đa ngành</SelectItem>
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
                                                        <FormLabel>Hệ đào tạo</FormLabel>
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
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="id_giang_vien_huong_dan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Giảng viên hướng dẫn</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value ? String(field.value) : ""} onValueChange={field.onChange}>
                                                            <SelectTrigger className="w-full">
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


                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="list_id_sinh_vien_tham_gia"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Sinh viên đăng ký tham gia</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className={cn(
                                                                        "w-full justify-between h-auto",
                                                                        !field.value?.length && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    <div className="flex flex-wrap gap-1 max-w-full overflow-hidden">
                                                                        {field.value?.length
                                                                            ?
                                                                            field.value.map((id) => {
                                                                                const gv = listSinhVien.find((g) => Number(g.value) === id);
                                                                                return (
                                                                                    <Badge key={id} variant="secondary" className="mr-1 truncate">
                                                                                        {gv?.label}
                                                                                    </Badge>
                                                                                );
                                                                            })
                                                                            : "Chọn sinh viên (Tùy chọn)"}
                                                                    </div>

                                                                    <ChevronsUpDown className="opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                                                            <Command>
                                                                <CommandInput
                                                                    placeholder="Search framework..."
                                                                    className="h-9"
                                                                />
                                                                <CommandList>
                                                                    <CommandEmpty>Không có sinh viên.</CommandEmpty>
                                                                    <CommandGroup>
                                                                        {listSinhVien.map((sinhVien) => (
                                                                            <CommandItem
                                                                                value={sinhVien.label}
                                                                                key={sinhVien.value}
                                                                                onSelect={() => {
                                                                                    const selectedId = Number(sinhVien.value);
                                                                                    const current = form.getValues("list_id_sinh_vien_tham_gia") || [];

                                                                                    const isSelected = current.includes(selectedId);

                                                                                    const newValue = isSelected
                                                                                        ? current.filter((id) => id !== selectedId) // bỏ chọn
                                                                                        : [...current, selectedId]; // thêm vào

                                                                                    form.setValue("list_id_sinh_vien_tham_gia", newValue, {
                                                                                        shouldValidate: true,
                                                                                        shouldDirty: true,
                                                                                    });
                                                                                    setListSinhVien((prevList) =>
                                                                                        prevList.map((item) =>
                                                                                            Number(item.value) === selectedId
                                                                                                ? { ...item, selected: !isSelected }
                                                                                                : item
                                                                                        )
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {sinhVien.label}
                                                                                <Check
                                                                                    className={cn(
                                                                                        "ml-auto",
                                                                                        sinhVien.selected === true
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
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

                            <div className="grid grid-cols-1 gap-4">

                                {success == "Success!" ?
                                    (
                                        <Alert className="text-green-400">
                                            <CheckCircle2Icon />
                                            <AlertTitle>Đề xuất thành công</AlertTitle>
                                            <AlertDescription className="text-green-400">
                                                Đề xuất sẽ được xem xét chấp nhận bởi giáo viên hướng dẫn và duyệt đề tài bởi giáo viên trưởng bộ môn.
                                            </AlertDescription>
                                        </Alert>
                                    )
                                    :
                                    success == "Fail!" ? (
                                        <Alert variant="destructive">
                                            <AlertCircleIcon />
                                            <AlertTitle>Đề xuất thất bại</AlertTitle>
                                            <AlertDescription>
                                                <p>Sinh viên không thể có trong danh sách đăng ký của nhiều đồ án</p>
                                            </AlertDescription>
                                        </Alert>
                                    )
                                        :
                                        success == "Error!" ? (
                                            <Alert variant="destructive">
                                                <CloudAlert />
                                                <AlertTitle>Lỗi hệ thống</AlertTitle>
                                                <AlertDescription>
                                                    <p>Vui lòng thử lại sau</p>
                                                </AlertDescription>
                                            </Alert>
                                        )
                                            : null}

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
