import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { NhiemVuSchema } from "@/validations/nhiem_vu.schema"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { AlertCircleIcon, CheckCircle2Icon, CloudAlert } from "lucide-react"
import { useEffect, useState } from "react"



interface TaiLieu {
    id: number;
    id_nhiem_vu: number;
    ten_tai_lieu: string;
    url: string;
}

export default function FormNhiemVu(
    { type, setToggle, nhiemVu, setOpen }:
        {
            type?: string,
            setToggle: React.Dispatch<React.SetStateAction<boolean>>,
            nhiemVu?: any,
            setOpen?: React.Dispatch<React.SetStateAction<boolean>>
        }
) {
    const { id } = useParams()
    const form = useForm<z.infer<typeof NhiemVuSchema>>({
        resolver: zodResolver(NhiemVuSchema),
        defaultValues: {
            ten: "Aa",
            mo_ta: "Ab",
            ngay_bat_dau: "2025-09-22T12:00",
            ngay_ket_thuc: "2025-09-22T12:45",
            files: []
        }
    })
    const [oldFiles, setOldFiles] = useState<TaiLieu[]>([])
    const [oldFilesDeleted, setOldFilesDeleted] = useState<TaiLieu[]>([])
    const localDateTime = (utcStr?: string) => {
        if (!utcStr) return "";
        const d = new Date(utcStr);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const min = pad(d.getMinutes());
        return `${year}-${month}-${day}T${hour}:${min}`;
    }


    useEffect(() => {
        if (type === 'edit') {
            setOldFiles(nhiemVu.tai_lieu)
            form.reset({
                ten: nhiemVu?.ten,
                mo_ta: nhiemVu?.mo_ta,
                ngay_bat_dau: localDateTime(nhiemVu?.ngay_bat_dau),
                ngay_ket_thuc: localDateTime(nhiemVu?.ngay_ket_thuc),
                files: [] // file mới
            });
        }
    }, [nhiemVu, type, form])

    async function onSubmit(values: z.infer<typeof NhiemVuSchema>) {
        const formData = new FormData();
        const { files, ...rest } = values
        formData.append("data", JSON.stringify({
            ...rest,
            idDeTai: Number(id),
        }));

        files.forEach((file) => {
            formData.append("files", file);
        });
        if (type === "edit") {
            const totalFiles = oldFiles.length + values.files.length;

            if (totalFiles > 5) {
                toast.error("Tổng số file (cũ + mới) không được vượt quá 5");
                return;
            }
            const checkSameName = new Set(oldFiles.map(item => item.ten_tai_lieu))
            for (const item of values.files) {
                if (checkSameName.has(item.name)) {
                    toast.error(`File mới ${item.name} trùng với file cũ`)
                    return;
                } else checkSameName.add(item.name)
            }


            formData.append('oldFileDeleted', JSON.stringify(oldFilesDeleted))
            try {
                const response = await fetch(`http://localhost:3000/nhiem-vu/${nhiemVu?.id}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                })
                const data = await response.json()
                if (response.ok) {
                    toast(
                        <div className="flex flex-row items-center w-full gap-5" >
                            <CheckCircle2Icon className="text-green-600" />
                            <div className="flex flex-col" >
                                <div className="text-lg text-green-600" > Đã lưu thay đổi </div>
                            </div>
                        </div>
                    )
                    setToggle(prev => !prev)
                    if (setOpen) setOpen(false)
                }
                else
                    toast(
                        <div className="flex flex-row items-center w-full gap-5" >
                            <AlertCircleIcon className="text-red-600" />
                            <div className="flex flex-col" >
                                <div className="text-lg text-red-600" > Không thể lưu thay đổi </div>
                                < div >{data.message} </div>
                            </div>
                        </div>
                    )
            } catch (error) {
                console.log(error)
                toast(
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CloudAlert className="text-yellow-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-yellow-600" > Lỗi hệ thống </div>
                            < div > Vui lòng thử lại sau </div>
                        </div>
                    </div>
                )
            }
        } else {
            try {
                const response = await fetch("http://localhost:3000/nhiem-vu", {
                    method: "POST",
                    credentials: 'include',
                    body: formData
                })
                if (response.ok) {
                    toast(
                        <div className="flex flex-row items-center w-full gap-5" >
                            <CheckCircle2Icon className="text-green-600" />
                            <div className="flex flex-col" >
                                <div className="text-lg text-green-600" > Tạo nhiệm vụ thành công </div>
                            </div>
                        </div>
                    )
                    setToggle(prev => !prev)
                }
                else {
                    const data = await response.json();
                    toast(
                        <div className="flex flex-row items-center w-full gap-5" >
                            <AlertCircleIcon className="text-red-600" />
                            <div className="flex flex-col" >
                                <div className="text-lg text-red-600" > Không thể tạo nhiệm vụ </div>
                                < div >{data.message}</div>
                            </div>
                        </div>
                    )
                }
            } catch (error) {
                console.log(error)
                toast(
                    <div className="flex flex-row items-center w-full gap-5" >
                        <CloudAlert className="text-yellow-600" />
                        <div className="flex flex-col" >
                            <div className="text-lg text-yellow-600" > Lỗi hệ thống </div>
                            < div > Vui lòng thử lại sau </div>
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <Card className="shadow-lg max-w-[100%]">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="ten"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-1">Tên nhiệm vụ</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            {...field}
                                            placeholder="Nhập tên của nhiệm vụ"
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mo_ta"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-1">Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập mô tả cho nhiệm vụ"
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ngay_bat_dau"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-1">Bắt đầu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            required
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ngay_ket_thuc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-1">Kết thúc</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="datetime-local"
                                            {...field}
                                            placeholder="Nhập tiêu đề"
                                            required
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="files"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-1">Tài liệu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            multiple
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    const newFiles = [...(field.value || []), ...Array.from(e.target.files)];
                                                    field.onChange(newFiles);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                    {oldFiles?.length > 0 && (
                                        <div>
                                            <span className="text-sm underline">File cũ: {oldFiles.length}</span>
                                            <ScrollArea className="bg-gray-200 dark:bg-gray-600 p-4 h-[200px] w-full rounded-md border mt-2">
                                                <ul className="mt-2 space-y-2 rounded">
                                                    {oldFiles.map((file: TaiLieu, index: number) => (
                                                        <li key={index}>
                                                            <div className="bg-black text-white dark:bg-white dark:text-black flex justify-between items-center text-sm border rounded-md p-2">
                                                                <span className="mr-1">{index + 1}. </span>
                                                                <span className="break-all whitespace-normal flex-1">{file.ten_tai_lieu}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="ml-1 dark:bg-red-600"
                                                                    onClick={() => {
                                                                        const newFiles = oldFiles.filter((item) => item.id !== file.id);
                                                                        const deletedFile = oldFiles.find((item) => item.id === file.id)
                                                                        if (deletedFile) setOldFilesDeleted((prev) => [...prev, deletedFile])
                                                                        setOldFiles(newFiles);
                                                                    }}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </ScrollArea>
                                        </div>
                                    )}
                                    {field.value?.length > 0 && (
                                        <div>
                                            <span className="text-sm underline">File mới: {field.value?.length}</span>
                                            <ScrollArea className="bg-gray-200 dark:bg-gray-600 p-4 h-[200px] w-full rounded-md border mt-2">
                                                <ul className="mt-2 space-y-2 rounded">
                                                    {field.value.map((file: File, index: number) => (
                                                        <li key={index}>
                                                            <div className="bg-black text-white dark:bg-white dark:text-black flex justify-between items-center text-sm border rounded-md p-2">
                                                                <span className="mr-1">{index + 1}. </span>
                                                                <span className="break-all whitespace-normal flex-1">{file.name}</span>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    className="ml-1 dark:bg-red-600"
                                                                    onClick={() => {
                                                                        const newFiles = field.value.filter((_: File, i: number) => i !== index);
                                                                        field.onChange(newFiles);
                                                                    }}
                                                                >
                                                                    Xóa
                                                                </Button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-green-500 w-full">
                            {type === "edit" ? "Lưu thay đổi" : "Tạo nhiệm vụ"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
