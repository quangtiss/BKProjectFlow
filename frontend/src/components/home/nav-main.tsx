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
import { useNavigate } from "react-router-dom"

export function NavMain() {
  const navigate = useNavigate()
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

          <SidebarMenuItem key={'Dashboard'} onClick={() => { navigate('/chap-nhan-huong-dan') }}>
            <SidebarMenuButton tooltip={'Dashboard'}>
              <IconDashboard />
              <span>Hướng dẫn đề tài</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Lifecycle'}
            onClick={() => navigate('/duyet-de-tai')}>
            <SidebarMenuButton tooltip={'Lifecycle'}>
              <IconListDetails />
              <span>Duyệt đề tài</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Analytics'} onClick={() => navigate('/hoc-ki')}>
            <SidebarMenuButton tooltip={'Analytics'}>
              <IconChartBar />
              <span>học kỳ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>


          <SidebarMenuItem key={'Projects'}>
            <SidebarMenuButton tooltip={'Projects'}>
              <IconFolder />
              <span>Projects</span>
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
