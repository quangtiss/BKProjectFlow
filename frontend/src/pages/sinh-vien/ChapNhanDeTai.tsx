import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";



export function ChapNhanDeTai() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [listDangKy, setListDangKy] = useState([])

    const handleToggleExpand = (id: number) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const handleAccept = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/dang-ky/trang-thai/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trang_thai: "Đã chấp nhận"
                })
            })
            if (response.ok) {
                setListDangKy(listDangKy.filter(item => item.id !== id))
            }
        } catch (error) {
            console.error(error)
        }
    };

    const handleReject = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/dang-ky/trang-thai/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trang_thai: "Đã từ chối"
                })
            })
            if (response.ok) {
                setListDangKy(listDangKy.filter(item => item.id !== id))
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        const fetchListDangKy = async () => {
            try {
                const response = await fetch("http://localhost:3000/dang-ky/sinh-vien?trang_thai=Chưa chấp nhận", {
                    method: 'GET',
                    credentials: 'include'
                })
                const data = await response.json()
                setListDangKy(data)
            } catch (error) {
                console.log("Error ", error)
            }
        }
        fetchListDangKy();
    }, [])


    return (
        <div className="grid grid-cols-1 gap-6 p-6 bg-background">
            {listDangKy.map((dangKy) => {
                const isExpanded = expandedId === dangKy.id;
                return (
                    <Card
                        key={dangKy.id}
                        onClick={() => handleToggleExpand(dangKy.id)}
                        className={`rounded-2xl border border-border shadow-lg dark:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden "}`}
                        style={{ minHeight: "200px" }}
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold leading-snug">{dangKy.de_tai.ma_de_tai + " - " + dangKy.de_tai.ten_tieng_viet}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{dangKy.de_tai.ten_tieng_anh}</p>
                                </div>
                                <Badge variant="outline" className="text-xs h-6 px-3 mt-1">
                                    <IconLoader />
                                    Chưa chấp nhận
                                </Badge>
                            </div>
                            <div
                                className={`transition-all duration-300 overflow-hidden ${isExpanded ? "h-auto opacity-100 mt-4" : "max-h-0 opacity-0"
                                    } text-sm text-foreground`}
                            >
                                <p className="mb-2">
                                    <span className="font-bold">Tên tiếng việt:</span>{" "}
                                    {dangKy.de_tai.ten_tieng_viet}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Tên tiếng anh:</span>{" "}
                                    {dangKy.de_tai.ten_tieng_anh}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Mã đề tài:</span>{" "}
                                    {dangKy.de_tai.ma_de_tai}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Học kì:</span>{" "}
                                    241-243{" (Test)"}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Hệ đào tạo:</span>{" "}
                                    {dangKy.de_tai.he_dao_tao}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Nhóm ngành:</span>{" "}
                                    {dangKy.de_tai.nhom_nganh}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Số lượng sinh viên yêu cầu:</span>{" "}
                                    {dangKy.de_tai.so_luong_sinh_vien}
                                </p>
                                <p className="mb-2">
                                    <span className="font-bold">Mô tả:</span>{" "}
                                    {dangKy.de_tai.mo_ta}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 px-6 pb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-destructive text-destructive active:text-secondary "
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(dangKy.id);
                                }}
                            >
                                <X className="w-4 h-4 mr-1" /> Từ chối
                            </Button>
                            <Button
                                size="sm"
                                className="rounded-xl bg-primary text-primary-foreground active:bg-secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAccept(dangKy.id);
                                }}
                            >
                                <Check className="w-4 h-4 mr-1" /> Chấp nhận
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}