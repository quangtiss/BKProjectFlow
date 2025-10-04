import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconPencilCog, IconTablePlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
import { toast } from "sonner"
import { useAuth } from "@/routes/auth-context"


export function ChuDe() {
    const { user }: { user: any } = useAuth()
    const [listChuDe, setListChuDe] = useState([])
    const [reload, setReload] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/chu-de', {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                if (response.ok) setListChuDe(data.sort((a: any, b: any) => a.id - b.id))
                else toast.error('Lỗi khi lấy dữ liệu', { description: data.message })
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [reload])

    const isGiaoVu = user.auth.role === "Giáo vụ"


    return (
        <div className="p-5">
            <div className="flex justify-end mb-3">
                {isGiaoVu &&
                    <Dialog>

                        <DialogTrigger asChild>
                            <Button variant="outline"><IconTablePlus />Thêm chủ đề</Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <FormChuDe type="create" setReload={setReload} />
                        </DialogContent>
                    </Dialog>
                }
            </div>



            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] font-extrabold">STT</TableHead>
                        <TableHead className="font-extrabold">Tiếng Việt</TableHead>
                        {isGiaoVu ? <TableHead className="font-extrabold">Tiếng anh</TableHead> :
                            <TableHead className="font-extrabold text-right">Tiếng anh</TableHead>}
                        {isGiaoVu && <TableHead className="text-right font-extrabold">Chỉnh sửa</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listChuDe.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                Không tìm thấy kết quả.
                            </TableCell>
                        </TableRow> :
                        listChuDe.map((chuDe: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{chuDe.ten_tieng_viet}</TableCell>
                                {isGiaoVu ? <TableCell>{chuDe.ten_tieng_anh}</TableCell> : <TableCell className="text-right">{chuDe.ten_tieng_anh}</TableCell>}
                                {isGiaoVu && <TableCell className="text-right">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <IconPencilCog />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <FormChuDe type="edit" setReload={setReload} chuDe={chuDe} />
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>}
                            </TableRow>
                        )
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

function FormChuDe({ setReload, type, chuDe }: { setReload: any, type: 'create' | 'edit', chuDe?: any }) {
    const ChuDeSchema = z.object({
        ten_tieng_viet: z.string()
            .min(1, { message: 'Tên phải dài hơn 1 ký tự' })
            .max(800, { message: 'Tên không được vượt quá 800 ký tự' }),
        ten_tieng_anh: z.string()
            .min(1, { message: 'Tên phải dài hơn 1 ký tự' })
            .max(800, { message: 'Tên không được vượt quá 800 ký tự' })
    })

    const form = useForm<z.infer<typeof ChuDeSchema>>({
        resolver: zodResolver(ChuDeSchema),
        defaultValues: {
            ten_tieng_viet: "",
            ten_tieng_anh: ""
        },
    })

    useEffect(() => {
        if (type === 'edit') form.reset({
            ten_tieng_viet: chuDe.ten_tieng_viet,
            ten_tieng_anh: chuDe.ten_tieng_anh
        })
    }, [type, chuDe, form])



    async function deleteHocKy() {
        try {
            const response = await fetch('http://localhost:3000/chu-de/' + chuDe.id, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (response.ok) {
                toast.success('Đã xóa')
                setReload((prev: any) => !prev)
            }
            else {
                const data = await response.json()
                toast.error('Lỗi khi xóa', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
            console.error(error)
        }
    }


    async function onSubmit(values: z.infer<typeof ChuDeSchema>) {
        if (type === 'create') {
            const response = await fetch('http://localhost:3000/chu-de', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            const data = await response.json()
            if (response.ok) {
                toast.success("Đã tạo")
                setReload((prev: any) => !prev)
            }
            else toast.error("Không thể tạo", { description: data.message })

        } else {
            try {
                const response = await fetch('http://localhost:3000/chu-de/' + chuDe.id, {
                    method: 'PATCH',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                })
                if (response.ok) {
                    toast.success('Đã lưu')
                    setReload((prev: any) => !prev)
                }
                else {
                    const data = await response.json()
                    toast.error('Lỗi khi lưu', { description: data.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <DialogHeader>
                        <DialogTitle>Tạo học kỳ</DialogTitle>
                        <DialogDescription>
                            Tạo học kỳ với tên học kỳ khác nhau
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="ten_tieng_viet"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên Tiếng Việt</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Aa" {...field} />
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
                                        <FormLabel>Tên Tiếng Anh</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Az" {...field} />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <DialogFooter className="w-full">
                        <Button className="w-full" type="submit">{type === 'create' ? "Tạo chủ đề" : "Lưu thay đổi"}</Button>
                    </DialogFooter>
                </form>
            </Form>
            {type === "edit" && <Button className="w-full mt-2" variant={'destructive'} onClick={() => deleteHocKy()}>Xóa chủ đề</Button>}
        </div>)
}