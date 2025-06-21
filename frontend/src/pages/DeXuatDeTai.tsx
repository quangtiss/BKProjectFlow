import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function DeXuatDeTai({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <a
                                    href="#"
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex size-8 items-center justify-center rounded-md">
                                        <GalleryVerticalEnd className="size-6" />
                                    </div>
                                    <span className="sr-only">Acme Inc.</span>
                                </a>
                                <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?
                                </div>
                            </div>
                            <div className="flex flex-col gap-6">


                                <div className="grid gap-3">
                                    <Label htmlFor="nameVN">Tên đề tài</Label>
                                    <Input id="nameVN" placeholder="Nhập tên tiếng việt" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="nameEN">Project name</Label>
                                    <Input id="nameEN" placeholder="Enter project name" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="projectId">Mã đề tài {'('}Tùy chọn{')'}</Label>
                                    <Input id="projectId" placeholder="Tùy chọn nhập mã đề tài" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Textarea id="description" placeholder="Mô tả đề tài" />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn nhóm ngành" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="KH">KH - Khoa học máy tính</SelectItem>
                                            <SelectItem value="KT">KT - Kĩ thuật máy tính</SelectItem>
                                            <SelectItem value="DN">DN - Đa ngành</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn hệ đào tạo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CQ">Chính quy</SelectItem>
                                            <SelectItem value="EN">Quốc tế</SelectItem>
                                            <SelectItem value="FR">Việt - Pháp</SelectItem>
                                            <SelectItem value="JP">Việt - Nhật</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input className="w-full" type="number" placeholder="Số lượng" />
                                </div>
                                <div className="grid gap-3">
                                    <Select>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn giảng viên hướng dẫn" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">MT1 - Nguyễn Trần Khánh</SelectItem>
                                            <SelectItem value="2">MT2 - Kim Nhật Nam</SelectItem>
                                            <SelectItem value="3">MT3 - Phạm Hồng Hà</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>



                                <Button type="submit" className="w-full">
                                    Gửi đề xuất
                                </Button>
                            </div>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-background text-muted-foreground relative z-10 px-2">
                                    Or
                                </span>
                            </div>
                        </div>
                    </form>
                    <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our{" "}
                        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}
