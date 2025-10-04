import { Button } from "@/components/ui/button"
import { useAuth } from "@/routes/auth-context"
import { DialogTrigger, DialogContent, DialogTitle, DialogDescription, Dialog } from "@/components/ui/dialog"
import { PenLine, Plus } from "lucide-react"
import FormBieuMau from "./FormBieuMau"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useNavigate } from "react-router-dom"

export default function BieuMauList() {
    const { user }: { user: any } = useAuth()
    const navigate = useNavigate()
    const isGiaoVu = user.auth.role === "Giáo vụ";
    const [data, setData] = useState([])
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/mau-danh-gia', {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                if (response.ok) setData(data.sort((a: any, b: any) => a.id - b.id))
                else toast.error('Lỗi khi lấy dữ liệu', { description: data.message })
            } catch (error) {
                toast.warning('Lỗi khi lấy dữ liệu')
                console.error(error)
            }
        }
        fetchData()
    }, [toggle])


    return (
        <div className="flex flex-col w-full h-full p-2">
            {isGiaoVu &&
                <div className="flex justify-end mb-2">
                    <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                        <DialogTrigger asChild>
                            <Button variant={"secondary"} className="flex justify-end">
                                <Plus className="rounded-2xl bg-accent-foreground text-accent" />
                                Thêm biểu mẫu
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-9/10 overflow-y-auto">
                            <DialogTitle>Thêm biểu mẫu</DialogTitle>
                            <DialogDescription />
                            <FormBieuMau type="create" />
                        </DialogContent>
                    </Dialog>
                </div>
            }
            {data?.length > 0 ?
                <div className="border-2 rounded-2xl overflow-hidden bg-blue-600/10">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">STT</TableHead>
                                <TableHead>Tên biểu mẫu</TableHead>
                                <TableHead>Phân loại</TableHead>
                                <TableHead>Giai đoạn</TableHead>
                                <TableHead className="text-right">Ghi chú</TableHead>
                                {isGiaoVu && <TableHead className="text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((bieuMau: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell
                                        className="hover:underline hover:text-blue-500 hover:cursor-pointer"
                                        onClick={() => navigate('/bieu-mau/' + bieuMau.id)}
                                    >
                                        {bieuMau.ten_mau}
                                    </TableCell>
                                    <TableCell>{bieuMau.loai_mau}</TableCell>
                                    <TableCell>{bieuMau.giai_doan}</TableCell>
                                    <TableCell className="text-right">{bieuMau.ghi_chu}</TableCell>
                                    {isGiaoVu && <TableCell className="text-right">
                                        <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                                            <DialogTrigger asChild>
                                                <Button variant={"outline"} size={'icon'} className="hover:text-yellow-400">
                                                    <PenLine />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-h-9/10 overflow-y-auto">
                                                <DialogTitle>Chỉnh sửa biểu mẫu</DialogTitle>
                                                <DialogDescription />
                                                <FormBieuMau type="edit" idBieuMau={bieuMau.id} />
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                :
                <div className="text-center font-bold text-gray-600 text-xl">
                    Không có biểu mẫu nào!
                </div>
            }
        </div>
    )
}