import {
    BadgeInfo,
    Clock,
    Cog,
    Users,
    Upload,
    User,
    File,
    Files,
    Trash2,
    PenLine
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Expandable,
    ExpandableCard,
    ExpandableCardContent,
    ExpandableCardFooter,
    ExpandableCardHeader,
    ExpandableContent,
    ExpandableTrigger,
} from "@/components/ui/expandable"
import { AccordionTrigger, AccordionItem, AccordionContent, Accordion } from "@/components/ui/accordion"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import FormNhiemVu from "./giang-vien/FormNhiemVu"
import SubmitNhiemVu from "./sinh-vien/SubmitNhiemVu"
import { toast } from "sonner"
import { useState } from "react"
import { useAuth } from "@/routes/auth-context"


interface TaiLieu {
    id: number;
    id_nhiem_vu: number;
    ten_tai_lieu: string;
    url: string;
}

interface NhiemVu {
    id: number;
    ten: string;
    mo_ta: string;
    ngay_bat_dau: string;  // nếu BE trả ISO string thì để string
    ngay_ket_thuc: string;
    id_nguoi_them: number;
    id_de_tai: number;
    tai_lieu: TaiLieu[];  // có thể là [] luôn
    thuc_hien: any
}



export function NhiemVu({ nhiemVu, setToggle }: { nhiemVu: NhiemVu | undefined, setToggle: React.Dispatch<React.SetStateAction<boolean>> }) {
    const listThucHien = nhiemVu?.thuc_hien
        ?.slice() // copy ra để không làm thay đổi mảng gốc
        .sort((a: any, b: any) => {
            const dateA = new Date(a.ngay_thuc_hien).getTime()
            const dateB = new Date(b.ngay_thuc_hien).getTime()

            if (dateA !== dateB) {
                return dateA - dateB // ngày thực hiện sớm hơn đứng trước
            }

            const editA = new Date(a.ngay_chinh_sua).getTime()
            const editB = new Date(b.ngay_chinh_sua).getTime()
            return editA - editB // nếu ngày thực hiện bằng nhau thì so theo ngày chỉnh sửa
        })
    const isStart = () => {
        if (!nhiemVu?.ngay_bat_dau) return false  // chưa có ngày bắt đầu thì mặc định false
        const start = new Date(nhiemVu.ngay_bat_dau).getTime()
        const now = Date.now()
        return now >= start

    }
    const isEnd = () => {
        if (!nhiemVu?.ngay_ket_thuc) return false
        const due = new Date(nhiemVu.ngay_ket_thuc).getTime()
        const now = Date.now()
        return now >= due

    }
    const [open, setOpen] = useState(false);
    const [open0, setOpen0] = useState(false);
    const [open1, setOpen1] = useState(false);
    const { user }: { user: any } = useAuth()
    const deleteNhiemVu = async () => {
        try {
            const response = await fetch(`http://localhost:3000/nhiem-vu/${nhiemVu?.id}`, {
                method: "DELETE",
                credentials: 'include',
            })
            if (response.ok) {
                toast.success("Đã xóa nhiệm vụ")
                setToggle(prev => !prev)
            }
            else {
                const data = await response.json();
                toast.error("Lỗi!", {
                    description: data.message
                })
            }
        } catch (error) {
            console.log(error)
            toast.warning("Lỗi hệ thống!", {
                description: "Vui lòng thử lại sau"
            })
        }
    }

    const deleteThucHien = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/thuc-hien/${id}`, {
                method: "DELETE",
                credentials: 'include',
            })
            if (response.ok) {
                toast.success("Đã xóa bài làm")
                setToggle(prev => !prev)
            }
            else {
                const data = await response.json();
                toast.error("Lỗi!", {
                    description: data.message
                })
            }
        } catch (error) {
            console.log(error)
            toast.warning("Lỗi hệ thống!", {
                description: "Vui lòng thử lại sau"
            })
        }
    }


    return (
        <div className="flex flex-col items-center w-full p-5 mb-5">
            <Expandable
                expandDirection="both"
                expandBehavior="push"
                initialDelay={0.2}
                onExpandStart={() => { }}
                onExpandEnd={() => { }}
                className={`flex fex-row justify-center w-full`}
            >
                <ExpandableCard
                    className="min-w-[80%] max-w-full"
                    hoverToExpand={false}
                    expandDelay={200}
                    collapseDelay={500}
                >
                    <ExpandableCardHeader>
                        <div className="flex justify-between items-start w-full">
                            <ExpandableTrigger>
                                <div>
                                    {
                                        !isStart() ?
                                            <Badge
                                                variant={'default'}
                                                className="  mb-2"
                                            >
                                                Chưa mở
                                            </Badge>
                                            :
                                            nhiemVu?.thuc_hien.length === 0 ?
                                                (
                                                    !isEnd() ?
                                                        <Badge
                                                            variant={'outline'}
                                                            className="bg-yellow-100 text-yellow-600 dark:bg-yellow-600 dark:text-yellow-100  mb-2"
                                                        >
                                                            Chưa ai thực hiện
                                                        </Badge>
                                                        :
                                                        <Badge
                                                            variant={'outline'}
                                                            className="bg-red-100 text-red-600 dark:bg-red-600 dark:text-red-100  mb-2"
                                                        >
                                                            Không ai thực hiện
                                                        </Badge>
                                                )
                                                :
                                                <Badge
                                                    variant={'outline'}
                                                    className="bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100  mb-2"
                                                >
                                                    Đã có bài nộp
                                                </Badge>
                                    }
                                    <h3 className="hover:underline font-semibold text-xl text-gray-800 dark:text-white">
                                        {nhiemVu?.ten}
                                    </h3>
                                </div>
                            </ExpandableTrigger>
                            {["Giảng viên", "Giảng viên trưởng bộ môn"].includes(user.auth.role) && user.auth.sub === nhiemVu?.id_nguoi_them &&
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger onClick={() => setOpen(true)}>
                                        <Cog className="h-4 w-4" />
                                    </DialogTrigger>
                                    <DialogContent className="max-h-9/10 overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Chỉnh sửa nhiệm vụ</DialogTitle>
                                            <DialogDescription>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <FormNhiemVu type="edit" setToggle={setToggle} nhiemVu={nhiemVu} setOpen={setOpen} />
                                    </DialogContent>
                                </Dialog>}
                        </div>
                    </ExpandableCardHeader>

                    <ExpandableCardContent>
                        <div className="flex flex-col items-start justify-between mb-4">
                            <ExpandableContent preset="blur-md">
                                <div className="flex items-center">
                                    <BadgeInfo className="h-4 w-4 mr-1" />
                                    <span className="font-medium text-sm text-gray-800 dark:text-gray-100">Thông tin chi tiết:</span>
                                </div>
                            </ExpandableContent>
                        </div>
                        <ExpandableContent preset="blur-md" stagger staggerChildren={0.2}>
                            <p className="pl-5 text-sm text-gray-700 dark:text-gray-200 mb-4">
                                {nhiemVu?.mo_ta}
                            </p>
                            <div className="flex items-center mb-4">
                                <Files className="h-4 w-4 mr-1" />
                                <span className="font-medium text-sm text-gray-800 dark:text-gray-100">Tài liệu:</span>
                            </div>
                            <div className="pl-5 text-sm mb-4">
                                {nhiemVu?.tai_lieu.length && nhiemVu?.tai_lieu.length === 0 ? "Không có tài liệu!" :
                                    nhiemVu?.tai_lieu.map((file) => (
                                        <div key={file.id} className="flex flex-row items-center text-blue-600 hover:underline mb-2">
                                            <File className="h-4 w-4 mr-1" />
                                            <a href={`http://localhost:3000/utils/file/${file.id}/${file.ten_tai_lieu}`} target="_blank">
                                                {file.ten_tai_lieu}
                                            </a>
                                        </div>
                                    ))
                                }

                            </div>
                            <div className="mb-4">
                                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Người thực hiện:
                                </h4>
                                <div className="px-4 py-2 gap-2 flex flex-col rounded-md border-1">
                                    <div className="flex flex-col">
                                        <Accordion type="single" collapsible>
                                            {listThucHien.length > 0 ? listThucHien.map((thucHien: any) => (
                                                <AccordionItem key={thucHien.id} value={`item + ${thucHien?.id}`}>
                                                    <AccordionTrigger>
                                                        <div className=" flex flex-row">
                                                            <User className="h4 w-4 mr-2" />
                                                            <span>
                                                                {`${thucHien.sinh_vien.mssv} - `
                                                                    + thucHien.sinh_vien.tai_khoan.ho + " "
                                                                    + thucHien.sinh_vien.tai_khoan.ten}
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="gap-2 pl-6 flex flex-col">
                                                        <span>{thucHien.noi_dung}</span>
                                                        <div className="gap-2 flex flex-col justify-items-center text-blue-600">
                                                            {thucHien.tep_dinh_kem.length > 0 && thucHien.tep_dinh_kem.map((file: any) =>
                                                                <div key={file.id} className="flex flex-row items-center hover:underline">
                                                                    <File className="mr-1 h-4 w-4" />
                                                                    <a href={`http://localhost:3000/utils/file/${file.id}/${file.ten_tai_lieu}`} target="_blank" >
                                                                        {file.ten_tai_lieu}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="italic mt-4">Ngày thực hiện: {new Date(thucHien.ngay_thuc_hien).toLocaleString()}</span>
                                                        {thucHien.ngay_chinh_sua && <span className="italic mt-0">Ngày chỉnh sửa: {new Date(thucHien.ngay_chinh_sua).toLocaleString()}</span>}
                                                        {
                                                            user.auth.role === "Sinh viên" && thucHien.id_sinh_vien === user.auth.sub && isStart() && !isEnd() &&
                                                            <div className="mt-5 w-full border-1 border-blue-300 rounded-lg flex flex-row justify-between p-1 px-[40%]">
                                                                <Dialog open={open1} onOpenChange={setOpen1}>
                                                                    <DialogTrigger asChild onClick={() => setOpen1(true)}>
                                                                        <Button size="icon" variant={'ghost'}>
                                                                            <PenLine />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-h-9/10 overflow-y-auto">
                                                                        <DialogTitle>Chỉnh sửa bài làm</DialogTitle>
                                                                        <DialogDescription />
                                                                        <SubmitNhiemVu type="edit" thucHien={thucHien} idNhiemVu={nhiemVu?.id || 0} setToggle={setToggle} setOpen={setOpen1} />
                                                                    </DialogContent>
                                                                </Dialog>

                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <Button size="icon" variant={'ghost'}>
                                                                            <Trash2 className="text-destructive" />
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="max-h-9/10 overflow-y-auto">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Bạn có chắc chắn muốn xóa bài làm?</DialogTitle>
                                                                            <DialogDescription>
                                                                                Tác vụ này không thể hoàn tác
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogFooter className="flex flex-row w-full">
                                                                            <DialogClose className="w-1/2 mr-2" asChild>
                                                                                <Button className="w-1/2" variant={"secondary"}>Hủy</Button>
                                                                            </DialogClose>
                                                                            <DialogClose className="w-1/2" asChild>
                                                                                <Button onClick={() => deleteThucHien(thucHien.id)} className="w-1/2" variant={"destructive"}>Xác nhận</Button>
                                                                            </DialogClose>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        }

                                                    </AccordionContent>
                                                </AccordionItem>
                                            )) : "Chưa có bài nộp"}
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {
                                    user.auth.role === "Sinh viên" && (
                                        !isStart() ?
                                            <Button disabled className="w-full border-3 border-yellow-600 bg-accent text-foreground">
                                                <Upload className="h-4 w-4 mr-2" />
                                                Nhiệm vụ chưa mở
                                            </Button>
                                            :
                                            isEnd() ?
                                                <Button disabled className="w-full border-3 border-red-600 bg-accent text-foreground">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Nhiệm vụ đã khóa
                                                </Button>
                                                :
                                                nhiemVu?.thuc_hien.some((thucHien: any) => thucHien.id_sinh_vien === user.auth.sub) ?
                                                    <Button disabled className="w-full border-3 border-green-600 bg-accent text-foreground">
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Bạn đã thực hiện
                                                    </Button>
                                                    :
                                                    <Dialog open={open0} onOpenChange={setOpen0}>
                                                        <DialogTrigger asChild onClick={() => setOpen0(true)}>
                                                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                                                <Upload className="h-4 w-4 mr-2" />
                                                                Thực hiện
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-h-9/10 overflow-y-auto">
                                                            <DialogTitle>Thực hiện nhiệm vụ</DialogTitle>
                                                            <DialogDescription />
                                                            <SubmitNhiemVu type="create" idNhiemVu={nhiemVu?.id || 0} setToggle={setToggle} setOpen={setOpen0} />
                                                        </DialogContent>
                                                    </Dialog>
                                    )
                                }
                            </div>
                        </ExpandableContent>
                    </ExpandableCardContent>
                    <ExpandableCardFooter className="flex flex-row justify-between">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="flex flex-row gap-2 items-center">
                                <span className="flex flex-col">
                                    <span>{nhiemVu && new Date(nhiemVu.ngay_bat_dau).toLocaleTimeString()}</span>
                                    <span>{nhiemVu && new Date(nhiemVu.ngay_bat_dau).toLocaleDateString()}</span>
                                    <span>{" "}</span>
                                </span>
                                <span>→</span>
                                <span className="flex flex-col">
                                    <span>{nhiemVu && new Date(nhiemVu.ngay_ket_thuc).toLocaleTimeString()}</span>
                                    <span>{nhiemVu && new Date(nhiemVu.ngay_ket_thuc).toLocaleDateString()}</span>
                                </span>
                            </span>
                        </div>
                        {["Giảng viên", "Giảng viên trưởng bộ môn"].includes(user.auth.role) && user.auth.sub === nhiemVu?.id_nguoi_them &&
                            <Dialog>
                                <DialogTrigger>
                                    <Trash2 className="ml-2 text-destructive h-4 w-4" />
                                </DialogTrigger>
                                <DialogContent className="max-h-9/10 overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Bạn có chắc chắn muốn xóa nhiệm vụ này?</DialogTitle>
                                        <DialogDescription>
                                            Tác vụ này không thể hoàn tác
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="flex flex-row w-full">
                                        <DialogClose className="w-1/2 mr-2" asChild>
                                            <Button className="w-1/2" variant={"secondary"}>Hủy</Button>
                                        </DialogClose>
                                        <DialogClose className="w-1/2" asChild>
                                            <Button onClick={deleteNhiemVu} className="w-1/2" variant={"destructive"}>Xác nhận</Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        }
                    </ExpandableCardFooter>
                </ExpandableCard>
            </Expandable >
        </div>
    )
}
