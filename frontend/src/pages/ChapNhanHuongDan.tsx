"use client";

// import * as React from "react"
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconCircleXFilled
} from "@tabler/icons-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const description = "An interactive area chart";

export function ChapNhanHuongDan() {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = useState("90d");
    const [listDeTaiChuaChapNhan, setListDeTaiChuaChapNhan] = useState([])



    const handleAccept = async (id, trang_thai) => {
        try {
            const response = await fetch(`http://localhost:3000/huong-dan/trang-thai/${id}`, {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    trang_thai
                })
            })
            if (response.ok) {
                setListDeTaiChuaChapNhan(prev =>
                    prev.filter(item => item.id !== id)
                );
            }
            else {
                console.log(await response.json())
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (isMobile) {
            setTimeRange("7d");
        }

        const fetchListDeTaiChuaChapNhan = async () => {
            try {
                const response = await fetch("http://localhost:3000/huong-dan/giang-vien?trang_thai=Chưa chấp nhận", {
                    method: "GET",
                    credentials: 'include'
                })
                const data = await response.json()
                console.log(data)
                setListDeTaiChuaChapNhan(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchListDeTaiChuaChapNhan()
    }, [isMobile]);

    return (
        <div className="p-3"><Card className="@container/card">
            <CardHeader>
                <CardTitle>Chấp nhận hướng dẫn đề tài do sinh viên đề xuất</CardTitle>
                <CardAction>
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
                    >
                        <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                        <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                        <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                            size="sm"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">


                {listDeTaiChuaChapNhan.map((huongDan) => {
                    const date = new Date(huongDan.de_tai.ngay_tao).toLocaleString()
                    return <div key={huongDan.id} className="mb-10">
                        <Card>
                            <CardHeader>
                                <CardTitle>{huongDan.de_tai.ma_de_tai + " - " + huongDan.de_tai.ten_tieng_viet}</CardTitle>
                                <CardDescription>
                                    {huongDan.de_tai.ten_tieng_anh}
                                </CardDescription>
                                <CardAction className="flex flex-row items-center -mr-5">
                                    <Button variant={"outline"} onClick={() => handleAccept(huongDan.id, "Đã từ chối")}>
                                        Từ chối <IconCircleXFilled className="text-red-400" />
                                    </Button>
                                    <Button variant={"outline"} className="mx-5" onClick={() => handleAccept(huongDan.id, "Đã chấp nhận")}>
                                        Chấp nhận <IconCircleCheckFilled className="text-green-400" />
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>Thông tin</AccordionTrigger>
                                        <AccordionContent className="px-4">
                                            <p className="mb-2">
                                                <span className="font-bold">Tên tiếng việt:</span>{" "}
                                                {huongDan.de_tai.ten_tieng_viet}
                                            </p>
                                            <p className="mb-2">
                                                <span className="font-bold">Tên tiếng anh:</span>{" "}
                                                {huongDan.de_tai.ten_tieng_anh}
                                            </p>
                                            <p className="mb-2">
                                                <span className="font-bold">Mã đề tài:</span>{" "}
                                                {huongDan.de_tai.ma_de_tai}
                                            </p>
                                            <p className="mb-2">
                                                <span className="font-bold">Mô tả:</span>{" "}
                                                {huongDan.de_tai.mo_ta}
                                            </p>
                                            <p className="mb-2">
                                                <span className="font-bold">Số lượng sinh viên yêu cầu:</span>{" "}
                                                {huongDan.de_tai.so_luong_sinh_vien}
                                            </p>
                                            <p className="mb-2">
                                                <span className="font-bold">Nhóm ngành:</span>{" "}
                                                {huongDan.de_tai.nhom_nganh}
                                            </p>
                                            <p className="mb-2">
                                                <span className="font-bold">Hệ đào tạo:</span>{" "}
                                                {huongDan.de_tai.he_dao_tao}
                                            </p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>Người đề xuất</AccordionTrigger>
                                        <AccordionContent className="px-4">
                                            <p>{huongDan.de_tai.tai_khoan.vai_tro}: {huongDan.de_tai.tai_khoan.giang_vien?.msgv ||
                                                huongDan.de_tai.tai_khoan.giao_vu?.msnv ||
                                                huongDan.de_tai.tai_khoan.sinh_vien?.mssv ||
                                                huongDan.de_tai.tai_khoan.giang_vien_truong_bo_mon?.msgv}
                                                - {huongDan.de_tai.tai_khoan.ho + " " + huongDan.de_tai.tai_khoan.ten}</p>
                                            <p className="italic">{huongDan.de_tai.tai_khoan.email}</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Ngày tạo</AccordionTrigger>
                                        <AccordionContent className="px-4">
                                            {date}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                })}



            </CardContent>

            {/* ----------Footer------------ */}
            <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex"></div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                // value={`${table.getState().pagination.pageSize}`}
                                value={"5"}
                            // onValueChange={(value) => {
                            //   table.setPageSize(Number(value))
                            // }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                    // placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[5, 10].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            {/* Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()} */}
                            Page A of B
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                            // onClick={() => table.setPageIndex(0)}
                            // disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                            // onClick={() => table.previousPage()}
                            // disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                            // onClick={() => table.nextPage()}
                            // disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                            // onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            // disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* ---------End Footer---------- */}
        </Card></div>
    );
}
