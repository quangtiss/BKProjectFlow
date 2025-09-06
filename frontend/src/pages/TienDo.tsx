import { Button } from "@/components/ui/button";
import { NhiemVu } from "./NhiemVu";
import { ListPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FormNhiemVu from "./giang-vien/FormNhiemVu";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/auth-context";

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

export default function TienDo() {
    const [listNhiemVu, setListNhiemVu] = useState<NhiemVu[]>([])
    const [toggle, setToggle] = useState<boolean>(false)
    const { user }: { user: any } = useAuth()
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("http://localhost:3000/nhiem-vu", {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok) {
                const data: NhiemVu[] = await response.json();

                // sắp xếp
                data.sort((a, b) => {
                    const dateEndA = new Date(a.ngay_ket_thuc).getTime();
                    const dateEndB = new Date(b.ngay_ket_thuc).getTime();

                    if (dateEndA === dateEndB) {
                        const dateStartA = new Date(a.ngay_bat_dau).getTime();
                        const dateStartB = new Date(b.ngay_bat_dau).getTime();
                        if (dateStartA === dateStartB) return a.id - b.id
                        return dateStartA - dateStartB;
                    }
                    return dateEndA - dateEndB; // kết thúc sớm hơn lên trước
                });

                setListNhiemVu(data);
            }
        }
        fetchData()
    }, [toggle])
    return (
        <div className="flex flex-col items-center gap-4 p-5">
            <div className="flex flex-row w-full justify-end">
                {["Giảng viên trưởng bộ môn", "Giảng viên"].includes(user.auth.role) &&
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <ListPlus />
                                Thêm nhiệm vụ
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-9/10 overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Tạo nhiệm vụ mới</DialogTitle>
                            </DialogHeader>
                            <DialogDescription />
                            <FormNhiemVu type="create" setToggle={setToggle} />
                        </DialogContent>
                    </Dialog>}
            </div>
            {listNhiemVu.length > 0 ?
                listNhiemVu.map((nhiemVu) => (
                    <NhiemVu setToggle={setToggle} key={nhiemVu?.id} nhiemVu={nhiemVu} />
                ))
                : "Chưa có nhiệm vụ nào!"}
            <div className="h-2/10">

            </div>
        </div>
    )
}

export function TienDoTrigger({ idDeTai }: { idDeTai: number }) {
    const [progress, setProgress] = useState(0)
    const [countNhiemVu, setCountNhiemVu] = useState<any>()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/nhiem-vu/count/de-tai/${idDeTai}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                setCountNhiemVu(data)
                if (response.ok) {
                    if (data.so_luong === 0) setProgress(-1)
                    else setProgress(Math.floor(data?.da_lam / data?.so_luong * 100))
                }
                else {
                    toast.error("Gặp lỗi khi kiểm tra tiến độ", { description: data.message })
                }
            } catch (error) {
                console.error(error)
                toast.warning("Lỗi hệ thống khi kiểm tra tiến độ!")
            }
        }
        fetchData()
    }, [idDeTai])

    return (
        <div
            className={`w-full p-4 flex flex-col gap-2 border-2 rounded-lg
                 hover:border-green-600
                 hover:cursor-pointer
                 ${progress === 100 ? "bg-green-500/20" : (
                    progress < 0 ? "bg-red-500/20" : "bg-yellow-500/20"
                )}`}
            onClick={() => navigate(`/tien-do-de-tai/${idDeTai}`)}
        >
            <div className="text-lg font-semibold">Tiến độ thực hiện</div>
            {progress >= 0 && <Progress value={progress} className={`h-6 rounded-2xl ${progress === 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-yellow-500"}`} />}
            <div className="text-lg font-extrabold">
                {progress >= 0 ? `${progress}% (${countNhiemVu?.da_lam ?? ""}/${countNhiemVu?.so_luong ?? ""})` : "Chưa có nhiệm vụ nào được giao"}
            </div>
        </div>
    )
}