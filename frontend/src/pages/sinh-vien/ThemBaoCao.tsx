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
import { ThemBaoCaoSchema } from "@/validations/them_bao_cao.schema"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { useEffect, useState } from "react"

export default function ThemBaoCao({
    type,
    idBaoCao,
    toggle,
    setToggle
}: {
    type: "edit" | "create",
    idBaoCao?: number,
    toggle: boolean,
    setToggle: any
}) {
    const { id } = useParams()
    const form = useForm<z.infer<typeof ThemBaoCaoSchema>>({
        resolver: zodResolver(ThemBaoCaoSchema),
        defaultValues: {
            noi_dung: "Aa",
            files: []
        }
    })

    const [oldFiles, setOldFiles] = useState([])
    const [deleteOldFiles, setDeleteOldFiles] = useState<any>([])

    useEffect(() => {
        if (type === "edit") {
            setOldFiles([])
            setDeleteOldFiles([])
            try {
                const fetchOldData = async () => {
                    const response = await fetch('http://localhost:3000/bao-cao/' + idBaoCao, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    const data = await response.json()
                    if (response.ok) {
                        form.reset({
                            noi_dung: data.noi_dung,
                            files: []
                        })
                        setOldFiles(data.tai_lieu)
                    } else toast.error('Lỗi khi lấy dữ liệu cũ', { description: data.message })
                }
                fetchOldData()
            } catch (error) {
                toast.warning('Lỗi hệ thống')
                console.error(error)
            }
        }
    }, [type, idBaoCao, form, toggle])



    async function onSubmit(values: z.infer<typeof ThemBaoCaoSchema>) {
        const formData = new FormData();
        const { files, ...rest } = values
        formData.append("data", JSON.stringify({
            ...rest,
            idDeTai: Number(id)
        }));
        files.forEach((file) => {
            formData.append("files", file);
        });

        if (type === 'edit') {
            if ((values.files.length + oldFiles.length) > 5) {
                toast.warning('Tổng file mới và cũ không được vượt quá 5 file');
                return
            }
            const checkSameName = new Set(oldFiles.map((item: any) => item.ten_tai_lieu))
            for (const item of values.files) {
                if (checkSameName.has(item.name)) {
                    toast.warning(`File mới ${item.name} trùng với file cũ`)
                    return;
                } else checkSameName.add(item.name)
            }
            formData.append('deleteOldFiles', JSON.stringify(deleteOldFiles))

            try {
                const response = await fetch('http://localhost:3000/bao-cao/' + idBaoCao, {
                    method: 'PATCH',
                    credentials: 'include',
                    body: formData
                })
                if (response.ok) {
                    toast.success('Đã lưu')
                    setToggle((prev: any) => !prev)
                } else {
                    const data = await response.json()
                    toast.error('Lỗi khi lưu', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        } else {
            try {
                const response = await fetch('http://localhost:3000/bao-cao', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                })
                if (response.ok) {
                    toast.success('Đã tải lên')
                    setToggle((prev: any) => !prev)
                } else {
                    const data = await response.json()
                    toast.error('Lỗi khi tải lên', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
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
                                                    {oldFiles.map((file: any, index: number) => (
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
                                                                        setOldFiles(prev => prev.filter((item: any) => item.id !== file.id))
                                                                        setDeleteOldFiles((prev: any) => [...prev, file])
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
                            {type === "edit" ? "Lưu thay đổi" : "Tải lên"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
