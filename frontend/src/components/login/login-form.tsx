import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/routes/auth-context"
import { LogInService } from "@/services/auth/login"
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
import { logInFormSchema } from "@/validations/login.schema"



export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { isAuthenticated, refreshContext } = useAuth(); // Set biến xem đã đăng nhập chưa// Set biến xem role là gì
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState("")

  const form = useForm<z.infer<typeof logInFormSchema>>({
    resolver: zodResolver(logInFormSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  const [pendingRedirect, setPendingRedirect] = useState(false);

  useEffect(() => {
    if (pendingRedirect && isAuthenticated) {
      navigate("/");
    }
  }, [pendingRedirect, isAuthenticated]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof logInFormSchema>) {
    const response = await LogInService(values.username, values.password)
    setSuccess(response)
    if (response == "Success!") {
      setPendingRedirect(true);
      refreshContext();
    }
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">BKProjectFlow</h1>
                  <p className="text-muted-foreground text-balance">
                    Đăng nhập bằng tài khoản của bạn
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="username"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-3 relative">
                        <div className="flex items-center">
                          <FormLabel>Mật khẩu</FormLabel>
                          <a
                            href=""
                            className="ml-auto text-sm underline-offset-2 hover:underline"
                          >
                            Quên mật khẩu?
                          </a>
                        </div>
                        <FormControl>
                          <Input {...field} type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" />
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
                <Button type="submit" className="w-full">
                  Đăng nhập
                </Button>


                <div className="grid grid-cols-1 gap-4">

                  {success == "Success!" ?
                    (
                      <Alert className="text-green-500">
                        <CheckCircle2Icon />
                        <AlertTitle>Đăng nhập thành công</AlertTitle>
                        <AlertDescription className="text-green-500">
                          Đang chuyển hướng, vui lòng chờ ...
                        </AlertDescription>
                      </Alert>
                    )
                    :
                    success == "Fail!" ? (
                      <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Đăng nhập thất bại</AlertTitle>
                        <AlertDescription>
                          <p>Tên tài khoản hoặc mật khẩu không khớp</p>
                        </AlertDescription>
                      </Alert>
                    )
                      :
                      success == "Error!" ? (
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
  )
}
