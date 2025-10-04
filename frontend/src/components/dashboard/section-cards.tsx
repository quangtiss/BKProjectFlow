import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export function SectionCards() {
  const [initialData, setInitialData] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/utils/initial-data', { method: 'GET', credentials: 'include' })
        const data = await response.json()
        if (response.ok) setInitialData(data)
        else toast.error('Lỗi khi lấy dữ liệu đầu', { description: data.message })
      } catch (error) {
        toast.warning('Lỗi hệ thống khi lấy số liệu đầu', { description: 'Vui lòng thử lại sau' })
        console.error(error)
      }
    }
    fetchData()
  }, [])


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold text-xl text-gray-500">Đề tài</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {initialData?.countDeTaiDangLam}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Đề tài hiện tại đang thực hiện
          </div>
          <div className="text-muted-foreground">Thuộc ở cả hai giai đoạn Đồ án chuyên ngành lẫn Đồ án tốt nghiệp</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold text-xl text-gray-500">Giảng viên</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {initialData?.countGiangVien}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Giảng viên của khoa
          </div>
          <div className="text-muted-foreground">
            Tham gia vào quá trình hướng dẫn, đánh giá và chấm điểm các đề tài
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold text-xl text-gray-500">Sinh viên</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {initialData?.countSinhVienKhongLamDetai}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sinh viên chưa tham gia đề tài
          </div>
          <div className="text-muted-foreground">
            Kể cả sinh viên đã từ chối hoặc chưa phản hồi lời mời
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="font-bold text-xl text-gray-500">Còn lại</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {initialData?.countSlotDangKy}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Lượt đăng ký đề tài khả dụng
          </div>
          <div className="text-muted-foreground">Dựa vào số sinh viên đã đăng ký và số sinh viên yêu cầu của đề tài</div>
        </CardFooter>
      </Card>
    </div>
  )
}
