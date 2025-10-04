import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, UserSearch, X } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { getAllGiangVien } from '@/services/giang_vien/get_all_giang_vien';
import { toast } from 'sonner';


export default function TeacherMultiSelect({ deTai }: { deTai: object }) {
    const [listGiangVien, setListGiangVien] = useState<Array<object>>([])
    const [selectedGiangVien, setSelectedGiangVien] = useState([])
    const [selectGiangVien, setSelectGiangVien] = useState<Array<object>>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const allGiangVien = await getAllGiangVien()
            setListGiangVien(allGiangVien)
        }
        fetchData()
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/huong-dan/de-tai/${deTai.id}`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            setSelectedGiangVien(data)
        }
        fetchData()
    }, [toggle])


    const handleSelectGiangVien = (giangVien: object) => {
        if (selectGiangVien.some((gv) => gv.id_tai_khoan === giangVien.id_tai_khoan)) handleRemoveGiangVien(giangVien)
        else setSelectGiangVien((prev) => [...prev, giangVien])
    }

    const handleRemoveGiangVien = (giangVien: object) => {
        setSelectGiangVien(prev => prev.filter(gv => gv.id_tai_khoan !== giangVien.id_tai_khoan))
    }

    const postfix = (toChuyenNganh: string) => {
        return toChuyenNganh === "Hệ thống thông tin" ? "HTTT" :
            toChuyenNganh === "Hệ thống và mạng máy tính" ? "HT&MMT" :
                toChuyenNganh === "Công nghệ phần mềm" ? "CNPM" :
                    toChuyenNganh === "Khoa học máy tính" ? "KHMT" :
                        "KTMT"
    }

    const filterGiangVien = listGiangVien.filter((giangVien) => {
        const keyword = giangVien.msgv + " - " + giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten
        return searchTerm !== "" ? keyword.includes(searchTerm) : true;
    })


    const handleSubmit = async () => {
        const result = selectGiangVien.map(gv => gv.id_tai_khoan);

        try {
            await Promise.all(
                result.map(async (idTaiKhoanGiangVien) => {
                    const response = await fetch('http://localhost:3000/huong-dan', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            vai_tro: 'Giảng viên hướng dẫn phụ',
                            trang_thai: 'Chưa chấp nhận',
                            id_giang_vien: idTaiKhoanGiangVien,
                            id_de_tai: deTai.id,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Lỗi gửi lời mời cho ID ${idTaiKhoanGiangVien}`);
                    }

                    return response.json(); // Nếu muốn dùng kết quả sau này
                })
            );

            // ✅ Nếu đến đây là tất cả thành công
            toast.success('Gửi tất cả lời mời thành công');

        } catch (error) {
            // ❌ Nếu có ít nhất 1 lỗi xảy ra trong Promise.all
            toast.error('Gửi lời mời thất bại', { description: 'Có thể có một số lời mời không được gửi' });
            console.error('Có lỗi khi submit:', error);
        }
        setToggle(prev => !prev)
        setSelectGiangVien([])
    };



    return (
        <div className="w-full">
            <Dialog>
                <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-12 border-2 rounded-xl p-2">
                        {selectGiangVien.length === 0 ? (
                            <span className="text-muted-foreground">Chưa có giảng viên nào được chọn</span>
                        ) : (
                            selectGiangVien.map((giangVien) => (
                                <Badge
                                    key={giangVien.id_tai_khoan}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {giangVien.msgv} - {giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten} ({postfix(giangVien.to_chuyen_nganh)})
                                    <button
                                        type='button'
                                        className="ml-1 rounded-sm p-0.5 hover:text-red-500 focus:outline-none"
                                        onClick={() => handleRemoveGiangVien(giangVien)}
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))
                        )}
                    </div>

                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Chọn giảng viên</Button>
                    </DialogTrigger>
                    <Button className='w-full' onClick={() => handleSubmit()}>Gửi lời mời</Button>
                </div>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Chọn giảng viên</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-2 mb-2">
                        <UserSearch className="w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo giảng viên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.trim())}
                        />
                    </div>

                    <ScrollArea className="max-h-100 border rounded-md px-2 pb-2 space-y-2">
                        {filterGiangVien.length === 0 && searchTerm !== "" ? (
                            <div className="text-sm text-muted-foreground">
                                Không tìm thấy giảng viên phù hợp.
                            </div>
                        ) : (
                            filterGiangVien.map((giangVien) => {
                                const select = selectGiangVien.some(gv => gv.id_tai_khoan === giangVien.id_tai_khoan);
                                const selected = selectedGiangVien.some(huongDan => huongDan.id_giang_vien === giangVien.id_tai_khoan)
                                const status = selected ? selectedGiangVien.find(huongDan => huongDan.id_giang_vien === giangVien.id_tai_khoan)?.trang_thai : null;
                                const color = status === 'Đã chấp nhận' ? "bg-green-500" :
                                    status === 'Đã từ chối' ? "bg-red-500" : "";
                                return (
                                    <div
                                        key={giangVien.id_tai_khoan}
                                        className={`p-2 mt-2 border rounded-md cursor-pointer flex justify-between items-center hover:bg-muted transition ${(select || selected) ? 'bg-muted' : ''}`}
                                        onClick={() => !selected ? handleSelectGiangVien(giangVien) : null}
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {giangVien.msgv} - {giangVien.tai_khoan.ho + " " + giangVien.tai_khoan.ten + "  "}
                                                {selected && (<Badge className={color}>
                                                    {status}
                                                </Badge>)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {giangVien.to_chuyen_nganh}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {giangVien.tai_khoan.email}
                                            </div>
                                        </div>
                                        {select && <Check className="text-green-500 w-4 h-4" />}
                                    </div>
                                );
                            })
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}