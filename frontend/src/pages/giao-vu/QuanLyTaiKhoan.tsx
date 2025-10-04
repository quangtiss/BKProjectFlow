import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import FormInsertTaiKhoan from "./FormInsertTaiKhoan";

export default function QuanLyTaiKhoan() {
    const [toggle, setToggle] = useState(false)
    const [data, setData] = useState([])
    const [tab, setTab] = useState("sinh-vien")
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const totalPages = Math.ceil(data.length / perPage)

    const pageData = useMemo(() => {
        const start = (currentPage - 1) * perPage
        return data.slice(start, start + perPage)
    }, [data, currentPage, perPage])

    const formatString = (str: string) => {
        switch (str) {
            case 'Khoa học Máy tính':
                return 'KH'
                break;

            case 'Kỹ thuật Máy tính':
                return 'KT'
                break;

            case 'Chính quy':
                return 'CQ'
                break;

            case 'Văn bằng 2':
                return 'B2'
                break;

            case 'Song ngành':
                return 'SN'
                break;

            case 'Vừa làm vừa học':
                return 'VLVH'
                break;

            case 'Đào tạo từ xa':
                return 'TX'
                break;

            case 'Chất lượng cao tăng cường tiếng Nhật':
                return 'CN'
                break;

            case 'Chất lượng cao':
                return 'CC'
                break;

            case 'Tiếng Việt':
                return 'VN'
                break;

            case 'Tiếng Anh':
                return 'EN'
                break;

            case 'Hệ thống thông tin':
                return 'HTTT'
                break;

            case 'Hệ thống và mạng máy tính':
                return 'HT&MMT'
                break;

            case 'Công nghệ phần mềm':
                return 'CNPM'
                break;

            case 'Khoa học máy tính':
                return 'KHMT'
                break;

            case 'Kỹ thuật máy tính':
                return 'KTMT'
                break;


            default:
                return null
                break;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/' + tab, { method: 'GET', credentials: 'include' })
                const data = await response.json()
                if (response.ok) setData(data)
                else toast.error('Lỗi khi lấy dữ liệu ban đầu', { description: data.message })
            } catch (error) {
                toast.warning('Lỗi khi lấy hệ thống', { description: 'Vui lòng thử lại sau' })
                console.error(error)
            }
        }
        fetchData()
    }, [tab, toggle])


    return (
        <div className="p-2">
            <Tabs defaultValue="sinh-vien" onValueChange={value => { setTab(value) }}>
                <TabsList className="mx-auto" >
                    <TabsTrigger value="sinh-vien">Sinh viên</TabsTrigger>
                    <TabsTrigger value="giang-vien">Giảng viên</TabsTrigger>
                    <TabsTrigger value="giao-vu">Giáo vụ</TabsTrigger>
                </TabsList>


                <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                    <DialogTrigger className="ml-auto" asChild>
                        <Button>
                            Thêm tài khoản
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-9/10 overflow-y-auto">
                        <DialogTitle>Thêm tài khoản</DialogTitle>
                        <DialogDescription />
                        <FormInsertTaiKhoan />
                    </DialogContent>
                </Dialog>
                {/* ----------Footer------------ */}
                <div className="relative flex flex-col gap-4 overflow-auto my-5">
                    <div className="flex items-center justify-between px-4">
                        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex"></div>
                        <div className="flex w-full items-center gap-8 lg:w-fit">
                            <div className="hidden items-center gap-2 lg:flex">
                                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                    Hiển thị mỗi trang
                                </Label>
                                <Select
                                    value={perPage.toString()}
                                    onValueChange={(val) => {
                                        setPerPage(Number(val))
                                        setCurrentPage(1)
                                    }}
                                >
                                    <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent side="top">
                                        {[20, 50, 100].map((pageSize) => (
                                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                                {pageSize}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex w-fit items-center justify-center text-sm font-medium">
                                Trang {currentPage} trên {totalPages}
                            </div>
                            <div className="ml-auto flex items-center gap-2 lg:ml-0">
                                <Button
                                    variant="outline"
                                    className="hidden h-8 w-8 p-0 lg:flex"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(1)}
                                >
                                    <span className="sr-only">Go to first page</span>
                                    <IconChevronsLeft />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                >
                                    <span className="sr-only">Go to previous page</span>
                                    <IconChevronLeft />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="size-8"
                                    size="icon"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    <span className="sr-only">Go to next page</span>
                                    <IconChevronRight />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="hidden size-8 lg:flex"
                                    size="icon"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(totalPages)}
                                >
                                    <span className="sr-only">Go to last page</span>
                                    <IconChevronsRight />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* ---------End Footer---------- */}
                <TabsContent value="sinh-vien" className="border-5 border-gray-500/50 rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-500/50">
                                <TableHead>STT</TableHead>
                                <TableHead>MSSV</TableHead>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Tài khoản</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Ngành</TableHead>
                                <TableHead>Năm đào tạo</TableHead>
                                <TableHead>Hệ đào tạo</TableHead>
                                <TableHead>Ngôn ngữ</TableHead>
                                <TableHead>SĐT</TableHead>
                                <TableHead>CCCD</TableHead>
                                <TableHead>Ngày sinh</TableHead>
                                <TableHead>Địa chỉ</TableHead>
                                <TableHead>Giới tính</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData.map((sv: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{sv.mssv}</TableCell>
                                    <TableCell>{`${sv.tai_khoan.ho} ${sv.tai_khoan.ten}`}</TableCell>
                                    <TableCell>{sv.tai_khoan.ten_tai_khoan}</TableCell>
                                    <TableCell>{sv.tai_khoan.email}</TableCell>
                                    <TableCell>{formatString(sv.nganh)}</TableCell>
                                    <TableCell>{sv.nam_dao_tao}</TableCell>
                                    <TableCell>{formatString(sv.he_dao_tao)}</TableCell>
                                    <TableCell>{formatString(sv.ngon_ngu)}</TableCell>
                                    <TableCell>{sv.tai_khoan.sdt}</TableCell>
                                    <TableCell>{sv.tai_khoan.cccd}</TableCell>
                                    <TableCell>{sv.tai_khoan.ngay_sinh && new Date(sv.tai_khoan.ngay_sinh).toDateString()}</TableCell>
                                    <TableCell>{sv.tai_khoan.dia_chi}</TableCell>
                                    <TableCell>{sv.tai_khoan.gioi_tinh}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="giang-vien" className="border-5 border-gray-500/50 rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-500/50">
                                <TableHead>STT</TableHead>
                                <TableHead>MSGV</TableHead>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Tài khoản</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tổ</TableHead>
                                <TableHead>Giảng viên trưởng</TableHead>
                                <TableHead>SĐT</TableHead>
                                <TableHead>CCCD</TableHead>
                                <TableHead>Ngày sinh</TableHead>
                                <TableHead>Địa chỉ</TableHead>
                                <TableHead>Giới tính</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData.map((gv: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{gv.msgv}</TableCell>
                                    <TableCell>{`${gv.tai_khoan.ho} ${gv.tai_khoan.ten}`}</TableCell>
                                    <TableCell>{gv.tai_khoan.ten_tai_khoan}</TableCell>
                                    <TableCell>{gv.tai_khoan.email}</TableCell>
                                    <TableCell>{formatString(gv.to_chuyen_nganh)}</TableCell>
                                    <TableCell>{gv.is_giang_vien_truong_bo_mon && <IconCircleCheckFilled className="text-green-500" />}</TableCell>
                                    <TableCell>{gv.tai_khoan.sdt}</TableCell>
                                    <TableCell>{gv.tai_khoan.cccd}</TableCell>
                                    <TableCell>{gv.tai_khoan.ngay_sinh && new Date(gv.tai_khoan.ngay_sinh).toDateString()}</TableCell>
                                    <TableCell>{gv.tai_khoan.dia_chi}</TableCell>
                                    <TableCell>{gv.tai_khoan.gioi_tinh}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                <TabsContent value="giao-vu" className="border-5 border-gray-500/50 rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-500/50">
                                <TableHead>STT</TableHead>
                                <TableHead>MSGV</TableHead>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Tài khoản</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Chức vụ</TableHead>
                                <TableHead>SĐT</TableHead>
                                <TableHead>CCCD</TableHead>
                                <TableHead>Ngày sinh</TableHead>
                                <TableHead>Địa chỉ</TableHead>
                                <TableHead>Giới tính</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData.map((nv: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{nv.msnv}</TableCell>
                                    <TableCell>{`${nv.tai_khoan.ho} ${nv.tai_khoan.ten}`}</TableCell>
                                    <TableCell>{nv.tai_khoan.ten_tai_khoan}</TableCell>
                                    <TableCell>{nv.tai_khoan.email}</TableCell>
                                    <TableCell>{nv.chuc_vu}</TableCell>
                                    <TableCell>{nv.tai_khoan.sdt}</TableCell>
                                    <TableCell>{nv.tai_khoan.cccd}</TableCell>
                                    <TableCell>{nv.tai_khoan.ngay_sinh && new Date(nv.tai_khoan.ngay_sinh).toDateString()}</TableCell>
                                    <TableCell>{nv.tai_khoan.dia_chi}</TableCell>
                                    <TableCell>{nv.tai_khoan.gioi_tinh}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    )
}