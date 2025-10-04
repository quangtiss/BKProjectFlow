import { Button } from "@/components/ui/button";
import { NhiemVu } from "./NhiemVu";
import { ListPlus, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FormNhiemVu from "./giang-vien/FormNhiemVu";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/routes/auth-context";
import BaoCao from "./BaoCao";
import Forbidden from "./403";
import ThemBaoCao from "./sinh-vien/ThemBaoCao";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";


export default function TienDo() {
    const [forbidden, setForbidden] = useState(false)
    const [data, setData] = useState<any>([]);
    const [toggle, setToggle] = useState<boolean>(false)
    const { user }: { user: any } = useAuth()
    const { id } = useParams()
    function diffDates(d1: Date, d2: Date): string {
        const arangeTime = d2.getTime() - d1.getTime()

        const msInDay = 1000 * 60 * 60 * 24;
        const dayDiff = Math.floor(arangeTime / msInDay);

        if (dayDiff > 0) {
            return `${dayDiff} ngày trước`;
        } else {
            const msInHour = 1000 * 60 * 60;
            const hourDiff = Math.floor(arangeTime / msInHour);
            if (hourDiff > 0) return `${hourDiff} giờ trước`;
            else {
                const msInMinute = 1000 * 60
                const minuteDiff = Math.floor(arangeTime / msInMinute)
                if (minuteDiff > 0) return `${minuteDiff} phút trước`
                else {
                    const ms = 1000
                    const msDiff = Math.floor(arangeTime / ms)
                    if (msDiff > 0) return `${msDiff} giây trước`
                    return "bây giờ"
                }
            }
        }
    }
    useEffect(() => {
        const checkUser = async () => {
            const response0 = await fetch('http://localhost:3000/de-tai/' + id, {
                method: 'GET',
                credentials: 'include'
            })
            if (response0.ok) {
                const data = await response0.json()
                if (user.auth.role === 'Sinh viên') {
                    if (!data.dang_ky.some((item: any) => item.id_sinh_vien === user.auth.sub && item.trang_thai === "Đã chấp nhận")) setForbidden(true)
                } else {
                    if (!data.huong_dan.some((item: any) => item.id_giang_vien === user.auth.sub && item.trang_thai === "Đã chấp nhận")) setForbidden(true)
                }
            } else setForbidden(true)
        }
        checkUser()
        const fetchData = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch("http://localhost:3000/bao-cao/de-tai/" + id, {
                        method: 'GET',
                        credentials: 'include'
                    }),
                    fetch("http://localhost:3000/nhiem-vu/de-tai/" + id, {
                        method: 'GET',
                        credentials: 'include'
                    })
                ])
                const [data1, data2] = await Promise.all([response1.json(), response2.json()])
                if (response1.ok && response2.ok) {
                    const normalizeA = data1.map((item: any) => ({
                        ...item,
                        type: 'Báo cáo',
                        date: new Date(item.ngay_thuc_hien).getTime()
                    }));

                    const normalizeB = data2.map((item: any) => ({
                        ...item,
                        type: 'Nhiệm vụ',
                        date: new Date(item.ngay_ket_thuc).getTime()
                    }));
                    normalizeB.forEach((element: any) => {
                        element.thuc_hien.sort((a: any, b: any) => new Date(a.ngay_thuc_hien).getTime() - new Date(b.ngay_thuc_hien).getTime() || a.id - b.id)
                    });

                    const merged = [...normalizeA, ...normalizeB];
                    const now = new Date().getTime()
                    merged.sort((a: any, b: any) => Math.abs(a.date - now) - Math.abs(b.date - now) || b.id - a.id);
                    setData(merged)
                } else {
                    toast.error('Lỗi khi lấy dữ liệu ban đầu')
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [toggle, id, user.auth.sub, user.auth.role])


    const [textSearch, setTextSearch] = useState("");
    const [filterData, setFilterData] = useState<any[]>([])
    useEffect(() => {
        setFilterData(data.filter((item: any) => {
            if (textSearch.trim() === "") return true
            const textInput = textSearch.trim().toLowerCase()
            if (item.type === 'Báo cáo')
                return (
                    item.noi_dung
                    + item.tai_lieu.map((item: any) => item.ten_tai_lieu).join("")
                    + item.sinh_vien.mssv
                    + item.sinh_vien.tai_khoan.ho + " "
                    + item.sinh_vien.tai_khoan.ten
                    + item.sinh_vien.email
                ).trim().toLowerCase().includes(textInput)
            else
                return (
                    item.ten
                    + item.mo_ta
                    + item.tai_lieu.map((item: any) => item.ten_tai_lieu).join("")
                    + item.giang_vien.msgv
                    + item.giang_vien.tai_khoan.ho + " "
                    + item.giang_vien.tai_khoan.ten
                    + item.giang_vien.email
                ).trim().toLowerCase().includes(textInput)
        }))
    }, [textSearch, data])

    if (forbidden) return <Forbidden />
    return (
        <div className="flex flex-col w-full h-full p-2">
            <div className="flex justify-end mb-2">
                <div className="relative w-full mr-2 h-8">
                    <Input
                        type="search"
                        placeholder="Tìm kiếm..."
                        value={textSearch}
                        onChange={(e) => setTextSearch(e.target.value)}
                        className="pl-4 pr-10"
                    />
                    <IconSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                </div>
                {user.auth.role === 'Sinh viên' ?
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"secondary"}>
                                <Plus className="rounded-2xl bg-accent-foreground text-accent" />
                                Thêm tiến trình
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-9/10 overflow-y-auto">
                            <DialogTitle>Thêm tiến trình cho đề tài</DialogTitle>
                            <DialogDescription />
                            <ThemBaoCao toggle={toggle} setToggle={setToggle} type="create" />
                        </DialogContent>
                    </Dialog>
                    :
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
                    </Dialog>
                }
            </div>
            {filterData.length > 0 ?
                <div className="flex flex-col w-full h-full">
                    <div className="mb-5">
                        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-balance text-gray-600">
                            {"Cập nhật của sinh viên: "}
                            <span className="underline text-green-500">
                                {diffDates(new Date(filterData[0].date), new Date())}
                            </span>
                        </h1>
                        <p className="text-sm text-gray-600">từ: {new Date().toLocaleString()}</p>
                    </div>
                    <div className="relative flex flex-col w-full">
                        {filterData.map((item: any, index: number) => (
                            <div key={index} className="flex w-full h-full">
                                <div className="h-auto overflow-x-auto flex flex-col item-center justify-center w-20 text-sm font-medium text-gray-600">
                                    <div>{new Date(item.date).toLocaleDateString()}</div>
                                    <div>{new Date(item.date).toLocaleTimeString()}</div>
                                </div>

                                {/* Time & Pulse Circle */}
                                <div className="flex flex-col items-center h-full">
                                    <div className="h-full w-[3px] bg-gray-500/30 mb-5" />
                                    <div className="relative flex items-center justify-center">
                                        {/* Pulse animation */}
                                        <motion.div
                                            className="absolute h-6 w-6 rounded-full bg-blue-400 opacity-40"
                                            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <div className="h-3 w-3 rounded-full bg-blue-500 relative z-10" />
                                    </div>
                                    <div className="h-full w-[3px] bg-gray-500/30 mt-5" />
                                </div>
                                <div className="py-10 w-full pr-5 max-w-full">
                                    {item.type === 'Báo cáo' ? <BaoCao toggle={toggle} setToggle={setToggle} task={item} /> : <NhiemVu nhiemVu={item} setToggle={setToggle} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                :
                <h1 className="scroll-m-20 text-xl text-center font-bold tracking-tight text-balance text-gray-600">
                    Không có cập nhật!
                </h1>
            }
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
            className={`w-[200px] h-[40px] px-1 flex flex-col border-2 rounded-full
                 hover:border-green-600
                 hover:cursor-pointer
                 ${progress === 100 ? "bg-green-500/20" : (
                    progress < 0 ? "bg-accent" : "bg-yellow-500/20"
                )}`}
            onClick={() => navigate(`/tien-do-de-tai/${idDeTai}`)}
        >
            <div className="mx-auto text-xs">Tiến độ</div>
            {progress >= 0 && <Progress value={progress} className={`h-[3px] rounded-2xl ${progress === 100 ? "[&>div]:bg-green-500" : "[&>div]:bg-yellow-500"}`} />}
            <div className="mx-auto text-xs">
                {progress >= 0 ? `${progress}% (${countNhiemVu?.da_lam ?? ""}/${countNhiemVu?.so_luong ?? ""})` : "Chưa có nhiệm vụ"}
            </div>
        </div>
    )
}