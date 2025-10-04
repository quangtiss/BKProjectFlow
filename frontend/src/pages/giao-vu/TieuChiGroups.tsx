import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/routes/auth-context";
import { IconCirclePlusFilled, IconDots, IconEditCircle, IconTrashFilled } from "@tabler/icons-react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { FormTieuChi, FormTieuChiGroup } from "./FormTieuChi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { toRoman } from "@/services/numToRoman";

export default function TieuChiGroups() {
    const { user }: { user: any } = useAuth()
    const isGiaoVu = user.auth.role === "Giáo vụ";
    const { id } = useParams()
    const [data, setData] = useState([])
    const [toggle, setToggle] = useState(false)
    let count = 1;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/nhom-tieu-chi/' + id, {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                if (response.ok) setData(data.sort((a: any, b: any) => a.id - b.id))
                else toast.error('Lỗi khi lấy dữ liệu', { description: data.message })
            } catch (error) {
                toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [toggle, id])


    const deleteNhomTieuChi = async (id: number) => {
        try {
            const response = await fetch('http://localhost:3000/nhom-tieu-chi/' + id, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                toast.success('Đã xóa')
                setToggle(prev => !prev)
            }
            else {
                const data = await response.json()
                toast.error('Lỗi khi xóa', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi hệ thống!', { description: 'Vui lòng thử lại sau' })
            console.error(error)
        }
    }

    return (
        <div className="p-5 flex flex-col">
            {isGiaoVu && <div className="flex justify-end mb-5">
                <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"} className="flex justify-end">
                            <Plus className="rounded-2xl bg-accent-foreground text-accent" />
                            Thêm nhóm tiêu chí
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-9/10 overflow-y-auto">
                        <DialogTitle>Thêm nhóm tiêu chí</DialogTitle>
                        <DialogDescription />
                        <FormTieuChiGroup idBieuMau={Number(id)} type="create" />
                    </DialogContent>
                </Dialog>
            </div>}

            {data?.length > 0 ? data.map((nhomTieuChi: any, index: number) => (
                <div className="mb-5" key={index}>
                    <div className="flex justify-end">
                        <div className="flex item-center border-accent-foreground/10 border-5 border-b-0 rounded-t-lg p-1">
                            {isGiaoVu && <DropdownMenu>
                                <DropdownMenuTrigger><IconDots /></DropdownMenuTrigger>
                                <DropdownMenuContent>

                                    <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <DialogTrigger className="flex items-center gap-2">
                                                <IconCirclePlusFilled />Thêm tiêu chí
                                            </DialogTrigger>
                                        </DropdownMenuItem>
                                        <DialogContent className="max-h-9/10 overflow-y-auto">
                                            <DialogTitle>Thêm tiêu chí</DialogTitle>
                                            <DialogDescription />
                                            <FormTieuChi type="create" idNhom={nhomTieuChi.id} />
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <DialogTrigger className="flex items-center gap-2">
                                                <IconEditCircle />Sửa nhóm hiện tại
                                            </DialogTrigger>
                                        </DropdownMenuItem>
                                        <DialogContent className="max-h-9/10 overflow-y-auto">
                                            <DialogTitle>Sửa nhóm tiêu chí</DialogTitle>
                                            <DialogDescription />
                                            <FormTieuChiGroup idBieuMau={Number(id)} type="edit" nhomTieuChi={nhomTieuChi} />
                                        </DialogContent>
                                    </Dialog>


                                    <Dialog>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <DialogTrigger className="flex items-center gap-2">
                                                <IconTrashFilled />Xóa nhóm và tiêu chí
                                            </DialogTrigger>
                                        </DropdownMenuItem>
                                        <DialogContent className="max-h-9/10 overflow-y-auto">
                                            <DialogTitle>Bạn có chắc chắn muốn xóa nhóm tiêu chí này?</DialogTitle>
                                            <DialogDescription>
                                                Tác vụ này không thể hoàn tác, các tiêu chí bên trong nhóm cũng sẽ bị xóa theo
                                            </DialogDescription>
                                            <div className="flex flex-row w-full">
                                                <DialogClose className="w-1/2 mr-2" asChild>
                                                    <Button className="w-1/2" variant={"secondary"}>Hủy</Button>
                                                </DialogClose>
                                                <DialogClose className="w-1/2" asChild>
                                                    <Button onClick={() => { deleteNhomTieuChi(nhomTieuChi.id) }} className="w-1/2" variant={"destructive"}>Xác nhận</Button>
                                                </DialogClose>
                                            </div>
                                        </DialogContent>
                                    </Dialog>


                                </DropdownMenuContent>
                            </DropdownMenu>}
                        </div>
                    </div>
                    <div className="w-full flex flex-col rounded-2xl rounded-tr-none border-accent-foreground/10 border-5 overflow-hidden">
                        <div className="font-bold p-2 py-5 border-accent-foreground/10 border-b-2 bg-yellow-500/50">
                            {toRoman(index + 1) + ". "}
                            {nhomTieuChi.ten_nhom}
                        </div>
                        {nhomTieuChi.tieu_chi?.length > 0 ? nhomTieuChi.tieu_chi.map((tieuChi: any, index0: number) => (
                            <div key={index0}>
                                <div className="p-2 border-accent-foreground/10 border-b-2 bg-gray-600/50 font-medium">
                                    Câu hỏi {count++}: <span className="italic">{tieuChi.ten}</span>
                                    <div className="italic text-gray-500">{tieuChi.diem_toi_da !== 0 ? ("Tối đa " + tieuChi.diem_toi_da + " điểm") : "Không tính điểm"}</div>
                                </div>
                                <div className="p-2 pl-10 border-accent-foreground/10 border-b-10 whitespace-pre-line">
                                    {tieuChi.noi_dung}
                                    <div className="flex gap-2 justify-end border-accent-foreground/10 mt-5">
                                        {isGiaoVu && <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                            <DialogTrigger asChild>
                                                <Button variant={'outline'} size={'icon'}>
                                                    <IconEditCircle />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-9/10 overflow-y-auto">
                                                <DialogTitle>Sửa tiêu chí</DialogTitle>
                                                <DialogDescription />
                                                <FormTieuChi type="edit" tieuChi={tieuChi} />
                                            </DialogContent>
                                        </Dialog>}
                                    </div>
                                </div>
                            </div>
                        )) : <div className="text-center my-10">Không có câu hỏi!</div>}
                    </div>
                </div>
            )) : <div className="font-bold text-center text-gray-500">Hãy thêm tiêu chí để hoàn thiện biểu mẫu!</div>}
        </div>
    )
}