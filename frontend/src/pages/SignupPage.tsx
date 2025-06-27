import { cn } from "@/lib/utils"
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
import { useNavigate } from "react-router-dom";
import { SignUpService } from "@/services/auth/signup"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff, CheckCircle2Icon, AlertCircleIcon, CloudAlert } from "lucide-react"
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

export function SignupPage({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState("")


    const form = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            ten_tai_khoan: "a9",
            mat_khau: "",
            re_mat_khau: "",
            ho: "Nguyễn Văn",
            ten: "A",
            email: "a9@hcmut.edu.vn",
            vai_tro: "Sinh viên",

            //Sinh viên

            mssv: "1234567",
            nam_dao_tao: "2021",
            he_dao_tao: "Chính quy",
            nganh: "Khoa học Máy tính",
            ngon_ngu: "Tiếng Việt",

            //Giảng viên và Giảng viên trưởng bộ môn

            msgv: "1234567",
            to_chuyen_nganh: "Hệ thống thông tin",

            //Giáo vụ

            msnv: "1234567",
            chuc_vu: "Nhân viên thông tin"
        },
    })

    const vaiTro = form.watch("vai_tro");

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
        let filteredData;

        //Xét dữ liệu nào cần cho các vai trò, dữ liệu nào không cần thì không dùng đến
        if (vaiTro === "Sinh viên") {
            const { re_mat_khau, msgv, to_chuyen_nganh, msnv, chuc_vu, ...data } = values;
            filteredData = data
        } else if (vaiTro === "Giáo vụ") {
            const { re_mat_khau, msgv, to_chuyen_nganh, mssv, nam_dao_tao, he_dao_tao, nganh, ngon_ngu, ...data } = values
            filteredData = data
        } else {
            const { re_mat_khau, msnv, chuc_vu, mssv, nam_dao_tao, he_dao_tao, nganh, ngon_ngu, ...data } = values
            filteredData = data
        }
        console.log(filteredData)
        try {
            const response = await SignUpService(filteredData)
            if (response == "Success!") {
                setSuccess("success")
                navigate('/login')
            }
            else {
                setSuccess("fail")
            }
        } catch {
            setSuccess("error")
        }
    }


    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden p-0">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col items-center text-center">
                                            <h1 className="text-2xl font-bold">BKProjectFlow</h1>
                                            <p className="text-muted-foreground text-balance">
                                                Đăng ký tài khoản để sử dụng dịch vụ
                                            </p>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="ho"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="grid gap-3">
                                                            <FormLabel>Họ</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Nguyễn Văn"
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
                                                name="ten"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="grid gap-3">
                                                            <FormLabel>Tên</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="A"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormDescription />
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="grid gap-3">
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="a@hcmut.edu.vn"
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
                                            name="ten_tai_khoan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="grid gap-3">
                                                        <FormLabel>Tên tài khoản</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Nhập tên tài khoản"
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
                                            name="mat_khau"
                                            render={({ field }) => (
                                                <FormItem>
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
                                            control={form.control}
                                            name="re_mat_khau"
                                            render={({ field }) => (
                                                <FormItem>
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
                                        <FormField
                                            control={form.control}
                                            name="vai_tro"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="grid gap-3 w-full">
                                                        <FormLabel>Vai trò</FormLabel>
                                                        <FormControl>
                                                            <Select value={field.value} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Chọn vai trò" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Sinh viên">Sinh viên</SelectItem>
                                                                    <SelectItem value="Giảng viên">Giảng viên</SelectItem>
                                                                    <SelectItem value="Giáo vụ">Giáo vụ</SelectItem>
                                                                    <SelectItem value="Giảng viên trưởng bộ môn">Giảng viên trưởng bộ môn</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormDescription />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />


                                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                                Thông tin quan trọng
                                            </span>
                                        </div>


                                        {
                                            vaiTro === "Sinh viên" &&
                                            <div className="flex flex-col gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="mssv"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Mã số sinh viên</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="MSSV"
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
                                                    name="nam_dao_tao"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Năm đào tạo</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="Năm đào tạo"
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
                                                    name="nganh"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Ngành</FormLabel>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Chọn ngành" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Khoa học Máy tính">Khoa học Máy tính</SelectItem>
                                                                            <SelectItem value="Kĩ thuật Máy tính">Kĩ thuật Máy tính</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />


                                                <FormField
                                                    control={form.control}
                                                    name="he_dao_tao"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Hệ đào tạo</FormLabel>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Chọn hệ đào tạo" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Chính quy">Chính quy</SelectItem>
                                                                            <SelectItem value="Chất lượng cao">Chất lượng cao</SelectItem>
                                                                            <SelectItem value="Việt - Pháp">Việt - Pháp</SelectItem>
                                                                            <SelectItem value="Việt - Nhật">Việt - Nhật</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="ngon_ngu"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Ngôn ngữ</FormLabel>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Chọn ngôn ngữ" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Tiếng Việt">Tiếng Việt</SelectItem>
                                                                            <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                                                            <SelectItem value="Tiếng Pháp">Tiếng Pháp</SelectItem>
                                                                            <SelectItem value="Tiếng Nhật">Tiếng Nhật</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        }
                                        {
                                            vaiTro === "Giáo vụ" &&
                                            <div className="flex flex-col gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="msnv"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Mã số nhân viên</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="MSNV"
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
                                                    name="chuc_vu"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Chức vụ</FormLabel>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Chọn chức vụ" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Nhân viên thông tin">Nhân viên thông tin</SelectItem>
                                                                            <SelectItem value="Nhân viên kiểm soát">Nhân viên kiểm soát</SelectItem>

                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        }
                                        {
                                            (vaiTro === "Giảng viên" || vaiTro === "Giảng viên trưởng bộ môn") &&
                                            <div className="flex flex-col gap-6">
                                                <FormField
                                                    control={form.control}
                                                    name="msgv"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Mã số giảng viên</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="MSGV"
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
                                                    name="to_chuyen_nganh"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="grid gap-3">
                                                                <FormLabel>Tổ chuyên Ngành</FormLabel>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="w-full">
                                                                            <SelectValue placeholder="Chọn tổ chuyên ngành" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Hệ thống thông tin">Hệ thống thông tin</SelectItem>
                                                                            <SelectItem value="Công nghệ phần mềm">Công nghệ phần mềm</SelectItem>
                                                                            <SelectItem value="Hệ thống mạng">Hệ thống mạng</SelectItem>
                                                                            <SelectItem value="Khoa học máy tính">Khoa học máy tính</SelectItem>
                                                                            <SelectItem value="Kĩ thuật máy tính">Kĩ thuật máy tính</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormDescription />
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                        }


                                        <Button type="submit" className="w-full">
                                            Đăng ký
                                        </Button>


                                        <div className="grid grid-cols-1 gap-4">

                                            {success == "success" ?
                                                (
                                                    <Alert className="text-green-400">
                                                        <CheckCircle2Icon />
                                                        <AlertTitle>Đăng ký thành công</AlertTitle>
                                                        <AlertDescription className="text-green-400">
                                                            Đang chuyển hướng, vui lòng chờ ...
                                                        </AlertDescription>
                                                    </Alert>
                                                )
                                                :
                                                success == "fail" ? (
                                                    <Alert variant="destructive">
                                                        <AlertCircleIcon />
                                                        <AlertTitle>Đăng ký thất bại</AlertTitle>
                                                        <AlertDescription>
                                                            <p>Một số trường đã tồn tại</p>
                                                        </AlertDescription>
                                                    </Alert>
                                                )
                                                    :
                                                    success == "error" ? (
                                                        <Alert variant="destructive">
                                                            <CloudAlert />
                                                            <AlertTitle>Lỗi hệ thống</AlertTitle>
                                                            <AlertDescription>
                                                                <p>Vui lòng thử lại sau</p>
                                                            </AlertDescription>
                                                        </Alert>
                                                    )
                                                        : null}

                                        </div>


                                        <div className="text-center text-sm">
                                            Đã có tài khoản?{" "}
                                            <a href="" onClick={(e) => {
                                                e.preventDefault();
                                                navigate('/login')
                                            }} className="underline underline-offset-4">
                                                Đăng nhập
                                            </a>
                                        </div>


                                    </div>
                                </form>
                            </Form>
                            <div className="bg-muted relative hidden md:block">
                                <img
                                    src="/image-login.png"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our <a href="">Terms of Service</a>{" "}
                        and <a href="">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>

    )
}
