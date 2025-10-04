import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { signUpFormSchema } from "@/validations/signup.schema"
import { toast } from "sonner"
import { useAuth } from "@/routes/auth-context"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChangePasswordSchema } from "@/validations/change-password.schema"

export default function ThongTinTaiKhoan() {
    const { user, refreshContext }: { user: any, refreshContext: any } = useAuth()
    const [showPassword, setShowPassword] = useState(false)



    const form0 = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            mat_khau: "",
            re_mat_khau: ""
        },
    })


    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            sdt: user.tai_khoan.sdt || "",
            cccd: user.tai_khoan.cccd || "",
            ngay_sinh: user.tai_khoan.ngay_sinh ? new Date(user.tai_khoan.ngay_sinh).toISOString().split("T")[0] : "",
            dia_chi: user.tai_khoan.dia_chi || "",
            gioi_tinh: user.tai_khoan.gioi_tinh || "",
        },
    })


    async function onSubmitChange(values: z.infer<typeof ChangePasswordSchema>) {
        try {
            const response = await fetch('http://localhost:3000/auth/change-password', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mat_khau: values.mat_khau })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Đã lưu')
                refreshContext()
            }
            else toast.error('Lỗi khi đổi mật khẩu', { description: data.message })
        } catch (error) {
            toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
            console.error(error)
        }
    }


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
        try {
            const response = await fetch('http://localhost:3000/tai-khoan', {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Đã lưu')
                refreshContext()
            }
            else toast.error('Lỗi khi lưu', { description: data.message })
        } catch (error) {
            toast.warning('Lỗi hệ thống', { description: 'Vui lòng thử lại sau' })
            console.error(error)
        }
    }


    return (
        <div className="p-5">
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div>
                        <div className="flex flex-col mt-10">
                            <div className="flex flex-col items-center text-center mb-5">
                                <h1 className="text-2xl font-bold">BKProjectFlow</h1>
                                <p className="text-muted-foreground text-balance">
                                    Thông tin tài khoản
                                </p>
                            </div>
                            <Dialog>
                                <DialogTrigger>
                                    <div className="text-center text-blue-500 hover:cursor-pointer">
                                        Thay đổi mật khẩu
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-h-9/10 overflow-auto">
                                    <DialogTitle>
                                        Đổi mật khẩu mới an toàn hơn
                                    </DialogTitle>
                                    <DialogDescription />
                                    <div>
                                        <Form {...form0}>
                                            <form onSubmit={form0.handleSubmit(onSubmitChange)}>
                                                <FormField
                                                    control={form0.control}
                                                    name="mat_khau"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-10">
                                                            <div className="grid gap-3 relative">
                                                                <div className="flex items-center">
                                                                    <FormLabel>Mật khẩu</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input className="pr-10" {...field} type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" />
                                                                </FormControl>
                                                                <Button
                                                                    variant={'ghost'}
                                                                    type="button"
                                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                                    className="absolute bottom-3 right-0"
                                                                >
                                                                    {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                </Button>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form0.control}
                                                    name="re_mat_khau"
                                                    render={({ field }) => (
                                                        <FormItem className="mb-5">
                                                            <div className="grid gap-3 relative">
                                                                <div className="flex items-center">
                                                                    <FormLabel>Nhập lại mật khẩu</FormLabel>
                                                                </div>
                                                                <FormControl>
                                                                    <Input className="pr-10" {...field} type={showPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" />
                                                                </FormControl>
                                                                <Button
                                                                    variant={'ghost'}
                                                                    type="button"
                                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                                    className="absolute bottom-3 right-0"
                                                                >
                                                                    {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                                </Button>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <Button type='submit' className="w-full bg-green-500">
                                                    Thay đổi mật khẩu
                                                </Button>
                                            </form>
                                        </Form>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="grid gap-3">
                                            <Label>Họ</Label>
                                            <Input
                                                disabled
                                                value={user.tai_khoan.ho}
                                            />
                                        </div>
                                        <div className="grid gap-3">
                                            <Label>Tên</Label>
                                            <Input
                                                disabled
                                                value={user.tai_khoan.ten}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        <Label>Email</Label>
                                        <Input
                                            disabled
                                            value={user.tai_khoan.email}
                                        />
                                    </div>

                                    <div className="grid gap-3">
                                        <Label>Tên tài khoản</Label>
                                        <Input
                                            disabled
                                            value={user.tai_khoan.ten_tai_khoan}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label>Vai trò</Label>
                                        <Input
                                            disabled
                                            value={user.auth.role}
                                        />
                                    </div>

                                    {
                                        user.auth.role === "Sinh viên" &&
                                        <div className="flex flex-col gap-6">
                                            <div className="grid gap-3">
                                                <Label>Mã số sinh viên</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.sinh_vien.mssv}
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label>Năm đào tạo</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.sinh_vien.nam_dao_tao}
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label>Ngành</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.sinh_vien.nganh}
                                                />
                                            </div>


                                            <div className="grid gap-3">
                                                <Label>Hệ đào tạo</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.sinh_vien.he_dao_tao}
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label>Ngôn ngữ</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.sinh_vien.ngon_ngu}
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        user.auth.role === "Giáo vụ" &&
                                        <div className="flex flex-col gap-6">
                                            <div className="grid gap-3">
                                                <Label>Mã số nhân viên</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.giao_vu.msnv}
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label>Chức vụ</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.giao_vu.chuc_vu}
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        (user.auth.role === "Giảng viên" || user.auth.role === "Giảng viên trưởng bộ môn") &&
                                        <div className="flex flex-col gap-6">
                                            <div className="grid gap-3">
                                                <Label>Mã số giảng viên</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.giang_vien.msgv}
                                                />
                                            </div>

                                            <div className="grid gap-3">
                                                <Label>Tổ chuyên ngành</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.giang_vien.to_chuyen_nganh}
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label>Chức vụ</Label>
                                                <Input
                                                    disabled
                                                    value={user.tai_khoan.giang_vien.is_giang_vien_truong_bo_mon ? "Giảng viên trưởng bộ môn" : "Giảng viên"}
                                                />
                                            </div>
                                        </div>
                                    }


                                    <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                                            Thông tin khác
                                        </span>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="sdt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid gap-3">
                                                    <FormLabel>SĐT</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cccd"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid gap-3">
                                                    <FormLabel>CCCD</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="ngay_sinh"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid gap-3">
                                                    <FormLabel>Ngày sinh</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='date'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dia_chi"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid gap-3">
                                                    <FormLabel>Địa chỉ</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gioi_tinh"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid gap-3">
                                                    <FormLabel>Giới tính</FormLabel>
                                                    <FormControl>
                                                        <Select value={field.value || ""} onValueChange={field.onChange}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Nam">Nam</SelectItem>
                                                                <SelectItem value="Nữ">Nữ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormDescription />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="bg-green-500 w-full">
                                        Lưu thông tin
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/image-login.png"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
