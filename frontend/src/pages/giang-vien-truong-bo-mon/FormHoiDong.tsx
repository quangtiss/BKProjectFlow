import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HoiDongSchema } from "@/validations/hoi_dong"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"

export default function FormHoiDong({ type, idCurrentHocKy, hoiDong }: { type: 'create' | 'edit', idCurrentHocKy?: number, hoiDong?: any }) {
    const form = useForm<z.infer<typeof HoiDongSchema>>({
        resolver: zodResolver(HoiDongSchema),
        defaultValues: {
            ten_hoi_dong: "Aa",
            phong: "403H6",
            ngay_gio: "2025-09-22T12:00",
            giai_doan: 'Đồ án chuyên ngành',
            nhom_nganh: 'Khoa học Máy tính',
            he_dao_tao: 'Tiếng Việt'
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
                ten_hoi_dong: hoiDong.ten_hoi_dong,
                phong: hoiDong.phong,
                giai_doan: hoiDong.giai_doan,
                nhom_nganh: hoiDong.nhom_nganh,
                he_dao_tao: hoiDong.he_dao_tao,
                ngay_gio: localDateTime(hoiDong.ngay_gio)
            })
        }
    }, [type, form, hoiDong])



    async function deleteHoiDong() {
        try {
            const response = await fetch('http://localhost:3000/hoi-dong/' + hoiDong.id, {
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


    async function onSubmit(values: z.infer<typeof HoiDongSchema>) {
        if (type === 'create') {
            try {
                const response = await fetch('http://localhost:3000/hoi-dong', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values, id_hoc_ky: idCurrentHocKy })
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
                const response = await fetch('http://localhost:3000/hoi-dong/' + hoiDong.id, {
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
                        name="ten_hoi_dong"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Tên hội đồng</FormLabel>
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
                        name="giai_doan"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Giai đoạn</FormLabel>
                                <FormControl>
                                    <Select key={field.value} value={field.value} onValueChange={field.onChange}>
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
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nhom_nganh"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Nhóm ngành</FormLabel>
                                <FormControl>
                                    <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn nhóm ngành" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Khoa học Máy tính">Khoa học Máy tính</SelectItem>
                                                <SelectItem value="Kỹ thuật Máy tính">Kỹ thuật Máy tính</SelectItem>
                                                <SelectItem value="Liên ngành CS-CE">Liên ngành CS-CE</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="he_dao_tao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Hệ đào tạo</FormLabel>
                                <FormControl>
                                    <Select key={field.value} value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn hệ đào tạo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="Tiếng Việt">Tiếng Việt</SelectItem>
                                                <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phong"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block text-sm font-medium mb-1">Phòng</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Nhập phòng"
                                    />
                                </FormControl>
                                <FormDescription />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ngay_gio"
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
                    <Button type="submit" className="bg-green-500 w-full">
                        {type === "edit" ? "Lưu thay đổi" : "Tạo hội đồng"}
                    </Button>
                </form>
            </Form>
            {type === 'edit' && <Button className="w-full mt-2" variant={'destructive'} onClick={() => deleteHoiDong()}>Xóa</Button>}
        </div>
    )
}