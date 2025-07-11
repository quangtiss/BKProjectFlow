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
    DialogClose,
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


export function HocKy() {
    const [listHocKy, setListHocKy] = useState([])
    const [reload, setReload] = useState(false)
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState("00:00:00");

    useEffect(() => {
        const fetchListHocKy = async () => {
            const data = await GetAllHocKy();
            if (data) setListHocKy(data)
        }
        fetchListHocKy()
    }, [reload])


    const form = useForm<z.infer<typeof HocKyChema>>({
        resolver: zodResolver(HocKyChema),
        defaultValues: {
            ten_hoc_ky: 211,
            nam_hoc: 2021,
            ngay_bat_dau: new Date(new Date().setHours(0, 0, 0, 0))
        },
    })


    async function onSubmit(values: z.infer<typeof HocKyChema>) {
        const response = await CreateHocKy(values)
        if (response === "Succcess!") {
            toast("Thành công tạo học kỳ " + values.ten_hoc_ky)
            setReload((prev) => !prev)
        }
        else toast("Thất bại tạo học kỳ " + values.ten_hoc_ky)
    }


    return (
        <div className="p-3">
            <div className="flex justify-end mb-3">
                <Dialog>

                    <DialogTrigger asChild>
                        <Button variant="outline"><IconTablePlus />Thêm học kỳ</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
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
                                                        <Input type="number" {...field} placeholder="XXXX" />
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
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>

                </Dialog>
            </div>



            <Table>
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] font-extrabold">Học kỳ</TableHead>
                        <TableHead className="font-extrabold">Năm học</TableHead>
                        <TableHead className="font-extrabold">Thời gian</TableHead>
                        <TableHead className="text-right font-extrabold">Chỉnh sửa</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {listHocKy.length === 0 ?
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                Không tìm thấy kết quả.
                            </TableCell>
                        </TableRow> :
                        listHocKy.map((HocKy) => {
                            const date = new Date(HocKy.ngay_bat_dau).toLocaleString()
                            return (
                                <TableRow key={HocKy.id}>
                                    <TableCell className="font-medium">{HocKy.ten_hoc_ky}</TableCell>
                                    <TableCell>{HocKy.nam_hoc + " " + HocKy.nam_hoc + 1}</TableCell>
                                    <TableCell>{date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <IconPencilCog />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}