import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function FormInsertTaiKhoan() {
    const [role, setRole] = useState("")
    const [file, setFile] = useState<File | null>()

    async function onSubmit() {
        if (!file || !role) {
            toast.warning("Vui lòng chọn file và vai trò trong file")
            return
        }
        // 1. Kiểm tra định dạng file
        const allowedExtensions = [".xls", ".xlsx"];
        const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            toast.warning("Chỉ chấp nhận file Excel (.xls, .xlsx)");
            return;
        }

        // 2. Kiểm tra dung lượng file (< 200MB)
        const maxSize = 200 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.warning("Kích thước file không được vượt quá 1GB");
            return;
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("role", role)

        // fetch tới backend
        const response = fetch('http://localhost:3000/excel/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        toast.promise(response, {
            loading: 'Đang nhập dữ liệu ...',
            success: 'Đã nhập',
            error: 'Đã gặp lỗi'
        })
    }

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
            }}>
                <div className="flex flex-col gap-2 mb-10">
                    <Label>Nhập file</Label>
                    <Input type="file" accept=".xls,.xlsx" required onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0])
                        }
                    }} />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Nhập dữ liệu cho</Label>
                    <Select required value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn vai trò trong dữ liệu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Sinh viên">Sinh viên</SelectItem>
                            <SelectItem value="Giảng viên">Giảng viên</SelectItem>
                            <SelectItem value="Giáo vụ">Giáo vụ</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button className="bg-green-500 w-full mt-10" type="submit">Nhập dữ liệu</Button>
            </form>
        </div>
    )
}