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
import { Textarea } from "@/components/ui/textarea"
import { SubmitNhiemVuSchema } from "@/validations/submit_nhiem_vu.schema"
import { toast } from "sonner"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

interface TepDinhKem {
    id: number;
    id_thuc_hien: number;
    ten_tai_lieu: string;
    url: string;
}

export default function SubmitNhiemVu(
    {
        type,
        idNhiemVu,
        thucHien,
        setToggle,
        setOpen
    }:
        {
            type?: string,
            idNhiemVu: number,
            thucHien?: any,
            setToggle: React.Dispatch<React.SetStateAction<boolean>>,
            setOpen: React.Dispatch<React.SetStateAction<boolean>>
        }
) {
    const { id } = useParams()
    const form = useForm<z.infer<typeof SubmitNhiemVuSchema>>({
        resolver: zodResolver(SubmitNhiemVuSchema),
        defaultValues: {
            noi_dung: "Aa",
            files: []
        }
    })
    const [oldFiles, setOldFiles] = useState<TepDinhKem[]>([])
    const [oldFilesDeleted, setOldFilesDeleted] = useState<TepDinhKem[]>([])


    useEffect(() => {
        if (type === 'edit') {
            setOldFiles(thucHien.tep_dinh_kem)
            form.reset({
                noi_dung: thucHien.noi_dung,
                files: [] // file mới
            });
        }
    }, [thucHien, type, form])

    async function onSubmit(values: z.infer<typeof SubmitNhiemVuSchema>) {
        const formData = new FormData();
        const { files, ...rest } = values
        formData.append("data", JSON.stringify({
            ...rest,
            idNhiemVu,
            idDeTai: Number(id)
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
                const response = await fetch(`http://localhost:3000/thuc-hien/${thucHien.id}`, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                })
                const data = await response.json()
                if (response.ok) {
                    toast.success("Đã lưu")
                    setToggle(prev => !prev)
                    setOpen(false)
                } else {
                    toast.error("Lỗi không thể lưu", { description: data.message })
                }
            } catch (error) {
                console.error(error)
                toast.warning("Lỗi hệ thống", { description: "Vui lòng thử lại sau" })
            }




        } else {


            try {
                const response = await fetch('http://localhost:3000/thuc-hien', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                })
                if (response.ok) {
                    toast.success("Đã gửi")
                    setToggle(prev => !prev)
                    setOpen(false)
                } else {
                    const data = await response.json();
                    toast.error("Lỗi không thể gửi", {
                        description: data.message
                    })
                }
            } catch (error) {
                toast.warning("Lỗi hệ thống!", {
                    description: "Vui lòng thử lại sau"
                })
                console.log(error)
            }
        }
    }

    return (
        <Card className="shadow-lg">
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="noi_dung"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm font-medium mb-1">Nội dung (Tùy chọn)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Nhập nội dung"
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
                                    <FormLabel className="block text-sm font-medium mb-1">Tệp đính kèm</FormLabel>
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
                                                    {oldFiles.map((file: TepDinhKem, index: number) => (
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
                            {type === "edit" ? "Lưu thay đổi" : "Nộp bài"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
