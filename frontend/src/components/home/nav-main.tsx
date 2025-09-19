import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers
} from "@tabler/icons-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/routes/auth-context"
import { Badge } from "@/components/ui/badge"

export function NavMain() {
  const navigate = useNavigate()
  const location = useLocation()
  const { notifications }: { notifications: any } = useAuth()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              onClick={() => navigate('/de-xuat-de-tai')}
            >
              <IconCirclePlusFilled />
              <span>Đề xuất đề tài</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={() => navigate('/other')}
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>


          <SidebarMenuItem key={'Dashboard'} onClick={() => { navigate('/de-tai-cua-toi') }}>
            <SidebarMenuButton tooltip={'Dashboard'}>
              <IconDashboard />
              <div className="flex flex-row justify-between w-full">
                <div>Đề tài của tôi</div>
                {location.pathname !== "/de-tai-cua-toi" && notifications?.de_tai_chua_chap_nhan !== 0 &&
                  <Badge className="bg-red-500 h-5 min-w-5 round-full px-1 text-accent-foreground">
                    {notifications?.de_tai_chua_chap_nhan}
                  </Badge>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Lifecycle'}
            onClick={() => navigate('/duyet-de-tai')}>
            <SidebarMenuButton tooltip={'Lifecycle'}>
              <IconListDetails />
              <div className="flex flex-row justify-between w-full">
                <div>Duyệt đề tài</div>
                {location.pathname !== "/duyet-de-tai" && notifications?.de_tai_chua_duyet !== 0 &&
                  <Badge className="bg-red-500 h-5 min-w-5 round-full px-1 text-accent-foreground">
                    {notifications?.de_tai_chua_duyet}
                  </Badge>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Analytics'} onClick={() => navigate('/hoc-ky')}>
            <SidebarMenuButton tooltip={'Analytics'}>
              <IconChartBar />
              <span>Học kỳ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Projects'} onClick={() => navigate('/bieu-mau')}>
            <SidebarMenuButton tooltip={'Biểu mẫu'}>
              <IconFolder />
              <span>Biểu mẫu</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Team'}>
            <SidebarMenuButton tooltip={'Team'}>
              <IconUsers />
              <span>Team</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
