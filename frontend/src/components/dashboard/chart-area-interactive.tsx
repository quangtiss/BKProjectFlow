import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
// import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
} from "@tabler/icons-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// import {
//   ToggleGroup,
//   ToggleGroupItem,
// } from "@/components/ui/toggle-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import { useAuth } from "@/routes/auth-context"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus } from "lucide-react"
import { getCurrentAndNextHocKy } from "@/services/getCurrentNextHocKy"
import FormLichTrinh from "@/pages/giao-vu/FormLichTrinh"

export const description = "An interactive area chart"

export function ChartAreaInteractive() {
  const { user }: { user: any } = useAuth()
  const isGiaoVu = user.auth.role === 'Giáo vụ'
  const [data, setData] = useState([])
  const [idCurrentHocKy, setIdCurrentHocKy] = useState(0)
  const [toggle, setToggle] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(5)
  const totalPages = Math.ceil(data.length / perPage)

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * perPage
    return data.slice(start, start + perPage)
  }, [data, currentPage, perPage])

  // const isMobile = useIsMobile()
  // const [timeRange, setTimeRange] = useState("90d")

  useEffect(() => {
    // if (isMobile) {
    //   setTimeRange("7d")
    // }
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          fetch('http://localhost:3000/lich-trinh/hoc-ky-now', {
            method: 'GET',
            credentials: 'include'
          }),
          fetch('http://localhost:3000/hoc-ky', {
            method: 'GET',
            credentials: 'include'
          })
        ]);
        const [data1, data2] = await Promise.all([response1.json(), response2.json()])
        const now = new Date().getTime()

        if (response1.ok) setData(data1.sort((a: any, b: any) => {
          const time = (item: any) => new Date(item).getTime()
          return Math.abs(time(a.ngay_ket_thuc) - now) - Math.abs(time(b.ngay_ket_thuc) - now) || a.id - b.id
        }))
        else toast.error('Lỗi không thể lấy dữ liệu lịch trình', { description: data1.message })


        if (response2.ok) setIdCurrentHocKy(getCurrentAndNextHocKy(data2).current?.id || 0)
        else toast.error('Lỗi không thể lấy dữ liệu học kỳ', { description: data2.message })
      } catch (error) {
        toast.warning('Lỗi hệ thống khi lấy dữ liệu', { description: 'Vui lòng thử lại sau' })
        console.error(error)
      }
    }
    fetchData()
  }, [toggle])

  function formatDateRange(from: Date, to: Date) {
    return `${from.toLocaleString()} → ${to.toLocaleString()}`;
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-bold text-2xl text-gray-500">Lịch trình trong kỳ</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {/* Total for the last 3 months */}
          </span>
          <span className="@[540px]/card:hidden">
            {/* Last 3 months */}
          </span>
        </CardDescription>
        <CardAction>
          {isGiaoVu &&
            <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
              <DialogTrigger asChild>
                <Button variant={"secondary"} className="flex justify-end">
                  <Plus className="rounded-2xl bg-accent-foreground text-accent" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-9/10 overflow-y-auto">
                <DialogTitle>Thêm lịch trình</DialogTitle>
                <DialogDescription />
                <FormLichTrinh type="create" idHocKy={idCurrentHocKy} />
              </DialogContent>
            </Dialog>}
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">


        {/* {pageData?.length > 0 ? pageData.map((lichTrinh: any) => <div key={lichTrinh.id} className="mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{lichTrinh.ten}</CardTitle>
              {isGiaoVu && lichTrinh.id_nguoi_them === user.auth.sub && <CardAction>
                <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle(prev => !prev) }}>
                  <DialogTrigger asChild>
                    <Button variant={'outline'} onClick={() => { }
                    }>
                      <IconEdit />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-9/10 overflow-y-auto">
                    <DialogTitle>Thêm lịch trình</DialogTitle>
                    <DialogDescription />
                    <FormLichTrinh type="edit" lichTrinh={lichTrinh} />
                  </DialogContent>
                </Dialog>
              </CardAction>}
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Chi tiết</AccordionTrigger>
                  <AccordionContent className="text-sm text-gray-500  whitespace-pre-line">
                    {lichTrinh.hoat_dong}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Thông tin</AccordionTrigger>
                  <AccordionContent className="text-gray-500">
                    <div>{lichTrinh.giao_vu.tai_khoan.ho + " " + lichTrinh.giao_vu.tai_khoan.ten}</div>
                    <div>{lichTrinh.giao_vu.msnv}</div>
                    <div className="italic">thêm vào: {lichTrinh.created_at}</div>
                    {lichTrinh.updated_at && <div className="italic text-gray-500">sửa vào: {lichTrinh.updated_at}</div>}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex items-center gap-2 text-sm text-gray-500 italic">
              <div>{new Date(lichTrinh.ngay_bat_dau).toLocaleString()}</div>
              <div>→</div>
              <div>{new Date(lichTrinh.ngay_ket_thuc).toLocaleString()}</div>
            </CardFooter>
          </Card>
        </div>) : <div className="text-center text-sm">Không có lịch trình.</div>} */}
        <div className="flex w-full flex-col gap-3">
          {pageData?.length > 0 ? (
            pageData.map((lichTrinh: any) => (
              <div
                key={lichTrinh.id}
                className="bg-accent-foreground/10 relative rounded-md p-3 pl-6 text-sm after:absolute after:inset-y-3 after:left-2 after:w-1 after:rounded-full after:bg-primary/90"
              >
                <div className="flex justify-between items-center">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        <div className="font-medium text-base">{lichTrinh.ten}</div>
                      </AccordionTrigger>
                      <AccordionContent className="whitespace-pre-line">
                        <div className="mt-2 text-sm whitespace-pre-line">
                          {lichTrinh.hoat_dong}
                        </div>

                        <div className="mt-10 text-xs space-y-1 text-gray-400">
                          <div className="">{lichTrinh.giao_vu.tai_khoan.ho + " " + lichTrinh.giao_vu.tai_khoan.ten}</div>
                          <div>{lichTrinh.giao_vu.msnv}</div>
                          <div className="italic">Thêm vào: {new Date(lichTrinh.created_at).toLocaleString()}</div>
                          {lichTrinh.updated_at && (
                            <div className="italic">Sửa vào: {new Date(lichTrinh.updated_at).toLocaleString()}</div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {isGiaoVu && lichTrinh.id_nguoi_them === user.auth.sub && (
                    <Dialog onOpenChange={(isOpen) => { if (!isOpen) setToggle((prev: boolean) => !prev); }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <IconEdit size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogTitle>Chỉnh sửa lịch trình</DialogTitle>
                        <DialogDescription />
                        <FormLichTrinh type="edit" lichTrinh={lichTrinh} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  {formatDateRange(new Date(lichTrinh.ngay_bat_dau), new Date(lichTrinh.ngay_ket_thuc))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-500">Không có lịch trình.</div>
          )}
        </div>

      </CardContent>

      {/* ----------Footer------------ */}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
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
                  {[5, 10].map((pageSize) => (
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
    </Card>
  )
}
