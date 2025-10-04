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
import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { HocKyChema } from "@/validations/hoc_ky.schema"
import { CreateHocKy } from "@/services/hoc_ky/create_hoc_ky"
import { toast } from "sonner"
import { GetAllHocKy } from "@/services/hoc_ky/get_all_hoc_ky"
import { useAuth } from "@/routes/auth-context"
import { getCurrentAndNextHocKy } from "@/services/getCurrentNextHocKy"


export function HocKy() {
    const { user }: { user: any } = useAuth()
    const [listHocKy, setListHocKy] = useState([])
    const [reload, setReload] = useState(false)

    useEffect(() => {
        const fetchListHocKy = async () => {
            const data = await GetAllHocKy();
            if (data) setListHocKy(data.sort((a: any, b: any) => a.ten_hoc_ky - b.ten_hoc_ky))
        }
        fetchListHocKy()
    }, [reload])

    const isGiaoVu = user.auth.role === "Giáo vụ"
    const currentHocKy = getCurrentAndNextHocKy(listHocKy).current?.id


    return (
        <div className="p-5">
            <div className="flex justify-end mb-3">
                {isGiaoVu &&
                    <Dialog>

                        <DialogTrigger asChild>
                            <Button variant="outline"><IconTablePlus />Thêm học kỳ</Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <FormHocKy type="create" setReload={setReload} />
                        </DialogContent>
                    </Dialog>
                }
            </div>



            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] font-extrabold">Học kỳ</TableHead>
                        <TableHead className="font-extrabold">Năm học</TableHead>
                        {isGiaoVu ? <TableHead className="font-extrabold">Thời gian</TableHead> :
                            <TableHead className="font-extrabold text-right">Thời gian</TableHead>}
                        {isGiaoVu && <TableHead className="text-right font-extrabold">Chỉnh sửa</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listHocKy.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                Không tìm thấy kết quả.
                            </TableCell>
                        </TableRow> :
                        listHocKy.map((HocKy: any) => {
                            const date = new Date(HocKy.ngay_bat_dau).toLocaleString()
                            return (
                                <TableRow key={HocKy.id}>
                                    <TableCell className="font-medium">{HocKy.ten_hoc_ky} {currentHocKy === HocKy.id && <span className="italic text-blue-600/80">(Hiện hành)</span>}</TableCell>
                                    <TableCell>{HocKy.nam_hoc + " - " + Number(HocKy.nam_hoc + 1)}</TableCell>
                                    {isGiaoVu ? <TableCell>{date}</TableCell> : <TableCell className="text-right">{date}</TableCell>}
                                    {isGiaoVu && HocKy.id_nguoi_them === user.auth.sub && <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <IconPencilCog />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <FormHocKy type="edit" setReload={setReload} hocKy={HocKy} />
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>}
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

function FormHocKy({ setReload, type, hocKy }: { setReload: any, type: 'create' | 'edit', hocKy?: any }) {
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("00:00:00");
    const form = useForm<z.infer<typeof HocKyChema>>({
        resolver: zodResolver(HocKyChema),
        defaultValues: {
            ten_hoc_ky: 211,
            nam_hoc: 2021,
            ngay_bat_dau: new Date(new Date().setHours(0, 0, 0, 0))
        },
    })

    useEffect(() => {
        if (type === 'edit') form.reset({
            ten_hoc_ky: hocKy.ten_hoc_ky,
            nam_hoc: hocKy.nam_hoc,
            ngay_bat_dau: new Date(hocKy.ngay_bat_dau)
        })
    }, [type, hocKy, form])



    // async function deleteHocKy() {
    //     try {
    //         const response = await fetch('http://localhost:3000/hoc-ky/' + hocKy.id, {
    //             method: 'DELETE',
    //             credentials: 'include',
    //         })
    //         if (response.ok) {
    //             toast.success('Đã xóa')
    //             setReload((prev: any) => !prev)
    //         }
    //         else {
    //             const data = await response.json()
    //             toast.error('Lỗi khi xóa', { description: data.message })
    //         }
    //     } catch (error) {
    //         toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
    //         console.error(error)
    //     }
    // }


    async function onSubmit(values: z.infer<typeof HocKyChema>) {
        if (type === 'create') {
            const response = await CreateHocKy(values)
            if (response === "Succcess!") {
                toast.success("Thành công tạo học kỳ " + values.ten_hoc_ky)
                setReload((prev: any) => !prev)
            }
            else toast.error("Thất bại tạo học kỳ " + values.ten_hoc_ky)
        } else {
            try {
                const response = await fetch('http://localhost:3000/hoc-ky/' + hocKy.id, {
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
                                name="ten_hoc_ky"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên học kỳ</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="XXX" {...field} />
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
                                name="nam_hoc"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Năm học</FormLabel>
                                        <FormControl>
                                            <Input min={1900} max={3000} type="number" {...field} placeholder="XXXX" />
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
                                name="ngay_bat_dau"
                                render={({ field }) => {
                                    const currentDate = field.value ?? new Date();

                                    return (
                                        <FormItem>
                                            <FormLabel>Ngày bắt đầu</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-4">
                                                    <div className="flex flex-col gap-3">
                                                        <Popover open={open} onOpenChange={setOpen}>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    id="date-picker"
                                                                    className="w-32 justify-between font-normal"
                                                                >
                                                                    {currentDate
                                                                        ? currentDate.toLocaleDateString()
                                                                        : "Select date"}
                                                                    <ChevronDownIcon />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value}
                                                                    captionLayout="dropdown"
                                                                    onSelect={(selectedDate) => {
                                                                        if (!selectedDate) return;

                                                                        const [hours, minutes, seconds] = time
                                                                            .split(":")
                                                                            .map(Number);
                                                                        selectedDate.setHours(hours);
                                                                        selectedDate.setMinutes(minutes);
                                                                        selectedDate.setSeconds(seconds);

                                                                        field.onChange(selectedDate);
                                                                        setOpen(false);
                                                                    }}
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <Input
                                                            type="time"
                                                            id="time-picker"
                                                            step="1"
                                                            value={time}
                                                            onChange={(e) => {
                                                                const newTime = e.target.value;
                                                                setTime(newTime);

                                                                const [hours, minutes, seconds] = newTime
                                                                    .split(":")
                                                                    .map(Number);
                                                                const updatedDate = new Date(currentDate);
                                                                updatedDate.setHours(hours);
                                                                updatedDate.setMinutes(minutes);
                                                                updatedDate.setSeconds(seconds);

                                                                field.onChange(updatedDate);
                                                            }}
                                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                        />
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription />
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter className="w-full">
                        <Button className="w-full" type="submit">{type === 'create' ? "Tạo học kì" : "Lưu thay đổi"}</Button>
                    </DialogFooter>
                </form>
            </Form>
            {/* {type === "edit" && <Button className="w-full mt-2" variant={'destructive'} onClick={() => deleteHocKy()}>Xóa học kỳ</Button>} */}
        </div>)
}