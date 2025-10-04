import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LichTrinhSchema } from "@/validations/lich_trinh.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

export default function FormLichTrinh({ type, idHocKy, lichTrinh }: { type: 'create' | 'edit', idHocKy?: number, lichTrinh?: any }) {
    const form = useForm<z.infer<typeof LichTrinhSchema>>({
        resolver: zodResolver(LichTrinhSchema),
        defaultValues: {
            ten: "Aa",
            hoat_dong: "Ab",
            ngay_bat_dau: "2025-09-22T12:00",
            ngay_ket_thuc: "2025-09-22T12:45"
        }
    })
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
            form.reset({
                ten: lichTrinh.ten,
                hoat_dong: lichTrinh.hoat_dong,
                ngay_bat_dau: localDateTime(lichTrinh.ngay_bat_dau),
                ngay_ket_thuc: localDateTime(lichTrinh.ngay_ket_thuc)
            })
        }
    }, [type, form, lichTrinh])


    async function deleteLichTrinh() {
        try {
            const response = await fetch('http://localhost:3000/lich-trinh/' + lichTrinh.id, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (response.ok) toast.success('Đã xóa')
            else {
                const data = await response.json()
                toast.error('Lỗi không thể xóa', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
            console.error(error)
        }
    }


    async function onSubmit(values: z.infer<typeof LichTrinhSchema>) {
        if (type === 'create') {
            try {
                const response = await fetch('http://localhost:3000/lich-trinh', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values, id_hoc_ky: idHocKy })
                })
                if (response.ok) toast.success('Đã thêm')
                else {
                    const data = await response.json()
                    toast.error('Lỗi khi thêm', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }

        else {
            try {
                const response = await fetch('http://localhost:3000/lich-trinh/' + lichTrinh.id, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values })
                })
                if (response.ok) toast.success('Đã lưu')
                else {
                    const data = await response.json()
                    toast.error('Lỗi không thể lưu', { description: data.message })
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="ten"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Tên lịch trình</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Nhập tên"
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hoat_dong"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Hoạt động</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Nhập mô tả cho hoạt động"
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
                    <Button type="submit" className="bg-green-500 w-full">
                        {type === "edit" ? "Lưu thay đổi" : "Tạo lịch trình"}
                    </Button>
                </form>
            </Form>
            {type === 'edit' && <Button className="w-full mt-2" variant={'destructive'} onClick={() => deleteLichTrinh()}>Xóa</Button>}
        </div>
    )
}