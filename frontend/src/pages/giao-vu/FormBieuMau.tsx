import { BieuMauSchema } from "@/validations/bieu_mau.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useEffect } from "react"


export default function FormBieuMau({ type, idBieuMau }: { type: 'create' | 'edit', idBieuMau?: number }) {
    const form = useForm<z.infer<typeof BieuMauSchema>>({
        resolver: zodResolver(BieuMauSchema),
        defaultValues: {
            ten_mau: "",
            loai_mau: "Hội đồng",
            giai_doan: 'Đồ án chuyên ngành'
        },
    })

    useEffect(() => {
        if (type === 'edit') {
            const fetchOldData = async () => {
                try {
                    const response = await fetch('http://localhost:3000/mau-danh-gia/' + idBieuMau, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    const data = await response.json()
                    if (response.ok) {
                        form.reset({
                            ten_mau: data.ten_mau,
                            loai_mau: data.loai_mau,
                            giai_doan: data.giai_doan,
                            ghi_chu: data.ghi_chu || undefined
                        })
                    } else toast.error('Lỗi khi lấy dữ liệu cũ', { description: data.message })
                } catch (error) {
                    toast.warning('Lỗi hệ thống')
                    console.error(error)
                }
            }
            fetchOldData()
        }
    }, [type, form, idBieuMau])


    const deleteBieuMau = async () => {
        try {
            const response = await fetch('http://localhost:3000/mau-danh-gia/' + idBieuMau, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) toast.success('Đã xóa')
            else {
                const data = await response.json()
                toast.error('Lỗi khi xóa', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
            console.error(error)
        }
    }



    async function onSubmit(values: z.infer<typeof BieuMauSchema>) {
        if (values.loai_mau === 'Giảng viên phản biện' && values.giai_doan === 'Đồ án chuyên ngành') {
            toast.warning('Hiện tại đồ án chuyên ngành chưa cần phải phản biện.')
            return
        }
        if (values.loai_mau === 'Giảng viên hướng dẫn' && values.giai_doan === 'Đồ án chuyên ngành') {
            toast.warning('Hiện tại đồ án chuyên ngành chưa cần điểm của giảng viên hướng dẫn.')
            return
        }
        if (type === 'edit') {
            try {
                const response = await fetch('http://localhost:3000/mau-danh-gia/' + idBieuMau, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                if (response.ok) toast.success('Đã lưu')
                else {
                    const data = await response.json()
                    toast.error('Lỗi khi lưu', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }

        else {
            try {
                const response = await fetch('http://localhost:3000/mau-danh-gia', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                if (response.ok) toast.success('Đã tạo')
                else {
                    const data = await response.json()
                    toast.error('Lỗi khi tạo', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="ten_mau"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên mẫu</FormLabel>
                                <FormControl>
                                    <Input placeholder="Aa" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="loai_mau"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại mẫu</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn loại biểu mẫu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Giảng viên hướng dẫn">Giảng viên hướng dẫn</SelectItem>
                                                <SelectItem value="Giảng viên phản biện">Giảng viên phản biện</SelectItem>
                                                <SelectItem value="Hội đồng">Hội đồng</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="giai_doan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giai đoạn</FormLabel>
                                <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn giai đoạn" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Đồ án chuyên ngành">Đồ án chuyên ngành</SelectItem>
                                                <SelectItem value="Đồ án tốt nghiệp">Đồ án tốt nghiệp</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ghi_chu"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú</FormLabel>
                                <FormControl>
                                    <Input placeholder="(Optional)" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center gap-1 w-full">
                        <Button type="submit" className="w-full">
                            {type === 'edit' ? "Lưu thay đổi" : "Tạo biểu mẫu"}
                        </Button>
                    </div>
                </form>
            </Form>
            {type === 'edit' &&
                <Button variant={'destructive'} className="w-full text-center mt-2" onClick={() => deleteBieuMau()}>
                    Xóa biểu mẫu
                </Button>
            }
        </div>
    )
}