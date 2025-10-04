import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TieuChiSchema } from "@/validations/tieu_chi.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"


export function FormTieuChiGroup({ idBieuMau, type, nhomTieuChi }: { idBieuMau?: number, type: 'create' | 'edit', nhomTieuChi?: any }) {
    const TieuChiGroupSchema = z.object({
        ten_nhom: z.string()
            .min(1, { message: "Tên nhóm có ít nhất 1 ký tự" })
            .max(2000, { message: 'Tên nhóm tối đa 2000 ký tự' })
    })
    const form = useForm<z.infer<typeof TieuChiGroupSchema>>({
        resolver: zodResolver(TieuChiGroupSchema),
        defaultValues: {
            ten_nhom: ""
        },
    })

    useEffect(() => {
        if (type === 'edit') {
            form.reset({
                ten_nhom: nhomTieuChi.ten_nhom
            })
        }
    }, [type, form, nhomTieuChi])


    async function onSubmit(values: z.infer<typeof TieuChiGroupSchema>) {
        if (type === 'edit') {
            try {
                const response = await fetch('http://localhost:3000/nhom-tieu-chi/' + nhomTieuChi.id, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values, id: nhomTieuChi.id })
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
                const response = await fetch('http://localhost:3000/nhom-tieu-chi', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values, id_mau_danh_gia: idBieuMau })
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
                        name="ten_nhom"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên nhóm</FormLabel>
                                <FormControl>
                                    <Input placeholder="Aa" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center gap-1 w-full">
                        <Button type="submit" className="w-full">
                            {type === 'edit' ? "Lưu thay đổi" : "Tạo nhóm"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export function FormTieuChi({ idNhom, type, tieuChi }: { idNhom?: number, type: 'create' | 'edit', tieuChi?: any }) {
    const form = useForm<z.infer<typeof TieuChiSchema>>({
        resolver: zodResolver(TieuChiSchema),
        defaultValues: {
            ten: "",
            noi_dung: "",
            loai_diem: "Điểm số",
            diem_toi_da: ""
        },
    })

    useEffect(() => {
        if (type === 'edit') {
            form.reset({
                ten: tieuChi.ten,
                noi_dung: tieuChi.noi_dung,
                loai_diem: tieuChi.loai_diem,
                diem_toi_da: tieuChi.diem_toi_da
            })
        }
    }, [type, form, tieuChi])


    const deleteTieuChi = async () => {
        try {
            const response = await fetch('http://localhost:3000/tieu-chi/' + tieuChi.id, {
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

    async function onSubmit(values: z.infer<typeof TieuChiSchema>) {
        if (type === 'edit') {
            try {
                const response = await fetch('http://localhost:3000/tieu-chi/' + tieuChi.id, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values, id_tieu_chi: tieuChi.id })
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
                const response = await fetch('http://localhost:3000/tieu-chi', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...values, id_nhom_tieu_chi: idNhom })
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
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="ten"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Câu hỏi</FormLabel>
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
                        name="noi_dung"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nội dung</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Aa" {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="loai_diem"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại điểm</FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value ?? "select-loai-diem"}
                                        value={field.value ?? ""}
                                        onValueChange={(v) => field.onChange(v)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn loại điểm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Điểm số">Điểm số</SelectItem>
                                            <SelectItem value="Điểm chữ">Điểm chữ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="diem_toi_da"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Điểm tối đa</FormLabel>
                                <FormControl>
                                    <Input type='text' placeholder="" {...field} {...field} />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center gap-1 w-full">
                        <Button type="submit" className="w-full">
                            {type === 'edit' ? "Lưu thay đổi" : "Thêm tiêu chí"}
                        </Button>
                    </div>
                </form>
            </Form>
            {type === 'edit' &&
                <Button variant={'destructive'} className="w-full text-center mt-2" onClick={() => deleteTieuChi()}>
                    Xóa tiêu chí
                </Button>
            }
        </div>
    )
}