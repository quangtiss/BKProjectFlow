import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { User, File, Trash2 } from "lucide-react";
import ThemBaoCao from "./sinh-vien/ThemBaoCao";
import { toast } from "sonner";
import { IconEdit } from "@tabler/icons-react";
import { useAuth } from "@/routes/auth-context";

export default function BaoCao({ task, toggle, setToggle }: { task: any, toggle: boolean, setToggle: any }) {
    const { user }: { user: any } = useAuth()


    const deleteBaoCao = async (idBaoCao: number) => {
        try {
            const response = await fetch('http://localhost:3000/bao-cao/' + idBaoCao, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (response.ok) {
                toast.success('Đã xóa')
                setToggle((prev: any) => !prev)
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

    return (
        <Card className="ml-5 w-full border-0 border-l-10 border-blue-500/70">
            <CardHeader className="flex items-center">
                <User className="rounded-2xl bg-background p-1 w-8 h-8" />
                <h3 className="font-semibold text-lg flex flex-col">
                    <p>{task.sinh_vien.tai_khoan.ho + " " + task.sinh_vien.tai_khoan.ten}</p>
                    <p className="text-sm text-gray-600">{task.sinh_vien.mssv}</p>
                </h3>
            </CardHeader>
            <CardContent className="border-2 border-background rounded-lg m-4 bg-gray-600/30 p-4">
                <p className="text-sm">
                    {task.noi_dung}
                </p>
                <div className="flex flex-col gap-1 mt-8">
                    {task.tai_lieu.length > 0 && task.tai_lieu.map((doc: any) => (
                        <div key={doc.id} className="text-sm text-blue-500 flex gap-1 items-center">
                            <File className="w-4 h-4" />
                            <a href={`http://localhost:3000/utils/file/${doc.id}/${doc.ten_tai_lieu}`} target="_blank">{doc.ten_tai_lieu}</a>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="flex justify-between">
                <div>
                    {task.ngay_chinh_sua &&
                        <div className="italic text-sm text-gray-600">
                            Chỉnh sửa: {new Date(task.ngay_chinh_sua).toLocaleString()}
                        </div>
                    }
                </div>
                <div>
                    {user.auth.role === 'Sinh viên' && user.auth.sub === task.id_sinh_vien &&
                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size={'icon'} variant={'secondary'}>
                                        <IconEdit />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-9/10 overflow-y-auto">
                                    <DialogTitle>Chỉnh sửa báo cáo</DialogTitle>
                                    <DialogDescription />
                                    <ThemBaoCao toggle={toggle} setToggle={setToggle} type="edit" idBaoCao={task.id} />
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="icon" variant={'ghost'}>
                                        <Trash2 className="text-destructive" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-9/10 overflow-y-auto">
                                    <DialogTitle>Bạn có chắc chắn muốn xóa báo cáo?</DialogTitle>
                                    <DialogDescription>
                                        Tác vụ này không thể hoàn tác
                                    </DialogDescription>
                                    <div className="flex flex-row w-full">
                                        <DialogClose className="w-1/2 mr-2" asChild>
                                            <Button className="w-1/2" variant={"secondary"}>Hủy</Button>
                                        </DialogClose>
                                        <DialogClose className="w-1/2" asChild>
                                            <Button onClick={() => { deleteBaoCao(task.id) }} className="w-1/2" variant={"destructive"}>Xác nhận</Button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    }
                </div>
            </CardFooter>
        </Card>
    );
}
