import { useAuth } from "@/routes/auth-context"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toRoman } from "@/services/numToRoman"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import TomTatDiem from "./TomTatDiem"
import { IconArrowLeft, IconChecks, IconRefresh } from "@tabler/icons-react"
import OverViewAllScores from "./OverViewAllScores"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ChamDiemHoiDong() {
    const { id } = useParams()
    const { user }: { user: any } = useAuth()
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [bieuMau, setBieuMau] = useState<any>([])
    const [deTai, setDeTai] = useState<any>()
    const [selectSV, setSelectSV] = useState<number>()
    const [isDone, setDone] = useState(false)
    const [overView, setOverView] = useState(false)
    // Điểm hiện tại đang được nhập
    const [scores, setScores] = useState<{ [key: string]: number }>({})
    // Điểm của all sinh viên
    const [allScores, setAllScores] = useState<{ [idSV: number]: { id_tieu_chi: number, diem: number | string }[] }>({})
    const tongDiem = bieuMau.nhom_tieu_chi?.reduce(
        (sumNhom: number, nhomTieuChi: any) => {
            return (
                sumNhom +
                nhomTieuChi.tieu_chi.reduce((sum: number, tieuChi: any) => {
                    const val = scores[tieuChi.id];
                    if (val === undefined || val === null) return sum;

                    if (tieuChi.loai_diem === "Điểm số") {
                        return sum + val;
                    }

                    return sum;
                }, 0)
            );
        },
        0
    );
    let count = 1;
    const [idHocKy, setIdHocKy] = useState(0)
    const [gd, setGD] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response0 = await fetch('http://localhost:3000/de-tai/' + id, {
                    method: 'GET',
                    credentials: 'include'
                })
                const data0 = await response0.json()
                if (response0.ok) {
                    setDeTai(data0)
                    setIdHocKy(data0.thuoc_ve.find((item: any) => item.trang_thai === 'Đang làm')?.hoc_ky?.id)
                    setGD(data0.giai_doan)
                    const response = await fetch('http://localhost:3000/mau-danh-gia/giang-vien?loai_mau=Hội đồng&giai_doan=' + data0.giai_doan, {
                        method: 'GET',
                        credentials: 'include'
                    })
                    const data = await response.json()
                    if (response.ok) {
                        setBieuMau(data)
                    } else {
                        toast.error('Lỗi khi lấy biểu mẫu', { description: data.message })
                    }
                } else {
                    toast.error('Không thể lấy dữ liệu đề tài', { description: data0.message })
                }
            } catch (error) {
                toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [id])


    const [dataOverView, setDataOverView] = useState([])
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        if (overView) {
            const fetchAllDiem = async () => {
                const res = await fetch(`http://localhost:3000/cham-diem?idDeTai=${+id!}&idHocKy=${idHocKy}&giaiDoan=${gd}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await res.json()
                if (res.ok) setDataOverView(data)
                else toast.error('Lỗi khi lấy dữ liệu', { description: data.message })
            }
            fetchAllDiem()
        }
    }, [overView, idHocKy, gd, id, refresh])


    const onSubmitTemp = async () => {
        if (!selectSV) {
            toast.error("Vui lòng chọn sinh viên để đánh giá")
            return
        }
        const payload = Object.entries(scores).map(([tieuChiId, value]) => ({
            id_tieu_chi: Number(tieuChiId),
            diem: value
        }));
        if (payload.length === 0 || payload.length < count - 1) {
            toast.error("Vui lòng chấm hết điểm")
            return
        }
        setAllScores((prev) => ({
            ...prev,
            [selectSV]: payload
        }))
        toast.success('Đã tạm lưu')
        return;

    }

    const onSubmit = async () => {
        try {
            const svList = deTai.dang_ky
                .filter((dk: any) => dk.trang_thai === "Đã chấp nhận")
                .map((dk: any) => dk.id_sinh_vien);

            // kiểm tra xem đã chấm hết chưa
            for (const idSV of svList) {
                const scores = allScores[idSV];
                if (!scores || scores.length === 0) {
                    toast.error(`Vui lòng chấm điểm cho tất cả sinh viên`);
                    return;
                }
            }
            const payload = Object.entries(allScores).map(([idSV, scoresArr]) => ({
                id_sinh_vien: Number(idSV),
                diem: scoresArr
            }))

            const res = await fetch('http://localhost:3000/cham-diem', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_de_tai: +id!, vai_tro: 'Hội đồng', id_hoc_ky: idHocKy, giai_doan: gd, danh_gia: payload })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Gửi điểm thành công")
            } else {
                toast.error("Lỗi khi gửi điểm", { description: data.message })
            }
        } catch (error) {
            console.error(error)
            toast.warning("Lỗi hệ thống, vui lòng thử lại sau")
        }
    }



    const hoiDong = deTai?.danh_gia?.find((danhGia: any) => danhGia.trang_thai === 'Chưa chấm')?.hoi_dong



    async function updateAll() {
        try {
            const res = await fetch('http://localhost:3000/cham-diem/update-all', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_hoi_dong: hoiDong.id, id_de_tai: deTai.id, id_hoc_ky: idHocKy })
            })
            if (res.ok) toast.success('Đã hoàn thành đánh giá đề tài')
            else {
                const data = await res.json()
                toast.error('Lỗi khi cập nhật điểm chính thức', { description: data.message })
            }
        } catch (error) {
            toast.warning('Lỗi hệ thống vui lòng thử lại sau')
            console.error(error)
        }
    }






    if (!deTai) return <div className="text-center text-3xl">Không tìm thấy đề tài</div>

    if (overView) return (
        <div className="flex flex-col p-5 sm:p-20 gap-10">
            <div className="flex justify-between">
                <Button className="w-[100px] hover:cursor-pointer" variant={'outline'} onClick={() => setOverView(false)}>
                    <IconArrowLeft />Quay lại
                </Button>
                <Button className="w-[100px] hover:cursor-pointer text-blue-500" variant={'outline'} onClick={() => setRefresh(prev => !prev)}>
                    <IconRefresh />Làm mới
                </Button>
            </div>
            <OverViewAllScores data={dataOverView} />
            {hoiDong?.tham_gia.find((item: any) => item.id_giang_vien === user.auth.sub && (item.vai_tro === 'Chủ tịch' || item.vai_tro === 'Thư ký')) && <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={'outline'} className="mx-auto text-green-500">
                            <IconChecks /> Cập nhật điểm chính thưc cho sinh viên và đề tài
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-9/10 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Thao tác này sẽ cập nhật điểm chính thức cho sinh viên</DialogTitle>
                            <DialogDescription>
                                Hãy chắc chắn những người có liên quan đều đã nhập điểm hợp lý
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full flex">
                            <DialogClose asChild className="w-1/2">
                                <Button variant={'destructive'}>
                                    Hủy
                                </Button>
                            </DialogClose>
                            <DialogClose asChild className="w-1/2">
                                <Button className="bg-green-500" onClick={() => updateAll()}>
                                    Xác nhận
                                </Button>
                            </DialogClose>
                        </div>
                        <DialogFooter className="flex flex-row w-full">

                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>}
        </div>
    )

    if (isDone) return (
        <div className="flex flex-col p-5 sm:p-20 gap-10">
            <div className="flex justify-between">
                <Button className="w-[100px] hover:cursor-pointer" variant={'outline'} onClick={() => setDone(false)}>
                    <IconArrowLeft />Quay lại
                </Button>
                <Button className="w-[120px] hover:cursor-pointer" variant={'default'} onClick={() => setOverView(true)}>
                    Tổng hợp điểm
                </Button>
            </div>
            <TomTatDiem bieuMau={bieuMau} deTai={deTai} allScores={allScores} />
            <Button className="w-full bg-green-500" onClick={onSubmit}>Gửi điểm</Button>
        </div>
    )

    return (
        <div className="flex flex-col p-5 gap-3 sm:p-20">
            <div className="text-center font-bold text-3xl mb-10">{bieuMau.ten_mau}</div>
            <div><span className="font-extrabold">GV hội đồng: </span>{user.tai_khoan.ho + " " + user.tai_khoan.ten}</div>
            <div><span className="font-extrabold">MSGV: </span>{user.tai_khoan.giang_vien.msgv}</div>
            <div>
                <span className="font-extrabold">Tên đề tài: </span>
                {deTai.ten_tieng_viet}
            </div>
            <div>
                <span className="font-extrabold">Giai đoạn: </span>
                {deTai.giai_doan}
            </div>
            <div>
                <span className="font-extrabold">Mã đề tài: </span>
                {deTai.ma_de_tai}
            </div>
            <div className="flex items-center gap-2">
                <span className="font-extrabold">Tên sinh viên: </span>
                <Select onValueChange={(value) => setSelectSV(+value)} value={String(selectSV)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn sinh viên" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Danh sách sinh viên</SelectLabel>
                            {deTai.dang_ky.map((dangKy: any) => dangKy.trang_thai === "Đã chấp nhận" && (
                                <SelectItem key={dangKy.id} value={String(dangKy.id_sinh_vien)}>
                                    {dangKy.sinh_vien.tai_khoan.ho + " " + dangKy.sinh_vien.tai_khoan.ten}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <span className="font-extrabold">MSSV: </span>
                {deTai.dang_ky.find((dangKy: any) => dangKy.id_sinh_vien === selectSV)?.sinh_vien.mssv || ".  .  ."}
            </div>

            {bieuMau.nhom_tieu_chi?.length > 0 ? bieuMau.nhom_tieu_chi.map((nhomTieuChi: any, index: number) => {
                return (
                    <div className="mb-5 w-full" key={index}>
                        <div className="w-full flex flex-col rounded-2xl border border-accent-foreground/10 overflow-x-auto">
                            {/* Header nhóm tiêu chí */}
                            <div className="w-full font-bold p-2 py-5 border-accent-foreground/10 border-b-2 bg-yellow-500/50">
                                {toRoman(index + 1) + ". "}
                                {nhomTieuChi.ten_nhom}
                                <p className="text-end italic">Tổng điểm nhóm:
                                    <span className="text-blue-500 not-italic">{
                                        nhomTieuChi.tieu_chi
                                            .filter((tc: any) => tc.loai_diem !== "Điểm chữ") // bỏ tiêu chí "không tính điểm"
                                            .reduce((sum: number, tc: any) => sum + (scores[tc.id] || 0), 0)
                                        || 0}
                                    </span>
                                </p>
                            </div>

                            {nhomTieuChi.tieu_chi?.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-500/50">
                                            <TableHead className="w-3/5 font-extrabold">Câu hỏi</TableHead>
                                            <TableHead className="w-1/5 font-extrabold text-end">Điểm tối đa</TableHead>
                                            <TableHead className="w-1/5 font-extrabold text-end">Điểm nhập</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {nhomTieuChi.tieu_chi.map((tieuChi: any, index0: number) => (
                                            <TableRow key={index0}>
                                                <TableCell className="whitespace-normal break-words max-w-xl">
                                                    <div className="font-medium">
                                                        {count++}. <span className="italic">{tieuChi.ten}</span>
                                                    </div>
                                                    <div className="pl-5 italic text-gray-500 whitespace-pre-line">
                                                        {tieuChi.noi_dung}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-end">
                                                    {tieuChi.diem_toi_da + " điểm"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Input
                                                        className="w-24 ml-auto"
                                                        value={scores[tieuChi.id] ?? ""}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value.trim().toUpperCase();

                                                            // Nếu input rỗng → xóa khỏi scores
                                                            if (rawValue === "") {
                                                                setScores((prevScores) => {
                                                                    const newScores = { ...prevScores };
                                                                    delete newScores[tieuChi.id];
                                                                    return newScores;
                                                                });
                                                                setErrors((prev) => ({ ...prev, [tieuChi.id]: false }));
                                                                return;
                                                            }

                                                            setScores((prevScores) => {
                                                                let newValue: any = rawValue;
                                                                let isValid = true;

                                                                if (tieuChi.loai_diem === "Điểm số") {
                                                                    const num = Number(rawValue);
                                                                    if (isNaN(num)) {
                                                                        isValid = false;
                                                                    } else if (num < 0 || num > Number(tieuChi.diem_toi_da)) {
                                                                        isValid = false;
                                                                    } else {
                                                                        newValue = num;
                                                                    }
                                                                }

                                                                if (tieuChi.loai_diem === "Điểm chữ") {
                                                                    const letterScale = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
                                                                    const maxIndex = letterScale.indexOf(
                                                                        String(tieuChi.diem_toi_da).toUpperCase()
                                                                    );
                                                                    const inputIndex = letterScale.indexOf(rawValue);

                                                                    if (inputIndex === -1 || inputIndex > maxIndex) {
                                                                        isValid = false;
                                                                    } else {
                                                                        newValue = rawValue;
                                                                    }
                                                                }

                                                                if (!isValid) {
                                                                    setErrors((prev) => ({ ...prev, [tieuChi.id]: true }));
                                                                    // ❌ Xóa luôn giá trị cũ khỏi scores
                                                                    const newScores = { ...prevScores };
                                                                    delete newScores[tieuChi.id];
                                                                    return newScores;
                                                                }

                                                                setErrors((prev) => ({ ...prev, [tieuChi.id]: false }));
                                                                return { ...prevScores, [tieuChi.id]: newValue };
                                                            });
                                                        }}
                                                    />
                                                    {errors[tieuChi.id] && (
                                                        <div className="text-red-500">Giá trị không hợp lệ</div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center my-10">Không có câu hỏi!</div>
                            )}
                        </div>
                    </div>)
            }) : <div className="font-bold text-center text-gray-500">Không tìm thấy nhóm tiêu chí nào!</div>}

            <div>
                <div className="font-extrabold mb-2 text-3xl">
                    Tổng điểm:
                    <span className="text-blue-500"> {tongDiem || 0}</span>
                </div>
                <Button className="bg-blue-500 w-full mt-10" onClick={onSubmitTemp}>
                    Lưu tạm
                </Button>
                <Button className="bg-green-500 w-full mt-5" onClick={() => setDone(true)}>
                    Hoàn tất
                </Button>
            </div>
        </div>
    )
}